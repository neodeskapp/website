---
title: API-Tokens
description: Ein Token für ein Skript, die Kommandozeile neodesk oder einen KI-Agenten erstellen, Berechtigungen wählen, mit neodesk oder curl nutzen, widerrufen.
order: 2
---

Mit einem API-Token kann ein Skript, die Kommandozeile `neodesk` oder ein
KI-Agent die Konsole als dein Konto nutzen, ohne Browser. Es kann nur, was du
dafür ausgewählt hast, und nie mehr als dein Konto.

## Wer Tokens erstellen kann {#who-can-make-tokens}

Konten mit der Rolle Super-Admin, Administrator, Globaler Administrator oder
Serveradministrator finden **API-Tokens** im Kontomenü unten in der
Seitenleiste. Andere Konten haben die Seite nicht.

Tokens entstehen nur in der Konsole, in einer Browsersitzung. Ein Token kann
kein weiteres Token erstellen. Ein Konto kann höchstens 50 aktive Tokens
haben.

## Ein Token erstellen {#make-a-token}

1. Öffne das Kontomenü unten in der Seitenleiste und wähle **API-Tokens**.
2. Wähle **Neues Token**.
3. Schreib unter **Name**, wofür das Token ist, zum Beispiel „Backup-Skript“.
   Der Name darf 80 Zeichen lang sein.
4. Wähle unter **Zugriff** **Nur lesen** oder **Lesen und schreiben**. Ein
   Token, das nur lesen darf, kann Dinge ansehen, aber nichts ändern.
5. Hak unter **Berechtigungen** an, was das Token darf. Die Liste enthält nur
   die Berechtigungen, die dein Konto hat. **Alle wählen** hakt alle an,
   **Keine** keine. Wähl mindestens eine.
6. Wähle unter **Läuft ab** **In 7 Tagen**, **In 30 Tagen**, **In 90 Tagen**,
   **In 365 Tagen** oder **An einem Datum**. Ein Token gilt höchstens ein
   Jahr; ein Datum meint das Ende dieses Tages in UTC.
7. Trag unter **Erlaubte Adressen** die Adressen oder Netze ein, von denen aus
   das Token genutzt werden darf, eine pro Zeile, zum Beispiel `192.0.2.10`
   oder `198.51.100.0/24`. Lass das Feld leer, um jede Adresse zu erlauben.
   Die Liste nimmt 32 Einträge.
8. Wähle **Token erstellen**.

**Token erstellt** zeigt das Token einmal, mit dem Hinweis „Kopieren Sie das
Token jetzt. Es wird nicht noch einmal angezeigt.“ Kopier es dort. Darunter
zeigt die Konsole den Befehl, der die Kommandozeile mit dem Token anmeldet,
schon mit der Adresse dieser Konsole.

Ein Token beginnt mit `ndt_`, dann folgen 12 Buchstaben und Ziffern, seine ID,
ein Unterstrich und 40 weitere Zeichen. Die Konsole speichert nur einen Hash
davon, ein verlorenes Token lässt sich also nicht noch einmal anzeigen:
Widerruf es und erstell ein neues.

## Die Berechtigungen {#the-permissions}

Das sind die Berechtigungen, die das Formular anbietet, mit den Namen der
Konsole und in ihrer Reihenfolge. Die Befehlsreferenz nennt sie beim Kurznamen, zum Beispiel „Needs
device.ban“.

