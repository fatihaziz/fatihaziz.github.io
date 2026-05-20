"""
deploy_fly.py -- macOS Fly.io deployer for a monorepo subproject.

Brew install one-liner (optional):
    brew install flyctl gh
    fly auth login
    gh auth login

Pipeline
--------
1.  Prereqs : locate `flyctl`/`fly` and `gh` (PATH + ~/.fly/bin +
              /usr/local/bin + /opt/homebrew/bin). Auto-install flyctl
              via the official installer if missing. Confirm both CLIs
              are authenticated.
2.  Sync    : copy the project (PROJECT_DIR = scripts/..) into a sibling
              sandbox <monorepo>/_deploy-flyio/<APP_NAME>/. Preserve the
              sandbox `.git` across the rebuild. Drop in a `.gitignore`.
3.  GitHub  : init git inside the sandbox if needed; create the GitHub
              repo via `gh repo create --private --source . --push` or
              push updates if the repo already exists.
4.  Fly app : create the Fly.io app + persistent volume if absent
              (full-pipeline mode only).
5.  Secrets : pump non-FLY_/non-CF_ entries from .env via a single
              `fly secrets set`.
6.  Deploy  : `fly deploy --ha=false --local-only`; on failure fall
              back to the remote builder (`fly deploy --ha=false`).
7.  Status  : `fly status -a <APP>` + Dashboard / Live / (CF) URLs.

Usage
-----
    python3 scripts/deploy_fly.py             # full pipeline (first deploy)
    python3 scripts/deploy_fly.py --deploy    # sync + push + secrets + deploy
    python3 scripts/deploy_fly.py --sync      # sandbox refresh only
    python3 scripts/deploy_fly.py --status
    python3 scripts/deploy_fly.py --logs
    python3 scripts/deploy_fly.py --open
    python3 scripts/deploy_fly.py --purge-db  # interactive 'purge' prompt
    python3 scripts/deploy_fly.py --destroy   # interactive app-name prompt

Required .env keys (alongside scripts/, in PROJECT_DIR):
    FLY_APP_NAME, FLY_GITHUB_REPO, FLY_VOLUME_NAME

Optional .env keys:
    FLY_REGION (default 'sin'), FLY_VOLUME_SIZE_GB (default 1),
    CF_DOMAIN  (used only for the final 'DONE' URL).

Any other KEY=VALUE pair is treated as a Fly.io secret and pushed
via `fly secrets set` (FLY_* and CF_* keys are NEVER pushed).
"""

import argparse
import json
import os
import shlex
import shutil
import stat
import subprocess
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Paths and constants
# ---------------------------------------------------------------------------

SCRIPT_DIR  = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPT_DIR.parent
ENV_FILE    = PROJECT_DIR / ".env"

# Build source. If the project has a frontend/ subdir with its own
# package.json + Dockerfile, that's the Fly build context. Otherwise
# we ship the whole project root.
_FRONTEND = PROJECT_DIR / "frontend"
SOURCE_DIR = (
    _FRONTEND
    if (_FRONTEND / "package.json").is_file() and (_FRONTEND / "Dockerfile").is_file()
    else PROJECT_DIR
)

# PATH lookups beyond os.environ['PATH']. Apple Silicon Homebrew lives at
# /opt/homebrew; Intel Homebrew at /usr/local; flyctl installer drops a
# binary at ~/.fly/bin.
EXTRA_PATHS = [
    str(Path.home() / ".fly" / "bin"),
    "/opt/homebrew/bin",
    "/usr/local/bin",
]

REQUIRED_ENV_KEYS = ["FLY_APP_NAME", "FLY_VOLUME_NAME"]
OPTIONAL_ENV_DEFAULTS = {
    "FLY_REGION":         "sin",
    "FLY_VOLUME_SIZE_GB": "1",
    "CF_DOMAIN":          "",
    "FLY_ENABLE_GITHUB":  "0",
    "FLY_GITHUB_REPO":    "",
}

