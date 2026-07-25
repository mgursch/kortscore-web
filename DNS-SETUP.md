# kortscore.com auf GitHub Pages umstellen

Stand: Domain liegt bei World4You (Nameserver `ns1/ns2.world4you.at`) und zeigt
noch auf die Parking-Seite `81.19.154.98`. Auf GitHub ist alles fertig
eingerichtet – es fehlt nur die DNS-Änderung im World4You-Kundenbereich.

## Was bei World4You einzustellen ist

Im World4You-Kundenbereich → **Domains** → `kortscore.com` → **DNS-Einstellungen**
(je nach Oberfläche „DNS verwalten" / „Erweiterte Einstellungen").

### 1. Bestehende A-Records löschen

Der vorhandene A-Record auf `81.19.154.98` (die Parking-Seite) muss weg –
sowohl für `@` als auch für `www`, falls dort einer existiert.

### 2. Vier A-Records für die Hauptdomain anlegen

Name/Host `@` (manche Oberflächen: leer lassen oder `kortscore.com`):

| Typ | Name | Wert            |
|-----|------|-----------------|
| A   | `@`  | 185.199.108.153 |
| A   | `@`  | 185.199.109.153 |
| A   | `@`  | 185.199.110.153 |
| A   | `@`  | 185.199.111.153 |

Alle vier anlegen – GitHub verteilt den Traffic darüber. Nur einer funktioniert
auch, ist aber unnötig fragil.

### 3. CNAME für www

| Typ   | Name  | Wert                   |
|-------|-------|------------------------|
| CNAME | `www` | `mgursch.github.io.`   |

Wichtig: Ziel ist `mgursch.github.io` (der GitHub-Account-Host), **nicht**
`kortscore.com` und **nicht** `mgursch.github.io/kortscore-web`. Ein Pfad ist
im CNAME nicht erlaubt. Der Punkt am Ende ist bei manchen Oberflächen nötig,
bei anderen wird er automatisch ergänzt.

Falls World4You keinen CNAME auf `www` zulässt (kommt vor, wenn dort ein
A-Record existiert): erst den `www`-A-Record löschen, dann den CNAME anlegen.

### 4. AAAA-Records (optional, IPv6)

Nur falls World4You IPv6 anbietet:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

## Danach: HTTPS aktivieren

DNS-Änderungen brauchen typischerweise 15 Minuten bis wenige Stunden
(TTL-abhängig, selten bis 24 h). Prüfen:

```bash
dig +short kortscore.com A
```

Sobald dort die vier `185.199.*`-IPs stehen, holt GitHub automatisch ein
Let's-Encrypt-Zertifikat. Das dauert nochmal einige Minuten bis ~1 Stunde.

Danach im Repo unter **Settings → Pages** den Haken **„Enforce HTTPS"**
setzen. Per CLI prüfbar:

```bash
gh api repos/mgursch/kortscore-web/pages --jq '{cname,https_enforced}'
```

Aktivieren, sobald das Zertifikat da ist:

```bash
gh api -X PUT repos/mgursch/kortscore-web/pages -F 'https_enforced=true'
```

## Kontrolle

```bash
curl -sI https://kortscore.com | head -1        # sollte 200 liefern
curl -sI https://www.kortscore.com | head -1    # leitet auf kortscore.com
```

## Was schon erledigt ist

- `CNAME`-Datei im Repo mit Inhalt `kortscore.com`. Ohne diese Datei setzt der
  Deploy-Workflow die Domain bei jedem Push zurück.
- Custom Domain in den Pages-Settings hinterlegt.
- `og:image`, `og:url` und `canonical` auf `https://kortscore.com/` umgestellt.
- Alle Asset-Pfade sind relativ, der Umzug von `/kortscore-web/` auf `/`
  funktioniert also ohne weitere Anpassung.

## Hinweis zu E-Mail

Falls die Domain für E-Mail genutzt wird: **MX-Records nicht anfassen.** Die
Änderungen oben betreffen nur A/CNAME für Web. Ein gelöschter MX-Record
stoppt den Mailempfang.
