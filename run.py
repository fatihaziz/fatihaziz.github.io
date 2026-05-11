#!/usr/bin/env python3
"""Run the Nuxt site in dev mode or clean-build for deploy.

Modes:
    build (default)  -> clean + install + nuxt build --preset <preset>
    dev              -> install + nuxt dev (hot reload at http://localhost:3000)

Usage:
    python run.py [build|dev] [--no-install] [--serve] [--preset PRESET]

Flags:
    --no-install   skip `pnpm install` (faster when lockfile is clean)
    --serve        after build, serve .output/public on http://localhost:4173
    --preset NAME  Nuxt build preset for build mode (default: github_pages)
"""
from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ARTIFACTS = [".nuxt", ".output", "dist", "node_modules/.cache", "node_modules/.vite"]


def banner(msg: str) -> None:
    line = "=" * (len(msg) + 4)
    print(f"\n{line}\n  {msg}\n{line}", flush=True)


def step(msg: str) -> None:
    print(f"-> {msg}", flush=True)


def run(cmd: list[str], cwd: Path = ROOT, check: bool = True) -> int:
    step(f"$ {' '.join(cmd)}")
    proc = subprocess.run(cmd, cwd=cwd, shell=False)
    if check and proc.returncode != 0:
        print(f"!! command failed (exit {proc.returncode}): {' '.join(cmd)}", file=sys.stderr)
        sys.exit(proc.returncode)
    return proc.returncode


def resolve_pnpm() -> list[str]:
    for name in ("pnpm", "pnpm.cmd"):
        path = shutil.which(name)
        if path:
            return [path]
    corepack = shutil.which("corepack") or shutil.which("corepack.cmd")
    if corepack:
        return [corepack, "pnpm"]
    print("!! pnpm not found on PATH. Install pnpm or enable corepack.", file=sys.stderr)
    sys.exit(127)


def clean() -> None:
    banner("CLEAN")
    for rel in ARTIFACTS:
        target = ROOT / rel
        if target.exists():
            step(f"rm -rf {rel}")
            shutil.rmtree(target, ignore_errors=True)
        else:
            step(f"skip {rel} (not present)")


def install(pnpm: list[str]) -> None:
    banner("INSTALL")
    run([*pnpm, "install"])


def build(pnpm: list[str], preset: str) -> None:
    banner(f"BUILD (preset={preset})")
    env = os.environ.copy()
    env["NITRO_PRESET"] = preset
    cmd = [*pnpm, "exec", "nuxt", "build", "--preset", preset]
    step(f"$ {' '.join(cmd)}")
    proc = subprocess.run(cmd, cwd=ROOT, env=env)
    if proc.returncode != 0:
        print(f"!! build failed (exit {proc.returncode})", file=sys.stderr)
        sys.exit(proc.returncode)


def dev(pnpm: list[str]) -> None:
    banner("DEV SERVER (nuxt dev)")
    step("starting on http://localhost:3000 (Ctrl+C to stop)")
    try:
        subprocess.run([*pnpm, "exec", "nuxt", "dev"], cwd=ROOT)
    except KeyboardInterrupt:
        print("\n-> dev server stopped", flush=True)


def serve(pnpm: list[str]) -> None:
    banner("SERVE .output/public")
    out = ROOT / ".output" / "public"
    if not out.exists():
        print(f"!! no build output at {out}", file=sys.stderr)
        sys.exit(1)
    step("starting npx serve on http://localhost:4173 (Ctrl+C to stop)")
    try:
        subprocess.run([*pnpm, "dlx", "serve", str(out), "-l", "4173"], cwd=ROOT)
    except KeyboardInterrupt:
        print("\n-> serve stopped", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run or build the Nuxt site.")
    parser.add_argument(
        "mode",
        nargs="?",
        default="build",
        choices=["build", "dev"],
        help="build (default) or dev",
    )
    parser.add_argument("--no-install", action="store_true", help="skip pnpm install")
    parser.add_argument("--serve", action="store_true", help="serve .output/public after build")
    parser.add_argument("--preset", default="github_pages", help="Nuxt build preset (build mode only)")
    args = parser.parse_args()

    start = time.time()
    pnpm = resolve_pnpm()
    print(f"[i] using pnpm: {' '.join(pnpm)}", flush=True)
    print(f"[i] project root: {ROOT}", flush=True)
    print(f"[i] mode: {args.mode}", flush=True)

    if args.mode == "dev":
        if not args.no_install:
            install(pnpm)
        dev(pnpm)
        return

    clean()
    if not args.no_install:
        install(pnpm)
    build(pnpm, args.preset)

    elapsed = time.time() - start
    banner(f"DONE in {elapsed:.1f}s -- output at .output/public")

    if args.serve:
        serve(pnpm)


if __name__ == "__main__":
    main()