# Files / dirs excluded from the sandbox copy.
# DIVERGENCE FROM VAULT TEMPLATE (__standards/flyio-deployment): the vault assumes
# data/ holds only the SQLite file and excludes the whole dir. THIS repo keeps
# SOURCE under data/ for three pages -- data/journal-themes.ts, data/love-letter.ts,
# data/novel-laut.ts (the last two power CLAUDE.md "do not touch" pages, so they
# can't be relocated). So exclude only the SQLite *files* (*.db*), never the data/
# dir, and add the Node build-artifact dirs the Go template never had.
EXCLUDE_PATTERNS = [
    ".git", ".claude", "__pycache__", ".next", "node_modules",
    ".nuxt", ".output", ".nitro", ".cache",
    "*.exe", "*.db", "*.db-shm", "*.db-wal",
    ".env", ".env.local",
    "coverage", "playwright-report", "test-results", "e2e",
]

SANDBOX_GITIGNORE = """\
*.exe
*.db
*.db-shm
*.db-wal
.env
.claude/
config.json
"""


# ---------------------------------------------------------------------------
# Output helpers (ASCII only, no emoji)
# ---------------------------------------------------------------------------

def info(msg): print(f"[*] {msg}")
def warn(msg): print(f"[!] {msg}")
def err(msg):  print(f"[ERROR] {msg}")
def ok(msg):   print(f"[OK] {msg}")


# ---------------------------------------------------------------------------
# .env parsing
# ---------------------------------------------------------------------------

def parse_env_file(path: Path) -> dict:
    """Parse a KEY=VALUE .env file. Comments (#) and blank lines ignored."""
    out: dict[str, str] = {}
    if not path.is_file():
        return out
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, val = line.split("=", 1)
        key = key.strip()
        val = val.strip()
        if len(val) >= 2 and val[0] == val[-1] and val[0] in ('"', "'"):
            val = val[1:-1]
        if key:
            out[key] = val
    return out


def load_env() -> dict:
    """Read .env, validate required keys, apply optional defaults."""
    env = parse_env_file(ENV_FILE)
    missing = [k for k in REQUIRED_ENV_KEYS if not env.get(k)]
    if missing:
        err(f"Missing required key(s) in {ENV_FILE}:")
        for k in missing:
            print(f"  - {k}")
        sys.exit(1)
    for k, default in OPTIONAL_ENV_DEFAULTS.items():
        env.setdefault(k, default)
    try:
        int(env["FLY_VOLUME_SIZE_GB"])
    except ValueError:
        err(f"FLY_VOLUME_SIZE_GB must be an int, got {env['FLY_VOLUME_SIZE_GB']!r}")
        sys.exit(1)
    if env["FLY_ENABLE_GITHUB"] == "1" and not env["FLY_GITHUB_REPO"]:
        err("FLY_ENABLE_GITHUB=1 but FLY_GITHUB_REPO is empty.")
        sys.exit(1)
    # Auto-export FLY_API_TOKEN so every `fly` subprocess inherits it.
    # Lets users skip the interactive `fly auth login` browser flow.
    if env.get("FLY_API_TOKEN"):
        os.environ["FLY_API_TOKEN"] = env["FLY_API_TOKEN"]
    return env


# ---------------------------------------------------------------------------
# Executable discovery + subprocess wrapper
# ---------------------------------------------------------------------------

def find_executable(candidates: list[str]) -> str | None:
    """Look for the first matching binary on PATH or in EXTRA_PATHS."""
    for name in candidates:
        found = shutil.which(name)
        if found:
            return found
        for extra in EXTRA_PATHS:
            cand = Path(extra) / name
            if cand.is_file() and os.access(cand, os.X_OK):
                return str(cand)
    return None


def quote_path(p: str) -> str:
    """Quote a binary path; spaces shouldn't appear in /opt/homebrew/bin
    style locations but be defensive."""
    return shlex.quote(p)


def run_cmd(cmd, cwd: Path | None = None, check: bool = False,
            capture: bool = False) -> subprocess.CompletedProcess:
    """Run a command. ALWAYS print it first (visible audit log)."""
    if isinstance(cmd, list):
        shown = " ".join(shlex.quote(c) for c in cmd)
    else:
        shown = cmd
    print(f"    $ {shown}")
    return subprocess.run(
        cmd,
        cwd=str(cwd) if cwd else None,
        shell=isinstance(cmd, str),
        check=check,
        text=True,
        capture_output=capture,
    )


# ---------------------------------------------------------------------------
# Filesystem helpers
# ---------------------------------------------------------------------------

def _on_rm_error(func, path, exc_info):
    """rmtree handler: chmod +rw and retry."""
    try:
        os.chmod(path, stat.S_IWRITE | stat.S_IREAD)
        func(path)
    except Exception:
        pass


