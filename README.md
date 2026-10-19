# Boulder Rush

Ein Boulder-Dash-Klon fürs Handy: automatisch erzeugte Höhlen, präzise Touch-Steuerung, Retro-Pixelgrafik,
XP-Stufen mit Skillbaum und sammelbare, aufwertbare Power-ups. Dazu Tagesherausforderung, Bonus- und Bosswelten,
Ausrüstung aus Truhen, 33 Avatare als Hommage an Spiel-, Film- und Comic-Helden, Halloween-, Weihnachts- und Oster-Design, Erfolge,
Geist-Replay der eigenen Bestzeit, Minikarte und Zeitsprung.

## Spielen
- **Android-App:** unter [Releases → apk-latest](../../releases/tag/apk-latest) `boulder-rush.apk` auf dem Handy herunterladen und installieren.
  Jeder Push auf `main` baut die App neu, und neue Versionen lassen sich über die alte installieren, ohne dass der Spielstand verloren geht.
- **Browser:** `src/game.html` ist dieselbe Datei, die als claude.ai-Artifact veröffentlicht ist.

## Aufbau
| Pfad | Inhalt |
| --- | --- |
| `src/game.html` | Das ganze Spiel (Canvas + JavaScript, keine Abhängigkeiten) |
| `scripts/build-web.mjs` | Baut daraus `www/index.html` für die App und bündelt die Pixel-Schriften offline |
| `android/` | Capacitor-Android-Projekt (Vollbild, Zurück-Taste, App-Icon) |
| `.github/workflows/android.yml` | Baut bei jedem Push die APK und hängt sie an das Release `apk-latest` |

## Lokal bauen
```sh
npm ci
npm run sync            # www/ erzeugen und ins Android-Projekt kopieren
cd android && ./gradlew assembleRelease
```
Die APK ist mit `android/app/boulder-rush-sideload.keystore` signiert. Der Schlüssel liegt absichtlich im Repo,
damit jeder Build dieselbe Signatur hat. Für eine Veröffentlichung im Play Store bräuchte es einen eigenen, geheimen Schlüssel.

## Spielmechanik in Kürze
- Welten werden aus ihrer Nummer erzeugt (fester Seed). Nach einem Physik-Vorlauf prüft eine Wegsuche, ob Ausgang und genug
  Diamanten erreichbar sind; wenn nicht, werden Gänge freigegraben.
- Ab Welt 8 gibt es Zauberwände, ab Welt 12 wachsenden Schleim (Amöbe), ab Welt 16 steigendes Wasser. Diese Elemente
  nutzen einen eigenen Zufallsstrom, damit ältere Welten gleich bleiben. Jede 10. Welt ist eine Bonus- oder Bosswelt.
- Die Tagesherausforderung wird aus dem Datum erzeugt und ist für alle gleich.
- Spielstand in `localStorage`, Geister der Bestzeiten unter `boulderRush.ghosts`; im claude.ai-Artifact zusätzlich im Konto.
- Test-Hilfe im Browser: `window.__br` (genLevel, reach, tick, startStage).
