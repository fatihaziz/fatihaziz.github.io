# PowerShell wrapper for run.py
#
# Usage:
#   .\run.ps1                  # clean + install + build (preset github_pages)
#   .\run.ps1 dev              # install + nuxt dev (hot reload localhost:3000)
#   .\run.ps1 build            # explicit build (same as default)
#   .\run.ps1 -Serve           # build then serve .output/public
#   .\run.ps1 -NoInstall       # skip pnpm install
#   .\run.ps1 -Preset static   # different Nuxt build preset
#
# Python resolution order:
#   1. py -3       (Windows launcher; most reliable on Windows)
#   2. python      (skips Microsoft Store WindowsApps shim)
#   3. python3     (skips Microsoft Store WindowsApps shim)
# Microsoft Store stub aliases under WindowsApps are filtered out -- they
# print "Python was not found" instead of running anything.

[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [ValidateSet("build", "dev", "")]
    [string]$Mode = "",
    [switch]$Serve,
    [switch]$NoInstall,
    [string]$Preset = "github_pages"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pyScript    = Join-Path $projectRoot "run.py"

if (-not (Test-Path $pyScript)) {
    Write-Error "run.py not found at $pyScript"
    exit 1
}

function Test-RealPython {
    param([string]$Source)
    if (-not $Source) { return $false }
    # Microsoft Store alias lives under WindowsApps and is a 0-byte reparse stub.
    if ($Source -match "WindowsApps") { return $false }
    return $true
}

# Find a real Python (not the Store shim).
$pythonCmd = $null
$pythonArgs = @()

# 1) Windows py launcher
$pyLauncher = Get-Command "py" -ErrorAction SilentlyContinue
if ($pyLauncher -and (Test-RealPython $pyLauncher.Source)) {
    $pythonCmd  = $pyLauncher.Source
    $pythonArgs = @("-3")
}

# 2) python.exe (filter Store shim)
if (-not $pythonCmd) {
    foreach ($cmd in (Get-Command "python" -ErrorAction SilentlyContinue -All)) {
        if (Test-RealPython $cmd.Source) {
            $pythonCmd = $cmd.Source
            break
        }
    }
}

# 3) python3.exe (filter Store shim)
if (-not $pythonCmd) {
    foreach ($cmd in (Get-Command "python3" -ErrorAction SilentlyContinue -All)) {
        if (Test-RealPython $cmd.Source) {
            $pythonCmd = $cmd.Source
            break
        }
    }
}

if (-not $pythonCmd) {
    Write-Error @"
No real Python interpreter found on PATH.
Tried: py -3, python, python3 (Microsoft Store shims under WindowsApps filtered out).

Install options:
  winget install Python.Python.3.12
  choco install python
  scoop install python
Then reopen the shell and re-run.
"@
    exit 127
}

$scriptArgs = $pythonArgs + @($pyScript)
if ($Mode -ne "") { $scriptArgs += $Mode }
$scriptArgs += @("--preset", $Preset)
if ($NoInstall) { $scriptArgs += "--no-install" }
if ($Serve)     { $scriptArgs += "--serve" }

Write-Host "==> $pythonCmd $($scriptArgs -join ' ')" -ForegroundColor Cyan
Push-Location $projectRoot
try {
    & $pythonCmd @scriptArgs
    $exitCode = $LASTEXITCODE
} finally {
    Pop-Location
}

exit $exitCode