def rmtree_safe(path: Path) -> None:
    """`shutil.rmtree` that survives permission-denied. Uses onexc on 3.12+,
    onerror on older interpreters."""
    if not path.exists():
        return
    try:
        shutil.rmtree(path, onexc=_on_rm_error)  # Python 3.12+
    except TypeError:
        shutil.rmtree(path, onerror=_on_rm_error)


# ---------------------------------------------------------------------------
# Prerequisite checks
# ---------------------------------------------------------------------------

def ensure_flyctl() -> str:
    fly = find_executable(["flyctl", "fly"])
    if fly:
        info(f"flyctl: {fly}")
        return fly
    info("flyctl not found. Installing via official installer ...")
    try:
        subprocess.run("curl -L https://fly.io/install.sh | sh",
                       shell=True, check=True)
    except subprocess.CalledProcessError:
        err("flyctl install failed. See https://fly.io/docs/flyctl/install/")
        sys.exit(1)
    fly = find_executable(["flyctl", "fly"])
    if not fly:
        err("flyctl still missing after install. "
            "See https://fly.io/docs/flyctl/install/")
        sys.exit(1)
    info(f"flyctl installed at: {fly}")
    return fly


def ensure_gh() -> str:
    gh = find_executable(["gh"])
    if gh:
        info(f"gh: {gh}")
        return gh
    err("GitHub CLI (gh) not found. Install with: brew install gh")
    sys.exit(1)


def ensure_fly_auth(fly: str) -> None:
    has_token = bool(os.environ.get("FLY_API_TOKEN"))
    r = subprocess.run([fly, "auth", "whoami"],
                       capture_output=True, text=True)
    blob = (r.stdout + r.stderr).lower()
    bad = r.returncode != 0 or "not logged" in blob or (
        "error" in blob and "logged in" not in blob
    )
    if bad:
        if has_token:
            err("FLY_API_TOKEN is set but `fly auth whoami` rejected it.")
            err("Token may be revoked / expired. Regenerate with:")
            err("    fly auth token                          (full account)")
            err("    fly tokens create deploy -a <APP_NAME>  (scoped, safer)")
            sys.exit(1)
        info("Fly.io: not logged in. Opening browser login ...")
        subprocess.run([fly, "auth", "login"])
    else:
        info(f"Fly.io auth: {r.stdout.strip()}")


def ensure_gh_auth(gh: str) -> None:
    r = subprocess.run([gh, "auth", "status"],
                       capture_output=True, text=True)
    if r.returncode != 0:
        err("GitHub CLI not authenticated. Run: gh auth login")
        sys.exit(1)
    info("GitHub auth: OK")


# ---------------------------------------------------------------------------
# Phase 2 -- sync
# ---------------------------------------------------------------------------

def sync_files(env: dict, deploy_dir: Path) -> None:
    if SOURCE_DIR.resolve() == deploy_dir.resolve():
        warn("SOURCE_DIR == DEPLOY_DIR. Skipping sync to prevent recursion.")
        return

    info(f"Syncing {SOURCE_DIR} -> {deploy_dir}")
    deploy_dir.parent.mkdir(parents=True, exist_ok=True)

    # Preserve existing .git in the sandbox across the wipe.
    backup = deploy_dir.parent / f".git_backup_{env['FLY_APP_NAME']}"
    git_dir = deploy_dir / ".git"
    if git_dir.is_dir():
        if backup.exists():
            rmtree_safe(backup)
        shutil.move(str(git_dir), str(backup))
        info(f"  preserved .git -> {backup}")

    if deploy_dir.exists():
        rmtree_safe(deploy_dir)

    # dirs_exist_ok=True survives the case where rmtree silently failed to
    # remove the top-level dir itself (Windows file lock from explorer open
    # in path, prior bun/next process, etc). copytree then merges into the
    # empty leftover dir instead of erroring on os.makedirs(exist_ok=False).
    shutil.copytree(
        SOURCE_DIR,
        deploy_dir,
        ignore=shutil.ignore_patterns(*EXCLUDE_PATTERNS),
        dirs_exist_ok=True,
    )

    if backup.exists():
        shutil.move(str(backup), str(deploy_dir / ".git"))
        info("  restored .git into sandbox")

    (deploy_dir / ".gitignore").write_text(SANDBOX_GITIGNORE, encoding="utf-8")

    file_count = sum(1 for p in deploy_dir.rglob("*") if p.is_file())
    ok(f"Sandbox refreshed. {file_count} files in {deploy_dir}")


