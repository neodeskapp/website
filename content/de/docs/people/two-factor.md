---
title: Zwei-Faktor-Anmeldung
description: Codes einer Authenticator-App einschalten, damit anmelden, Wiederherstellungscodes nutzen und erneuern und die Zwei-Faktor-Anmeldung zur Pflicht machen.
order: 3
---

Mit der Zwei-Faktor-Anmeldung öffnet ein Passwort allein dein Konto nicht mehr: Nach dem Passwort tippst du zusätzlich einen sechsstelligen Code aus einer Authenticator-App auf deinem Handy ein, etwa Google Authenticator, Microsoft Authenticator oder Authy. Jede Person schaltet sie für ihr eigenes Konto ein, und ein Admin kann sie für Passwortkonten zur Pflicht machen.

## Einschalten {#turn-it-on}

1. Öffne das Kontomenü am Ende der oberen Leiste, wähle **Dein Konto** und gehe zu **Zwei-Faktor-Anmeldung**. Siehe [Dein Konto](/docs/people/your-account).
2. Klicke auf **Zwei-Faktor-Anmeldung einrichten**.
3. Installiere eine Authenticator-App auf deinem Handy, falls du noch keine hast.
4. Scanne den QR-Code mit der App. Klappt das Scannen nicht, tippe stattdessen den Wert unter **Manueller Schlüssel** in die App ein.
5. Tippe den sechsstelligen Code, den die App zeigt, in das Feld **Bitte gib einen 6-stelligen Code ein** und klicke auf **Prüfen und einschalten**.
6. Die Seite zeigt acht **Wiederherstellungscodes**. Bewahre sie an einem sicheren Ort außerhalb des Handys auf, etwa in einem Passwortmanager, und klicke dann auf **Ich habe die Codes gespeichert**.

Der Bereich zeigt jetzt **Zwei-Faktor-Anmeldung ist aktiv**. Admins sehen dasselbe in der Spalte **Zwei-Faktor-Anmeldung** auf der Seite **Benutzer**. Das Einschalten meldet die anderen Browser deines Kontos ab; der, den du benutzt hast, bleibt angemeldet.

In der App heißt der neue Eintrag NeoDesk, gefolgt von deinem Benutzernamen. Jede App für zeitbasierte Codes funktioniert: Die Codes haben sechs Ziffern und wechseln alle 30 Sekunden.

Verlässt du die Seite vor Schritt 5, bleibt die Zwei-Faktor-Anmeldung aus. Das nächste **Zwei-Faktor-Anmeldung einrichten** erzeugt einen neuen Schlüssel, also entferne den ungenutzten Eintrag aus der App.

## Mit einem Code anmelden {#sign-in-with-a-code}

1. Gib wie bisher Benutzername und Passwort auf der Anmeldeseite ein.
2. Die Seite fragt nach dem **Bestätigungscode**. Tippe die sechs Ziffern ein, die deine App gerade zeigt, und klicke auf **Bestätigen**.

Der Code wechselt alle 30 Sekunden, und der Server nimmt nur den Code der aktuellen 30 Sekunden an. Jeder Code funktioniert einmal. Werden richtige Codes abgelehnt, prüfe, ob die Uhr auf deinem Handy und auf dem Server stimmt.

