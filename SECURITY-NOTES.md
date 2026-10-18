# Catatan Keamanan

- Repositori publik ini hanya berisi README, LICENSE, dan prototipe statis `proto/` (data ilustratif).
- Jangan commit: `*.nsf`, `*.id`, `.env*`, kunci (`*.pem`, `*.key`, `*.p12`), dump data, atau dokumen spesifikasi/arsitektur. Semua itu hanya untuk repositori privat.
- Pasang pemindai rahasia sebelum commit (gitleaks harus sudah terpasang):
  - PowerShell: `powershell -File scripts/install-hooks.ps1`
  - Git Bash: `sh scripts/install-hooks.sh`
- Hook tidak terpasang otomatis. Skrip menolak menimpa hook pre-commit yang sudah ada.