# ---------------------------------------------------------------------------
# Phase 3 -- GitHub
# ---------------------------------------------------------------------------

def setup_github(gh: str, env: dict, deploy_dir: Path) -> None:
    repo = env["FLY_GITHUB_REPO"]
    app  = env["FLY_APP_NAME"]

    if not (deploy_dir / ".git").is_dir():
        info("Initialising git in sandbox ...")
        run_cmd("git init -b main", cwd=deploy_dir)
        run_cmd("git add -A", cwd=deploy_dir)
        run_cmd(f'git commit -m "Initial commit: {app}"', cwd=deploy_dir)

    probe = subprocess.run(
        [gh, "repo", "view", repo],
        cwd=str(deploy_dir),
        capture_output=True, text=True,
    )
    if probe.returncode != 0:
        info(f"Creating GitHub repo {repo} ...")
        cmd = (
            f"{quote_path(gh)} repo create {shlex.quote(repo)} "
            f"--private --source . --push "
            f"--description {shlex.quote(app)}"
        )
        r = run_cmd(cmd, cwd=deploy_dir)
        if r.returncode != 0:
            err("gh repo create failed.")
            sys.exit(1)
    else:
        info(f"GitHub repo {repo} exists. Pushing updates ...")
        run_cmd("git add -A", cwd=deploy_dir)
        # Allowed to fail when no diff / no commits to push
        subprocess.run('git commit -m "Update deployment"',
                       cwd=str(deploy_dir), shell=True)
        subprocess.run("git push -u origin main",
                       cwd=str(deploy_dir), shell=True)


# ---------------------------------------------------------------------------
# Phase 4 -- Fly.io app + volume
# ---------------------------------------------------------------------------

def _json_name(entry: dict) -> str | None:
    return entry.get("Name") or entry.get("name")


def app_exists(fly: str, app: str) -> bool:
    r = subprocess.run([fly, "apps", "list", "--json"],
                       capture_output=True, text=True)
    if r.returncode != 0:
        return False
    try:
        data = json.loads(r.stdout or "[]")
    except json.JSONDecodeError:
        return False
    return any(_json_name(e) == app for e in data)


def create_app(fly: str, env: dict) -> None:
    app = env["FLY_APP_NAME"]
    if app_exists(fly, app):
        info(f"App {app} already exists.")
        return
    info(f"Creating Fly.io app {app} ...")
    r = run_cmd([fly, "apps", "create", app, "--org", "personal"])
    if r.returncode != 0:
        err("fly apps create failed.")
        sys.exit(1)


def volume_exists(fly: str, app: str, vol: str) -> bool:
    r = subprocess.run([fly, "volumes", "list", "-a", app, "--json"],
                       capture_output=True, text=True)
    if r.returncode != 0:
        return False
    try:
        data = json.loads(r.stdout or "[]")
    except json.JSONDecodeError:
        return False
    return any(_json_name(e) == vol for e in data)


def create_volume(fly: str, env: dict) -> None:
    app    = env["FLY_APP_NAME"]
    vol    = env["FLY_VOLUME_NAME"]
    region = env["FLY_REGION"]
    size   = env["FLY_VOLUME_SIZE_GB"]
    if volume_exists(fly, app, vol):
        info(f"Volume {vol} on {app} already exists.")
        return
    info(f"Creating volume {vol} on {app} ({region}, {size} GB) ...")
    r = run_cmd([fly, "volumes", "create", vol,
                 "-a", app, "-r", region, "-s", size, "-y"])
    if r.returncode != 0:
        err("fly volumes create failed.")
        sys.exit(1)


# ---------------------------------------------------------------------------
# Phase 5 -- secrets
# ---------------------------------------------------------------------------

# .env.template values that should never reach Fly.io secrets. Any value
# matching one of these (or wrapped in <angle brackets>) is treated as an
# un-filled placeholder and skipped. Without this guard, a first-time user
# who copies .env.template -> .env and runs --deploy will overwrite real
# secrets (e.g., DATABASE_URL set by `fly postgres attach`) with the literal
# placeholder string, breaking the release_command's DB connect.
PLACEHOLDER_VALUES = {
    "postgres://user:pass@host:5432/dbname",
    "postgres://user:pass@localhost:5432/dbname",
}


