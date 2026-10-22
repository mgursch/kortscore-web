#!/usr/bin/env bash
# Holt die ITN-Rechenlogik aus dem App-Repo (kortform-kmp, Modul :itn-core)
# als ES-Modul nach static/assets/js/itn-core.mjs.
#
# Die Rechnung selbst existiert nur in Kotlin. Dieses Skript baut daraus das
# JavaScript und legt es mit Herkunft (Repo, Commit) im Dateikopf ab. Die
# Datei wird committet, damit der Deploy der oeffentlichen Website keinen
# Zugriff auf das private App-Repo braucht.
#
# Aufruf: tools/sync_itn_core.sh [pfad-zum-app-repo]
# Standard ist der lokale Checkout neben diesem Repo.
set -euo pipefail

WEB_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_ROOT="${1:-$HOME/Documents/androidStudioProjects/itn-rechner}"
APP_ROOT="$(cd "$APP_ROOT" && pwd)"
OUT="$WEB_ROOT/static/assets/js/itn-core.mjs"
BUILT="$APP_ROOT/itn-core/build/compileSync/js/main/productionExecutable/kotlin/itn-core.mjs"

if [ ! -f "$APP_ROOT/itn-core/build.gradle.kts" ]; then
  echo "Kein Modul :itn-core in $APP_ROOT" >&2
  exit 1
fi

# Ein einziges ES-Modul ohne Stdlib-Chunk (granularity=whole-program in
# itn-core/gradle.properties). Webpack wuerde UMD liefern, deshalb nicht.
(cd "$APP_ROOT" && ./gradlew --quiet :itn-core:jsProductionExecutableCompileSync)

SHA="$(git -C "$APP_ROOT" rev-parse --short HEAD)"
DIRTY=""
if [ -n "$(git -C "$APP_ROOT" status --porcelain -- itn-core)" ]; then
  DIRTY=" (mit uncommitteten Aenderungen in itn-core/)"
fi

mkdir -p "$(dirname "$OUT")"
{
  echo "// GENERIERT, nicht bearbeiten. Quelle: kortform-kmp, Modul :itn-core, Commit $SHA$DIRTY."
  echo "// Neu erzeugen mit tools/sync_itn_core.sh."
  cat "$BUILT"
} > "$OUT"

echo "static/assets/js/itn-core.mjs aus $SHA$DIRTY ($(wc -c < "$OUT" | tr -d ' ') Bytes)"
