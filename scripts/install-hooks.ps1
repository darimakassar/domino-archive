# Memasang hook pre-commit yang memindai berkas staged dengan gitleaks.
# Jalankan manual dari dalam repo: powershell -File scripts/install-hooks.ps1
$ErrorActionPreference = 'Stop'

if (-not (Get-Command gitleaks -ErrorAction SilentlyContinue)) {
    Write-Error 'gitleaks belum terpasang. Lihat https://github.com/gitleaks/gitleaks#installing'
}

$hooksDir = git rev-parse --path-format=absolute --git-path hooks
$hookPath = Join-Path $hooksDir 'pre-commit'

# Tidak pernah menimpa hook yang sudah ada.
if (Test-Path $hookPath) {
    Write-Error "Hook sudah ada: $hookPath. Tidak ditimpa. Gabungkan manual jika perlu."
}

# Git for Windows menjalankan hook lewat sh, jadi isinya skrip sh dengan akhir baris LF tanpa BOM.
$hookBody = "#!/bin/sh`nexec gitleaks git --pre-commit --staged --redact --no-banner --verbose`n"
[System.IO.File]::WriteAllText($hookPath, $hookBody, (New-Object System.Text.UTF8Encoding $false))
Write-Output "Hook terpasang: $hookPath"