def _is_placeholder(val: str) -> bool:
    if not val:
        return True
    if val.startswith("<") and val.endswith(">"):
        return True
    return val in PLACEHOLDER_VALUES


def set_fly_secrets(fly: str, env: dict) -> None:
    app = env["FLY_APP_NAME"]
    candidates = {
        k: v for k, v in env.items()
        if v and not k.startswith("FLY_") and not k.startswith("CF_")
    }
    real = {k: v for k, v in candidates.items() if not _is_placeholder(v)}
    skipped = sorted(set(candidates) - set(real))
    if skipped:
        warn(f"Skipping placeholder secret(s): {', '.join(skipped)}. "
             f"Set real values in .env or push manually via `fly secrets set`.")
    if not real:
        info("No real application secrets to push.")
        return
    info(f"Pushing {len(real)} secret(s) to {app} ...")
    # List-form subprocess call (not shell=True). Pass each KEY=VALUE as its own
    # argv entry so flyctl gets clean tokens. shell-string + shlex.quote breaks
    # on Windows because cmd.exe rejects single-quoted paths like
    # 'C:\Users\...\flyctl.EXE' -- the surrounding shlex.quote on a path
    # containing backslashes wraps it in single quotes that cmd.exe parses as
    # "filename, directory name, or volume label syntax is incorrect".
    args = [fly, "secrets", "set"] + [f"{k}={v}" for k, v in real.items()] + ["-a", app]
    r = run_cmd(args)
    if r.returncode != 0:
        warn("fly secrets set failed. Continuing -- set them manually "
             "before the next deploy.")
    else:
        ok("Secrets pushed.")


# ---------------------------------------------------------------------------
# Phase 6 -- deploy
# ---------------------------------------------------------------------------

def deploy(fly: str, env: dict, deploy_dir: Path) -> None:
    app = env["FLY_APP_NAME"]
    info(f"Deploying {app} (local Docker build first) ...")
    r = run_cmd([fly, "deploy", "--ha=false", "--local-only"], cwd=deploy_dir)
    if r.returncode == 0:
        ok("Deployed via local Docker build.")
        return
    warn("Local build failed. Falling back to Fly.io remote builder ...")
    r = run_cmd([fly, "deploy", "--ha=false"], cwd=deploy_dir)
    if r.returncode != 0:
        err("Deploy failed (both local and remote builder paths).")
        sys.exit(1)
    ok("Deployed via Fly.io remote builder.")


# ---------------------------------------------------------------------------
# Phase 7 + read-only ops
# ---------------------------------------------------------------------------

def show_status(fly: str, env: dict) -> None:
    app = env["FLY_APP_NAME"]
    run_cmd([fly, "status", "-a", app])
    print()
    print(f"  Dashboard : https://fly.io/apps/{app}")
    print(f"  Live URL  : https://{app}.fly.dev")
    if env.get("CF_DOMAIN"):
        print(f"  CF URL    : https://{env['CF_DOMAIN']}")


def show_logs(fly: str, env: dict) -> None:
    app = env["FLY_APP_NAME"]
    info(f"Tailing logs for {app}. Ctrl+C to stop.")
    subprocess.run([fly, "logs", "-a", app])


def open_app(env: dict) -> None:
    app = env["FLY_APP_NAME"]
    url = f"https://{env['CF_DOMAIN']}" if env.get("CF_DOMAIN") \
          else f"https://{app}.fly.dev"
    info(f"Opening {url}")
    if sys.platform == "darwin":
        subprocess.run(["open", url])
    else:
        subprocess.run(["xdg-open", url])


# ---------------------------------------------------------------------------
# Destructive ops -- interactive exact-match confirmation
# ---------------------------------------------------------------------------

def confirm_exact(banner: str, expected: str) -> bool:
    print(banner)
    typed = input(f"Type exactly  {expected}  to confirm: ").strip()
    if typed != expected:
        err("Confirmation did not match. Aborted.")
        return False
    return True


def purge_db(fly: str, env: dict) -> None:
    app = env["FLY_APP_NAME"]
    banner = (
        f"\n[!] This will DELETE /data/data.db (+ -wal, -shm) on {app}.\n"
        "    The SQLite file on the persistent volume will be gone.\n"
    )
    if not confirm_exact(banner, "purge"):
        return
    cmd = (
        f'{quote_path(fly)} ssh console -a {shlex.quote(app)} '
        f'-C "rm -f /data/data.db /data/data.db-wal /data/data.db-shm"'
    )
    r = run_cmd(cmd)
    if r.returncode == 0:
        ok("Purge command sent.")
    else:
        err("Purge failed. Check `fly ssh console` access.")


