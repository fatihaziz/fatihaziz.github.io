<#
.SYNOPSIS
    Fly.io deployment wrapper.

.DESCRIPTION
    Finds Python 3, runs deploy_fly.py with all arguments forwarded.

.EXAMPLE
    .\scripts\deploy_fly.ps1              # Full setup (first time)
    .\scripts\deploy_fly.ps1 --deploy     # Redeploy (sync + deploy)
    .\scripts\deploy_fly.ps1 --status     # Check app status
    .\scripts\deploy_fly.ps1 --logs       # Tail logs
    .\scripts\deploy_fly.ps1 --open       # Open app in browser
    .\scripts\deploy_fly.ps1 --destroy    # Tear down app
#>

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PyScript = Join-Path $ScriptDir "deploy_fly.py"

# Find Python (try py launcher first, then python3, then python)
$Python = $null
foreach ($cmd in @("py -3", "python3", "python")) {
    try {
        $ver = & ($cmd.Split(" ")[0]) @($cmd.Split(" ") | Select-Object -Skip 1) --version 2>&1
        if ($ver -match "Python 3") {
            $Python = $cmd
            break
        }
    } catch { }
}

if (-not $Python) {
    Write-Host "[ERROR] Python 3 not found. Install from https://python.org" -ForegroundColor Red
    exit 1
}

Write-Host "Using: $Python" -ForegroundColor DarkGray

# Forward all arguments to the Python script
$allArgs = @($PyScript) + $args
if ($Python -eq "py -3") {
    & py -3 @allArgs
} else {
    & $Python.Split(" ")[0] @allArgs
}

exit $LASTEXITCODE