Nach dem Passwort hast du fünf Minuten Zeit für den Code. Nach fünf falschen Codes oder wenn die Zeit um ist, zeigt die Seite „Sitzung abgelaufen. Melde dich erneut an.“ Klicke auf **Zurück zur Anmeldung** und fang wieder mit dem Passwort an. Falsche Codes zählen auch als fehlgeschlagene Anmeldungen, viele davon sperren das Konto also eine Zeit lang (siehe [fehlgeschlagene Anmeldungen](/docs/people/users-and-roles#sessions-and-failed-sign-ins)).

Auch der RustDesk-Client fragt nach dem Code, wenn du dich dort mit Passwort und einem Konto anmeldest, bei dem die Zwei-Faktor-Anmeldung eingeschaltet ist. Mit **Mit NeoDesk anmelden** fragt der Client nach nichts: Du meldest dich im Browser bei der Konsole an, dort mit dem Code, und erlaubst den Client (siehe [Über den Browser anmelden](/docs/getting-started/connect-a-client#sign-in-through-the-browser)).

## Einen Wiederherstellungscode verwenden {#use-a-recovery-code}

Hast du dein Handy nicht zur Hand, klicke auf der Code-Seite auf **Stattdessen einen Wiederherstellungscode verwenden**, tippe einen deiner Wiederherstellungscodes in **Wiederherstellungscode** und klicke auf **Bestätigen**. Großbuchstaben, Leerzeichen und Bindestriche spielen keine Rolle.

Jeder Wiederherstellungscode funktioniert einmal. So bekommst du einen neuen Satz, etwa wenn die Codes knapp werden:

1. Öffne **Dein Konto** und klicke unter **Zwei-Faktor-Anmeldung** auf **Neue Wiederherstellungscodes**.
2. Tippe einen aktuellen Code aus deiner App in **Bestätigungscode** und klicke auf **Neue Wiederherstellungscodes**.
3. Bewahre die acht neuen Codes auf. Die alten funktionieren dann nicht mehr.

Ein falscher Code zählt als fehlgeschlagene Anmeldung.

## Ausschalten {#turn-it-off}

1. Öffne **Dein Konto** im Kontomenü.
2. Klicke unter **Zwei-Faktor-Anmeldung** auf **Zwei-Faktor-Anmeldung ausschalten**.
3. Gib unter **Aktuelles Passwort** dein Passwort ein und klicke noch einmal auf **Zwei-Faktor-Anmeldung ausschalten**. Verzeichnis- und Single-Sign-on-Konten haben in dieser Konsole kein Passwort; sie tippen stattdessen einen aktuellen Code aus der App in **Bestätigungscode**.

Das löscht den Schlüssel und die Wiederherstellungscodes und meldet die anderen Browser deines Kontos ab. Ein falsches Passwort oder ein falscher Code zählt als fehlgeschlagene Anmeldung.

## Wenn jemand das Handy verloren hat {#when-someone-has-lost-the-phone}

Hat jemand sowohl das Handy als auch die Wiederherstellungscodes verloren, nimmt ein Admin die Zwei-Faktor-Anmeldung von diesem Konto:

1. Öffne **Personen**, dann **Benutzer**.
2. Wähle im Menü der Zeile der Person unter **Anmeldesicherheit** den Eintrag, den es zeigt, und bestätige:
   - **Zwei-Faktor-Anmeldung ausschalten…**, wenn nichts die Zwei-Faktor-Anmeldung von der Person verlangt. Sie meldet sich nur mit dem Passwort an, bis sie die Zwei-Faktor-Anmeldung wieder einrichtet.
   - **Zwei-Faktor-Anmeldung zurücksetzen…**, wenn sie von ihr verlangt wird, für alle (siehe [Zur Pflicht machen](#make-it-mandatory)) oder für diese Person. Sie richtet sie bei ihrer nächsten Anmeldung an der Konsole mit dem neuen Handy wieder ein.

Beides löscht Schlüssel und Wiederherstellungscodes der Person und beendet ihre Konsolensitzungen und Anmeldungen im RustDesk-Client. Die Einträge gibt es bei Konten mit eingeschalteter Zwei-Faktor-Anmeldung, und zwar für Personen mit **Anmeldesicherheit von Benutzern verwalten**, deren Rolle das Konto ändern darf (siehe [wer welche Rolle vergeben darf](/docs/people/users-and-roles#who-can-give-which-role)). Standardmäßig sind das Super-Admin, Administrator und Globaler Administrator. Für dein eigenes Konto gibt es sie nie: Deine eigene Zwei-Faktor-Anmeldung schaltest du unter **Dein Konto** aus.

**Wiederherstellungscodes ungültig machen…** in derselben Gruppe beendet nur die Wiederherstellungscodes, etwa wenn jemand anderes sie gesehen hat. Neue erstellt die Person unter **Dein Konto** mit ihrer App.

## Wenn der einzige Admin ausgesperrt ist {#if-the-only-admin-is-locked-out}

Hat der einzige Admin sowohl das Handy als auch die Wiederherstellungscodes verloren, bleibt niemand, der die Zwei-Faktor-Anmeldung in der Konsole ausschalten kann. Das übernimmt dann der Befehl des Servers zum Zurücksetzen des Passworts: Mit `--reset-two-factor` gibt er dem Konto ein neues Passwort, schaltet seine Zwei-Faktor-Anmeldung aus und löscht seinen Schlüssel und die Wiederherstellungscodes. Ist die Zwei-Faktor-Anmeldung verlangt, fordert die Konsole das Konto bei der nächsten Anmeldung auf, sie neu einzurichten. Richte sie danach unter **Dein Konto** mit dem neuen Handy wieder ein.

Die Option kam nach NeoDesk 3.6.0-rc.6. Ein Server ohne sie lehnt sie ab, und die Installer sagen, dass du zuerst aktualisieren sollst.

Docker, mit dem Skript installiert. Es zeigt das neue Passwort einmal an; `--user <name>` wählt ein anderes Konto als `admin`:

```bash
sudo bash /opt/neodesk/docker/neodesk-docker.sh reset-password --reset-two-factor
```

Docker mit der Compose-Datei. Tippe das Passwort nach dem ersten Befehl ein (es wird nicht angezeigt) und führe dann den zweiten im Ordner mit der Compose-Datei aus:

```bash
read -rs NEWPASS
printf '%s\n' "$NEWPASS" | docker compose exec -T -u neodesk neodesk neodesk-server reset-password --reset-two-factor admin
```

Linux. Es zeigt das neue Passwort von `admin` einmal an:

```bash
sudo neodesk-setup --reset-password --reset-two-factor
```

Windows, in einer PowerShell, die als Administrator läuft. Es gibt `admin` ein neues Passwort: `ADMIN_PASSWORD`, wenn du es im selben Fenster setzt, sonst ein zufälliges, das es einmal anzeigt:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\NeoDesk\neodesk.ps1" -ResetTwoFactor
```

Die Befehle für Linux und Windows setzen nur das Konto `admin` zurück. Für ein anderes Konto gibst du dem Befehl des Servers seinen Namen mit `--reset-two-factor`, so wie es [Fehlersuche](/docs/operations/troubleshooting#forgot-the-admin-password) für das Zurücksetzen des Passworts zeigt, zum Beispiel unter Linux:

```bash
read -rs NEWPASS
printf '%s\n' "$NEWPASS" | sudo -u neodesk env NEODESK_ENV_FILE=/opt/NeoDeskConsole/.env /opt/neodesk/neodesk-server reset-password --reset-two-factor <name>
```

Setze für `<name>` den Namen des Kontos ein.

## Zur Pflicht machen {#make-it-mandatory}

Ein Konto mit der Berechtigung **Servereinstellungen ändern** (standardmäßig Super-Admin, Administrator und Serveradministrator) kann die Zwei-Faktor-Anmeldung für jedes Passwortkonto verlangen:

1. Öffne **Einstellungen**, **Anmeldung** und gehe zu **Anmeldung an der Konsole**.
2. Schalte **Zwei-Faktor-Anmeldung verlangen** ein und klicke auf **Änderungen speichern**.

Ab dann richtet ein Passwortkonto ohne Zwei-Faktor-Anmeldung sie direkt nach dem Passwort ein, wenn es sich an der Konsole anmeldet. Die Anmeldeseite zeigt **Zwei-Faktor-Anmeldung einrichten** mit dem QR-Code und dem Feld **Manueller Schlüssel**. Die Person scannt den QR-Code, tippt den Code aus der App ein, klickt auf **Bestätigen**, bewahrt die Wiederherstellungscodes auf, klickt auf **Ich habe die Codes gespeichert** und ist dann angemeldet. Die Einrichtung muss innerhalb von 15 Minuten fertig sein, und fünf falsche Codes brechen sie ab; dann beginnt die Anmeldung wieder mit dem Passwort.

Solange das Konto keine Zwei-Faktor-Anmeldung hat, lehnt der RustDesk-Client es mit „Two-factor sign-in is required for this account. Sign in to the web console once to set it up.“ ab. Personen können die Zwei-Faktor-Anmeldung für ihr eigenes Konto weiterhin ausschalten, und ihre nächste Anmeldung an der Konsole verlangt dann wieder die Einrichtung.

Um sie nur von einer Person zu verlangen, wähle im Menü ihrer Zeile auf der Seite **Benutzer** unter **Anmeldesicherheit** den Eintrag **Zwei-Faktor-Anmeldung verlangen**. Den gibt es bei Passwortkonten, für Personen mit **Anmeldesicherheit von Benutzern verwalten**. Mit **Zwei-Faktor-Anmeldung nicht mehr verlangen** an derselben Stelle folgt die Person wieder der Einstellung für alle.

Die Einstellung gilt nicht für Verzeichnis- und Single-Sign-on-Konten; die bleiben ihrem Verzeichnis oder Identitätsanbieter überlassen. Sie gilt auch nicht für Konten mit Pro-Lizenz: Diese können sich nicht an der Konsole anmelden, wo die Einrichtung stattfindet, und melden sich deshalb weiter mit ihrem Passwort im RustDesk-Client an.

## Verzeichnis- und Single-Sign-on-Konten {#directory-and-single-sign-on-accounts}

- Nach einem [Single Sign-on](/docs/people/oidc) fragt die Konsole nicht nach einem Code. Nutze stattdessen die Zwei-Faktor-Anmeldung deines Identitätsanbieters.
- Ein [Verzeichniskonto](/docs/people/ldap) kann die Zwei-Faktor-Anmeldung einschalten und wird dann nach Codes gefragt. Es schaltet sie mit einem aktuellen Code aus, wie unter [Ausschalten](#turn-it-off) beschrieben.