def destroy_app(fly: str, env: dict) -> None:
    app = env["FLY_APP_NAME"]
    banner = (
        f"\n[!] This will PERMANENTLY DESTROY Fly.io app {app!r}.\n"
        "    Machines, volume, secrets, certs -- all gone.\n"
    )
    if not confirm_exact(banner, app):
        return
    r = run_cmd([fly, "apps", "destroy", app, "-y"])
    if r.returncode == 0:
        ok(f"App {app} destroyed.")
    else:
        err("Destroy failed.")


# ---------------------------------------------------------------------------
# Final banner
# ---------------------------------------------------------------------------

def finish_banner(env: dict) -> None:
    app = env["FLY_APP_NAME"]
    url = f"https://{env['CF_DOMAIN']}" if env.get("CF_DOMAIN") \
          else f"https://{app}.fly.dev"
    print()
    print("=" * 60)
    print(f"  DONE!  Live at: {url}")
    print("=" * 60)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Deploy a monorepo subproject to Fly.io (macOS port).",
    )
    g = p.add_mutually_exclusive_group()
    g.add_argument("--deploy",   action="store_true",
                   help="Sync + push + secrets + deploy (no app/volume create).")
    g.add_argument("--sync",     action="store_true",
                   help="Refresh the sandbox only.")
    g.add_argument("--status",   action="store_true",
                   help="Print fly status + URLs.")
    g.add_argument("--logs",     action="store_true",
                   help="Tail fly logs.")
    g.add_argument("--open",     dest="open_flag", action="store_true",
                   help="Open the live URL in the default browser.")
    g.add_argument("--purge-db", dest="purge_db", action="store_true",
                   help="Wipe /data/data.db on the Fly machine.")
    g.add_argument("--destroy",  action="store_true",
                   help="Destroy the Fly.io app.")
    return p.parse_args()


def main() -> None:
    args = parse_args()
    env  = load_env()

    deploy_dir = (
        PROJECT_DIR.parent / "_deploy-flyio" / env["FLY_APP_NAME"]
    )

    gh_enabled = env["FLY_ENABLE_GITHUB"] == "1"

    info(f"Project   : {PROJECT_DIR}")
    info(f"Source    : {SOURCE_DIR}")
    info(f"Sandbox   : {deploy_dir}")
    info(f"App       : {env['FLY_APP_NAME']}")
    if gh_enabled:
        info(f"Repo      : {env['FLY_GITHUB_REPO']}")
    else:
        info("Repo      : (GitHub mirror disabled; FLY_ENABLE_GITHUB=1 to enable)")
    info(f"Volume    : {env['FLY_VOLUME_NAME']} "
         f"({env['FLY_VOLUME_SIZE_GB']} GB, {env['FLY_REGION']})")
    print()

    fly = ensure_flyctl()
    gh  = ensure_gh() if gh_enabled else None

    # Read-only commands return early without touching the sandbox.
    if args.open_flag:
        open_app(env)
        return
    if args.status:
        ensure_fly_auth(fly)
        show_status(fly, env)
        return
    if args.logs:
        ensure_fly_auth(fly)
        show_logs(fly, env)
        return

    # Mutating commands require both authentications upfront.
    ensure_fly_auth(fly)
    if gh_enabled:
        ensure_gh_auth(gh)

    if args.purge_db:
        purge_db(fly, env)
        return
    if args.destroy:
        destroy_app(fly, env)
        return

    if args.sync:
        sync_files(env, deploy_dir)
        return

    if args.deploy:
        sync_files(env, deploy_dir)
        if gh_enabled:
            setup_github(gh, env, deploy_dir)
        set_fly_secrets(fly, env)
        deploy(fly, env, deploy_dir)
        show_status(fly, env)
        finish_banner(env)
        return

    # No flag -> full first-time pipeline.
    sync_files(env, deploy_dir)
    if gh_enabled:
        setup_github(gh, env, deploy_dir)
    create_app(fly, env)
    create_volume(fly, env)
    set_fly_secrets(fly, env)
    deploy(fly, env, deploy_dir)
    show_status(fly, env)
    finish_banner(env)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        err("Interrupted.")
        sys.exit(130)
