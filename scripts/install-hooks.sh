#!/bin/sh
# Memasang hook pre-commit yang memindai berkas staged dengan gitleaks.
# Jalankan manual dari dalam repo: sh scripts/install-hooks.sh
set -eu

if ! command -v gitleaks >/dev/null 2>&1; then
  echo "gitleaks belum terpasang. Lihat https://github.com/gitleaks/gitleaks#installing" >&2
  exit 1
fi

hook_path="$(git rev-parse --path-format=absolute --git-path hooks)/pre-commit"

# Tidak pernah menimpa hook yang sudah ada.
if [ -e "$hook_path" ]; then
  echo "Hook sudah ada: $hook_path. Tidak ditimpa. Gabungkan manual jika perlu." >&2
  exit 1
fi

cat > "$hook_path" <<'HOOK'
#!/bin/sh
exec gitleaks git --pre-commit --staged --redact --no-banner --verbose
HOOK
chmod +x "$hook_path"
echo "Hook terpasang: $hook_path"