| Berechtigung | Kurzname |
|---|---|
| Geräte anzeigen | `device.view` |
| Mit Geräten verbinden | `device.connect` |
| Gastzugangslinks erstellen | `guest.create` |
| Geräte bearbeiten | `device.edit` |
| Geräte löschen | `device.delete` |
| Geräte sperren und entsperren | `device.ban` |
| Geräte-ID ändern | `device.change_id` |
| Verbindungsmodus des Geräts ändern | `device.connection_mode` |
| Gespeicherte Anmeldung verwenden | `device.signin_use` |
| Gespeicherte Anmeldung verwalten | `device.signin_manage` |
| RDP- und VNC-Ziele ansehen | `remote_target.view` |
| Mit RDP- und VNC-Zielen verbinden | `remote_target.connect` |
| RDP- und VNC-Ziele hinzufügen und bearbeiten | `remote_target.edit` |
| RDP- und VNC-Ziele löschen | `remote_target.delete` |
| RDP- und VNC-Ziele testen | `remote_target.test` |
| Benutzer anzeigen | `user.view` |
| Benutzer erstellen | `user.create` |
| Benutzer bearbeiten | `user.edit` |
| Benutzer löschen | `user.delete` |
| Organisationen erstellen | `org.create` |
| Organisationen bearbeiten | `org.edit` |
| Organisationen löschen | `org.delete` |
| Organisationsbenutzer verwalten | `org.manage_users` |
| Organisationsgeräte verwalten | `org.manage_devices` |
| Registrierungen verwalten | `enrollment.manage` |
| Registrierungen genehmigen | `enrollment.approve` |
| Chat verwenden | `chat.access` |
| Audit anzeigen | `audit.view` |
| Metriken anzeigen | `metrics.view` |
| Sperrliste bearbeiten | `blocklist.edit` |
| Server konfigurieren | `server.config` |
| API-Schlüssel verwalten | `server.keys` |
| Kapazitätstests ausführen | `server.attestation` |
| Erscheinungsbild bearbeiten | `branding.edit` |
| Abrechnung ansehen | `billing.view` |
| Abrechnungspakete und Verträge verwalten | `billing.manage` |
| Arbeitsberichte schreiben | `billing.reports` |
| Abrechnungsdaten exportieren | `billing.export` |
| CDAP anzeigen | `cdap.view` |
| CDAP-Befehle ausführen | `cdap.command` |
| CDAP-Terminal verwenden | `cdap.terminal` |
| CDAP-Dateien verwalten | `cdap.files` |
| Terminal auf MeshCentral-Agenten | `mesh.terminal` |
| Dateien auf MeshCentral-Agenten | `mesh.files` |
| Ein-/Ausschalten von MeshCentral-Agenten | `mesh.power` |
| Terminal auf NeoDesk-Agenten | `agent.terminal` |
| Dateien auf NeoDesk-Agenten | `agent.files` |

**Server konfigurieren** reicht an die Dateien und Geheimnisse des Servers,
deshalb bekommt ein Token diese Berechtigung nur zusammen mit allen anderen
Berechtigungen deines Kontos. Allein lehnt das Formular sie ab, mit der
Meldung des Servers „A token gets server.config only together with all of your
permissions“.

## Was ein Token darf {#what-a-token-can-do}

Ein Token handelt als das Konto, das es erstellt hat, mit weniger Rechten:

- Es hat nur die Berechtigungen, die für es ausgewählt wurden, und jede nur,
  solange das Konto sie noch hat. Verliert das Konto eine Berechtigung, wird
  es deaktiviert oder gelöscht, verlieren seine Tokens sie sofort.
- Ein Token, das nur lesen darf, liest nur. Jede Anfrage, die etwas ändern
  würde, bekommt „This API token is read-only: it can only read“.
- Kein Token meldet sich an oder ab, ändert ein Passwort, einen zweiten Faktor
  oder eine Sitzung, ändert sein eigenes Konto oder Profil, zeigt den
  API-Schlüssel der Konsole ganz oder erstellt ein weiteres Token.
- Kein Token nutzt eine [gespeicherte Anmeldung](/docs/console/saved-sign-in),
  auch nicht mit **Gespeicherte Anmeldung verwenden**. Mit **Gespeicherte
  Anmeldung verwalten** kann es eine speichern, ändern und löschen, das
  Passwort aber nie zurücklesen.
- Manches braucht ein volles Token, eines, das gerade jede Berechtigung seines
  Kontos hat: Prüfungen, die nach der Rolle des Kontos gehen, Änderungen an
  Konten, Rollen, Benutzergruppen, Bereichszugriff, Mitgliedern von
  Organisationen und Mandanten sowie an den Anmeldeeinstellungen (LDAP, OIDC,
  Zwei-Faktor-Anmeldung, Registrierung). Ein Token, das nicht voll ist,
  verliert außerdem **Server konfigurieren**.
