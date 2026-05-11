# PowerShell wrapper for scripts/clean_build.py
#
# Usage:
#   .\scripts\clean_build.ps1                 # clean + install + build
#   .\scripts\clean_build.ps1 -Serve          # then serve .output/public
#   .\scripts\clean_build.ps1 -Tests          # also run playwright smoke
#   .\scripts\clean_build.ps1 -NoInstall      # skip pnpm install
#   .\scripts\clean_build.ps1 -Preset static  # different Nuxt preset
#
# Passes -Serve / -Tests / -NoInstall / -Preset through to the Python script.

[CmdletBinding()]
param(
    [switch]$Serve,
    [switch]$Tests,
    [switch]$NoInstall,
    [string]$Preset = "github_pages"
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$pyScript = Join-Path $scriptDir "clean_build.py"

if (-not (Test-Path $pyScript)) {
    Write-Error "clean_build.py not found at $pyScript"
    exit 1
}

# Resolve Python interpreter (prefer python3 -> python -> py launcher)
$python = $null
foreach ($candidate in @("python3", "python", "py")) {
    $cmd = Get-Command $candidate -ErrorAction SilentlyContinue
    if ($cmd) { $python = $cmd.Source; break }
}
if (-not $python) {
    Write-Error "No Python interpreter found on PATH (tried python3, python, py)."
    exit 127
}

$args = @($pyScript, "--preset", $Preset)
if ($NoInstall) { $args += "--no-install" }
if ($Tests)     { $args += "--tests" }
if ($Serve)     { $args += "--serve" }

Write-Host "==> $python $($args -join ' ')" -ForegroundColor Cyan
Push-Location $projectRoot
try {
    & $python @args
    $exitCode = $LASTEXITCODE
} finally {
    Pop-Location
}

exit $exitCode