- Die Geheimnisse des Servers brauchen ein volles Token mit Lese- und
  Schreibzugriff, sogar zum Lesen: die vollständige Sicherung und die
  Wiederherstellung, die Dateien des Servers, die Dateien der erweiterten
  Einstellungen und das Ziel geplanter Sicherungen.
- Mit einer Adressliste wird eine Anfrage von jeder anderen Adresse
  abgelehnt. Die Liste prüft die Adresse, die die Konsole sieht. Hinter einem
  Reverse Proxy setz `TRUST_PROXY` auf die Adresse des Proxys und halte den
  Port der Konsole für alle anderen geschlossen, siehe
  [Dem Proxy vertrauen](/docs/operations/reverse-proxy-tls#trusting-the-proxy).

Ein Token darf 1.200 Anfragen pro Minute stellen. Eine Adresse, die in einem
der 5-Minuten-Fenster der Konsole 20 abgelehnte Tokens schickt, kommt mit
keinem Token mehr durch, bis das Fenster endet. Beide Grenzen antworten mit
429 und einem Header `Retry-After`.

Das Audit-Protokoll hält fest, wann ein Token erstellt und widerrufen wird,
jede Änderung, die ein Token macht, mit Route und Antwort, und, einmal pro
Minute und Token, was die Konsole ihm verweigert hat.

## Mit der Kommandozeile nutzen {#use-it-with-the-command-line}

Die Kommandozeile speichert die Adresse der Konsole und das Token einmal:

```bash
neodesk login --url https://<console-address>
```

Setz für `<console-address>` die Adresse deiner Konsole ein, die du im Browser
öffnest. `neodesk login` fragt nach dem Token und zeigt es beim Einfügen nicht
an. [Die Kommandozeile neodesk](/docs/command-line/neodesk) erklärt, wo der
Befehl liegt, Zertifikate und die ersten Befehle, und die
[Befehlsreferenz](/docs/command-line/reference) nennt sie alle.

## Mit curl nutzen {#use-it-with-curl}

Schick das Token im Header `Authorization` an die Adresse der Konsole. Mit dem
Token in der Variablen `NEODESK_TOKEN` und der Adresse deiner Konsole statt
`<console-address>`:

```bash
curl -H "Authorization: Bearer $NEODESK_TOKEN" https://<console-address>/api/panel/api-tokens/current
```

Die Antwort nennt das Token, das Konto, als das es handelt, die Berechtigungen,
die es gerade hat, und `full`, also ob es jede Berechtigung seines Kontos hat.
Jede Route, die die Kommandozeile aufruft, nimmt das Token auf dieselbe Weise;
jeder Befehl in der [Befehlsreferenz](/docs/command-line/reference) nennt
seine Route.

Das hier listet die Geräte, die das Konto des Tokens sehen darf, und braucht
**Geräte anzeigen**. Wieder mit der Adresse deiner Konsole statt
`<console-address>`:

```bash
curl -H "Authorization: Bearer $NEODESK_TOKEN" https://<console-address>/api/devices
```

Die Antwort ist JSON mit den Geräten in `data.devices` und ihrer Anzahl in
`data.total`. Mit `?status=online` an der Adresse kommen nur die Geräte, die
online sind.

Die Konsole liest ein Token nur aus diesem Header. Ein Token in der Adresse,
einem Cookie oder einem Formularfeld wird übergangen, und der Port der
Client-API, 21121, nimmt keine Tokens. Eine Anfrage mit Token meldet sich
allein damit an: Ihre Cookies übergeht die Konsole.

Lehnt die Konsole ein Token ab, antwortet sie mit JSON mit `error` und `code`:

| Status | `code` | Grund |
|---|---|---|
| 401 | `token_invalid` | Das Token ist unbekannt, abgelaufen oder widerrufen, sein Konto ist deaktiviert, oder diese Adresse darf es nicht nutzen |
| 403 | `token_read_only` | Ein Token, das nur lesen darf, wollte etwas ändern |
| 403 | `token_not_allowed` | Das darf kein Token, etwa sich anmelden oder sein eigenes Konto ändern |
| 429 | `token_rate_limited` | Zu viele Anfragen, oder zu viele abgelehnte Tokens von dieser Adresse |

### Ein selbst signiertes Zertifikat {#a-self-signed-certificate}

Die Installer für Linux und Windows geben der Konsole auf Port 5443 ein selbst
signiertes Zertifikat, und curl lehnt es ab, bis du es mit `--cacert` nennst.
Auf dem Linux-Server können nur root und der Dienst die Datei lesen, also
kopiere sie zuerst:

```bash
sudo cat /opt/neodesk/ssl/neodesk.crt > neodesk.crt
```

Dann liste die Geräte, mit der Adresse deines Servers statt
`<server-address>`:

```bash
curl --cacert neodesk.crt -H "Authorization: Bearer $NEODESK_TOKEN" https://<server-address>:5443/api/devices
```

Unter Windows ist die Datei `C:\NeoDesk\ssl\neodesk.crt`. Um curl auf einem
anderen Computer zu nutzen, kopiere die Datei dorthin. Hinter einem Reverse
Proxy mit einem Zertifikat, dem Browser vertrauen, nimmst du die Adresse des
Proxys und lässt `--cacert` weg.

## Tokens ansehen und widerrufen {#see-and-revoke-tokens}

**API-Tokens** zeigt **Ihre Tokens**: den Namen jedes Tokens mit seinem
Anfang, `ndt_` und der ID, den Zugriff und die erlaubten Adressen, wie viele
Berechtigungen es hat, wann es abläuft, wann und von wo es zuletzt benutzt
wurde, und seinen Status: **Aktiv**, **Abgelaufen** oder **Widerrufen**. Die
Liste zeigt die aktiven Tokens; wähl **Alle** für die übrigen. Super-Admins
können **Tokens aller Konten** anhaken, um die Tokens aller Konten zu sehen.

Um ein Token zu widerrufen, öffne das Menü am Ende seiner Zeile und wähle
**Widerrufen**. Die Konsole nennt das Token und fragt noch einmal nach:
„Skripte, die es nutzen, funktionieren sofort nicht mehr. Das lässt sich nicht
rückgängig machen.“ Super-Admins können das Token jedes Kontos widerrufen,
alle anderen nur ihre eigenen.

### Was mit einem Token endet {#what-ends-with-a-token}

Ein widerrufenes Token beendet auch, was es erstellt hat: Gastlinks,
Geräte-Tokens, Schnellsupport-Sitzungen mit ihren Codes, Einladungen,
Kopplungscodes, Gast-Desktop-Links und noch nicht genutzte Einladungen in
Organisationen. Dasselbe passiert, wenn ein Token abläuft oder gelöscht wird.
Der Dialog zum Widerrufen und die Tokenliste nennen, was beendet wurde, und
das Audit-Protokoll hat einen Eintrag, der es zählt.

Computer, die mit einem Token aufgenommen wurden, bleiben, wenn das Token
widerrufen wird: die, die über seine Einladungen oder Kopplungscodes
beigetreten sind, und die, die damit freigegeben wurden. Der Dialog zum
Widerrufen listet sie auf, „Computer, die damit aufgenommen wurden, bleiben“,
damit du sie auf der Seite Geräte prüfen kannst. Gelistet sind nur Computer,
die ab 3.6.0-rc.5 aufgenommen wurden.

Konten, die ein Token erstellt hat, bleiben ebenfalls, und auch die
Registrierungstokens von Agent-Vorlagen, die sich noch nicht widerrufen lassen.

Die Kommandozeile widerruft ein Token über seine ID, die 12 Zeichen nach
`ndt_`, mit `neodesk api-tokens revoke <id>`; `neodesk logout --revoke`
widerruft das Token, das sie selbst nutzt. Siehe
[neodesk api-tokens](/docs/command-line/reference/api-tokens).
