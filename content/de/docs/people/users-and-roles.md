---
title: Benutzer und Rollen
description: Konten der Konsole anlegen, ändern, deaktivieren und löschen, jedem eine Rolle geben und festlegen, welche Geräte Personen ohne Admin-Rolle sehen.
order: 1
---

Jede Person, die sich an der Web-Konsole anmeldet, hat ein Konto auf der Seite **Benutzer** unter **Personen** in der Seitenleiste. Die Rolle des Kontos legt fest, was die Person tun darf. Der Gerätezugriff legt fest, welche Geräte sie sieht.

![Die Seite Benutzer mit Rolle, Geräten, Organisationen und Zwei-Faktor-Anmeldung jedes Kontos](shot:users)

## Benutzer hinzufügen {#add-a-user}

Dafür brauchst du eine Rolle, die Konten anlegen darf: Super-Admin, Administrator oder Globaler Administrator, sofern niemand die Standardwerte auf der Seite [Berechtigungen](/docs/people/permissions) geändert hat.

1. Öffne **Personen**, dann **Benutzer**, und klicke auf **Benutzer hinzufügen**.
2. Wähle, wie die Person zu einem Passwort kommt:
   - **Einladung per E-Mail senden**: Die Person bekommt einen Link und wählt ihr Passwort selbst. Der Link gilt 7 Tage. Trage die **E-Mail** ein, an die die Einladung geht. Der **Benutzername** ist freiwillig; bleibt er leer, wird es der Teil der Adresse vor dem @. Kann die Konsole E-Mails senden, beginnt das Fenster mit dieser Auswahl. Ohne Mailserver unter **Einstellungen**, **E-Mail** (siehe [E-Mail](/docs/operations/configuration#mail)) lässt sie sich nicht wählen.
   - **Passwort jetzt festlegen**: Trage unter **Benutzername** einen Namen mit 3 bis 64 Zeichen ein (Buchstaben, Ziffern, Punkt, Unterstrich, At-Zeichen oder Bindestrich) und unter **Passwort** ein Passwort, das die [Passwortregeln](#password-rules) erfüllt, und gib das Passwort selbst weiter. Eine **E-Mail** ist freiwillig.
3. Wähle eine **Rolle**. Die Liste bietet nur Rollen an, die du vergeben darfst (siehe [wer welche Rolle vergeben darf](#who-can-give-which-role)).
4. Wähle unter **Gerätezugriff**, was die Person sehen darf (siehe [welche Geräte ein Benutzer sieht](#which-devices-a-user-sees)).
5. Klicke auf **Einladung senden** oder **Benutzer anlegen**.

An die E-Mail-Adresse schickt die Konsole Benachrichtigungen über Hilfeanfragen, wenn der Person Geräteordner oder Gerätegruppen zugewiesen sind. Ein eingeladenes Konto steht in der Liste als eingeladen, bis sich die Person angemeldet hat. Ging die Einladung nicht hinaus, sagt die Konsole das; richte dann die E-Mail-Einstellungen und nutze **Einladung erneut senden** im Menü der Zeile.

Konten, die du hier anlegst, melden sich mit einem Passwort an. Konten für [LDAP](/docs/people/ldap) und [Single Sign-on](/docs/people/oidc) entstehen bei der ersten Anmeldung, außer **Benutzer automatisch anlegen** (LDAP) bzw. **Benutzer automatisch erstellen** (Single Sign-on) ist dort ausgeschaltet. Sie haben neben der Rolle den Tag **LDAP/AD** oder **SSO**.

## Benutzer ändern {#change-a-user}

Ein Klick auf die Zeile öffnet die Seite der Person, mit Profil, Anmeldung, Geräten und Organisationen und Aktivität und denselben Aktionen wie im Menü der Zeile. Um das Konto zu ändern, wähle **Bearbeiten…** im Menü der Zeile. Das Fenster zeigt den Benutzernamen und wie sich das Konto anmeldet. Ändere **E-Mail**, **Rolle** oder **Gerätezugriff** und klicke auf **Speichern**. Ein neues Passwort für ein Passwortkonto tippst du in **Neues Passwort** ein. Lässt du das Feld leer, bleibt das aktuelle Passwort. Bei den Konten anderer hat das Fenster außerdem:

- **Enddatum**: An diesem Tag wird das Konto deaktiviert, etwa wenn ein Vertrag endet. Admins, die das Konto ändern dürfen, bekommen eine Woche vorher einen Hinweis. Leer heißt: kein Enddatum.
- **Dieses Konto behalten, auch wenn es nicht benutzt wird**: für Dienstkonten, damit die Regel, die Konten ohne Anmeldung deaktiviert, dieses Konto in Ruhe lässt.

Verzeichniskonten bekommen ihre Rolle aus dem Verzeichnis, deshalb ist die Rollenauswahl gesperrt. Verzeichnis- und Single-Sign-on-Konten haben kein Passwortfeld. Eine neue Rolle oder ein neues Passwort meldet die Person von der Konsole ab. Änderst du dein eigenes Passwort, bleibt deine aktuelle Sitzung bestehen.

## Das Menü der Zeile {#the-row-menu}

Das Menü der Zeile eines Kontos gruppiert, was du damit tun kannst. Es zeigt nur die Einträge, die deine Berechtigungen und das Konto erlauben.

- **Konto**: **Benutzerseite öffnen**, **Bearbeiten…**, **Einladung erneut senden** (ein eingeladenes Konto, das sich noch nicht angemeldet hat), **Konto aktivieren** (ein deaktiviertes Konto), **Nachricht senden** im Team-Chat (auf der Benutzerseite) und **Anmeldelink kopieren**, das die Adresse der Anmeldeseite der Konsole mit eingetragenem Benutzernamen kopiert.
- **Zugriff**: **Organisationen…**, **Konsolenzugriff…** (siehe [Konsolenzugriff](/docs/people/permissions#console-access)) und **Anmelden als…**, das die Konsole schreibgeschützt so zeigt, wie die Person sie sieht. Anmelden als braucht **Die Konsole als anderer Benutzer ansehen**, das standardmäßig nur Super-Admin und Administrator haben, und geht nur bei Konten mit weniger Rechten als deinen.
- **Anmeldesicherheit**:
  - **Passwort zurücksetzen…** für ein Passwortkonto: einen Link zum Zurücksetzen per E-Mail senden (er gilt 24 Stunden), ein vorläufiges Passwort festlegen, das die Person bei der nächsten Anmeldung ersetzt, oder gleich ein neues Passwort festlegen.
  - **Bei nächster Anmeldung neues Passwort verlangen**, oder **Kein neues Passwort verlangen**, wenn das schon gesetzt ist.
  - **Entsperren** für ein Konto, das fehlgeschlagene Anmeldungen gesperrt haben (siehe [Sitzungen und fehlgeschlagene Anmeldungen](#sessions-and-failed-sign-ins)).
  - **Zwei-Faktor-Anmeldung verlangen** oder **Zwei-Faktor-Anmeldung nicht mehr verlangen** für ein Passwortkonto.
  - **Zwei-Faktor-Anmeldung ausschalten…** oder **Zwei-Faktor-Anmeldung zurücksetzen…** und **Wiederherstellungscodes ungültig machen…** für ein Konto mit eingeschalteter Zwei-Faktor-Anmeldung (siehe [Zwei-Faktor-Anmeldung](/docs/people/two-factor#when-someone-has-lost-the-phone)).
  - **Angemeldete Geräte…** listet die Browser, auf denen die Person angemeldet ist, mit **Abmelden** für jeden und **Überall abmelden** (siehe [Dein Konto](/docs/people/your-account#for-administrators)).
- **Deaktivieren oder löschen**: **Einladung zurückziehen…** (löscht ein eingeladenes Konto, das sich nie angemeldet hat), **Konto deaktivieren…** und **Löschen…**.

Alles unter **Anmeldesicherheit** außer **Passwort zurücksetzen…** und **Angemeldete Geräte…** braucht **Anmeldesicherheit von Benutzern verwalten**, und nichts davon gibt es für dein eigenes Konto. Bearbeiten, Passwort zurücksetzen und Deaktivieren brauchen **Benutzer bearbeiten**. Alle brauchen außerdem eine Rolle, die das Konto ändern darf (siehe [wer welche Rolle vergeben darf](#who-can-give-which-role)).

## Konto deaktivieren {#disable-an-account}

Willst du jemanden von der Anmeldung abhalten, das Konto aber behalten, wähle **Konto deaktivieren…** im Menü der Zeile und bestätige. Die Person kann sich dann weder an der Konsole noch im RustDesk-Client anmelden, und ihre Konsolensitzungen und Client-Anmeldungen enden. Das Konto, seine Einstellungen und sein Verlauf bleiben erhalten, und die Liste zeigt **Deaktiviert** unter dem Namen. Ein deaktiviertes Verzeichnis- oder Single-Sign-on-Konto bleibt deaktiviert, wenn sich die Person erneut anmeldet; es entsteht kein neues Konto für sie.

Mit **Konto aktivieren** im selben Menü kann sich die Person wieder anmelden. Zum Deaktivieren brauchst du **Benutzer bearbeiten** und eine Rolle, die das Konto ändern darf (siehe [wer welche Rolle vergeben darf](#who-can-give-which-role)). Niemand kann sein eigenes Konto deaktivieren.

Wer ein deaktiviertes Konto hat, sieht nach dem richtigen Passwort auf der Anmeldeseite „Dieses Konto ist deaktiviert. Wende dich an einen Administrator.“

## Benutzer löschen {#delete-a-user}

Wähle **Löschen…** im Menü der Zeile und bestätige. Das Löschen lässt sich nicht rückgängig machen. Ein Passwortkonto kann sich danach nicht mehr anmelden. Bei einem Verzeichnis- oder Single-Sign-on-Konto legt die nächste Anmeldung ein neues Konto an, solange **Benutzer automatisch anlegen** bzw. **Benutzer automatisch erstellen** eingeschaltet ist. Deaktiviere ein solches Konto deshalb, statt es zu löschen. Dein eigenes Konto kannst du nicht löschen, ebenso wenig das letzte Konto mit der Rolle Super-Admin oder Administrator. Dieses letzte Konto kann auch keine andere Rolle bekommen.

## Rollen {#roles}

| Rolle | Name in Rollenzuordnungen | Wofür |
| --- | --- | --- |
| Super-Admin | `super_admin` | Alles, auch Benutzer hinzufügen und Servereinstellungen ändern. |
| Administrator | `admin` | Der ältere Name für Super-Admin, mit denselben Berechtigungen. |
| Serveradministrator | `server_admin` | Servereinstellungen, die Sperrliste und Registrierungstokens; listet und löscht API-Schlüssel. Sieht Benutzer und Geräte, kann sich nicht mit Geräten verbinden und keine Benutzer ändern. Sieht den API-Schlüssel des Servers nicht ganz und kann keine vollständigen Sicherungen herunterladen, wiederherstellen oder planen. |
| Globaler Administrator | `global_admin` | Benutzer, Organisationen und Geräte, auch Sperren, Abrechnung sowie Terminal und Dateien der NeoDesk-Agenten. Keine Servereinstellungen. |
| Remote-Operator | `operator` | Mit Geräten verbinden, Gerätedetails bearbeiten, Gastlinks erstellen, Chat und Arbeitsberichte. Sieht Benutzer und Abrechnung, kann aber keine Benutzer ändern. Kein Terminal und keine Dateien auf NeoDesk-Agenten. |
| Betrachter | `viewer` | Geräte, Aktivitätsprotokolle und Metriken sehen, Chat. Kann sich nicht verbinden und nichts ändern. |
| Gastlink-Aussteller | `guest_issuer` | Geräte sehen und Gastlinks zu ihnen erstellen. Kann sich nicht mit Geräten verbinden und nichts ändern. |
| Pro-Lizenz (nur Client-API) | `pro` | RustDesk-Pro-Funktionen im Desktop-Client freischalten. Kann sich nicht an der Konsole anmelden. |

Unter dem Namen in Rollenzuordnungen speichern die Zuordnungen von Gruppen zu Rollen bei [LDAP](/docs/people/ldap#roles-from-directory-groups) und [Single Sign-on](/docs/people/oidc#roles-from-groups) eine Rolle, und so nimmt die API sie an. In der Konsole wählst du die Rolle mit ihrem Namen.

### Was jede Rolle darf {#what-each-role-can-do}

Das sind die Standardberechtigungen. Super-Admin und Administrator haben alle. Die Rolle Gastlink-Aussteller hat nur **Geräte anzeigen** und **Gastzugangslinks erstellen**. Die Rolle Pro-Lizenz hat keine und kann nie eine Berechtigung für Geräte, für RDP- und VNC-Ziele oder für Organisationsgeräte bekommen. Ein Super-Admin kann die Standardwerte auf der Seite [Berechtigungen](/docs/people/permissions) ändern.

| Berechtigung | Serveradministrator | Globaler Administrator | Remote-Operator | Betrachter |
| --- | --- | --- | --- | --- |
| Geräte anzeigen | Ja | Ja | Ja | Ja |
| Mit Geräten verbinden | Nein | Ja | Ja | Nein |
| Gastzugangslinks erstellen | Nein | Ja | Ja | Nein |
| Geräte bearbeiten | Nein | Ja | Ja | Nein |
| Geräte löschen | Nein | Ja | Nein | Nein |
| Geräte sperren und entsperren | Nein | Ja | Nein | Nein |
| Geräte-ID ändern | Nein | Ja | Nein | Nein |
| Verbindungsmodus des Geräts ändern | Nein | Ja | Ja | Nein |
| Gespeicherte Anmeldung verwenden | Nein | Nein | Nein | Nein |
| Gespeicherte Anmeldung verwalten | Nein | Nein | Nein | Nein |
| RDP- und VNC-Ziele ansehen | Ja | Ja | Ja | Ja |
| Mit RDP- und VNC-Zielen verbinden | Nein | Ja | Ja | Nein |
| RDP- und VNC-Ziele hinzufügen und bearbeiten | Nein | Ja | Nein | Nein |
| RDP- und VNC-Ziele löschen | Nein | Ja | Nein | Nein |
| RDP- und VNC-Ziele testen | Nein | Ja | Ja | Nein |
| Benutzer anzeigen | Ja | Ja | Ja | Nein |
| Benutzer erstellen, Benutzer bearbeiten, Benutzer löschen | Nein | Ja | Nein | Nein |
| Anmeldesicherheit von Benutzern verwalten | Nein | Ja | Nein | Nein |
| Die Konsole als anderer Benutzer ansehen | Nein | Nein | Nein | Nein |
| Organisationen erstellen, Organisationen bearbeiten, Organisationen löschen | Nein | Ja | Nein | Nein |
| Organisationsbenutzer verwalten | Nein | Ja | Nein | Nein |
| Organisationsgeräte verwalten | Nein | Ja | Ja | Nein |
| Beitritt verwalten | Ja | Ja | Nein | Nein |
| Beitrittsanfragen genehmigen | Nein | Ja | Nein | Nein |
| Support-Chat beantworten, Team-Chat nutzen | Nein | Ja | Ja | Ja |
| Unterhaltungen zuweisen | Nein | Ja | Ja | Nein |
| Textbausteine verwalten, Teams verwalten | Nein | Ja | Nein | Nein |
| Audit-Protokoll ansehen, Metriken anzeigen | Ja | Ja | Ja | Ja |
| Sperrliste bearbeiten | Ja | Nein | Nein | Nein |
| Servereinstellungen ändern | Ja | Nein | Nein | Nein |
| API-Schlüssel des Servers verwalten | Ja | Nein | Nein | Nein |
| Kapazitätstests ausführen | Ja | Nein | Nein | Nein |
| Darstellung und Branding ändern | Nein | Ja | Nein | Nein |
| Abrechnung ansehen, Arbeitsberichte schreiben | Nein | Ja | Ja | Nein |
| Abrechnungspakete und Verträge verwalten, Abrechnungsdaten exportieren | Nein | Ja | Nein | Nein |
| CDAP-Geräte ansehen | Nein | Ja | Ja | Ja |
| Befehle an CDAP-Geräte senden | Nein | Ja | Ja | Nein |
| Terminal auf CDAP-Geräten, Dateien auf CDAP-Geräten | Nein | Ja | Nein | Nein |
| Ein- und Ausschalten auf MeshCentral-Agenten | Nein | Ja | Ja | Nein |
| Terminal auf MeshCentral-Agenten, Dateien auf MeshCentral-Agenten | Nein | Ja | Nein | Nein |
| Terminal auf NeoDesk-Agenten, Dateien auf NeoDesk-Agenten | Nein | Ja | Nein | Nein |

Mit **Arbeitsberichte schreiben** kann ein Konto den Arbeitsbericht einer Sitzung abgeben, die es selbst geöffnet hat. Für die Sitzung eines anderen Kontos braucht es zusätzlich **Benutzer bearbeiten**.

Auf einem Gerät mit dem NeoDesk-Agenten brauchen die Werkzeuge im Seitenbereich des Geräts diese Berechtigungen:

- Das Terminal: **Terminal auf NeoDesk-Agenten**.
- Die Dateien: **Dateien auf NeoDesk-Agenten**.
- Bildschirm, Tastatur, Maus und Zwischenablage, Dienste starten und beenden und Prozesse beenden: **Mit Geräten verbinden**.
- Die Listen der Dienste, Prozesse, Ereignisse und Aktivität: **Geräte anzeigen**.
- Den Agenten um frische Daten bitten: **Geräte bearbeiten**, das keines der anderen Werkzeuge öffnet.

Die [Client-Funktionen](/docs/people/permissions#client-features) der Person gelten auch für diese Werkzeuge.

### Wer welche Rolle vergeben darf {#who-can-give-which-role}

- Super-Admin und Administrator dürfen jede Rolle vergeben und jedes Konto ändern.
- Die Rolle Globaler Administrator darf Betrachter, Gastlink-Aussteller, Remote-Operator und Pro-Lizenz vergeben und Konten mit einer dieser Rollen ändern.
- Alle anderen Rollen vergeben keine Rollen. Daran ändert sich nichts, wenn du die Berechtigungen einer Rolle änderst.
- Niemand vergibt mehr, als er selbst hat. Eine Rolle lässt sich nur vergeben, wenn jede ihrer Berechtigungen, mit den Änderungen auf der Seite [Berechtigungen](/docs/people/permissions), auch die Rolle dessen hat, der sie vergibt. Gibt ein Super-Admin der Rolle Remote-Operator eine Berechtigung, die der Globale Administrator nicht hat, kann ein Globaler Administrator Remote-Operator nicht mehr vergeben und Remote-Operator-Konten nicht mehr ändern. Die Regel gilt in der Konsole, am API-Port und für die Rolle eines neuen API-Schlüssels.
- Jede Person mit einem Passwortkonto darf ihr eigenes Passwort unter [Dein Konto](/docs/people/your-account) ändern. Ein Super-Admin kann seinem eigenen Konto die Rolle Super-Admin nicht wegnehmen.
- Ein Konto mit **Benutzer bearbeiten** darf auf der Seite Benutzer sein eigenes Passwort und seine E-Mail-Adresse ändern. Seine eigenen **Einzelne Geräte**, seinen **Ordnerzugriff** und seine **Benutzergruppen** kann nur ein Konto ändern, das seine eigene Rolle vergeben darf, also in der Praxis Super-Admin und Administrator. Alle anderen bekommen „You cannot change your own device access“.

## Welche Geräte ein Benutzer sieht {#which-devices-a-user-sees}

Super-Admin, Administrator, Serveradministrator und Globaler Administrator sehen immer jedes Gerät. Für alle anderen entscheiden drei Angaben im Teil **Gerätezugriff** des Benutzerfensters:

- **Benutzergruppen**: Gruppen, zu denen die Person gehört. Die Zugriffseinstellungen einer Gerätegruppe können eine Benutzergruppe zulassen (siehe [Die Geräteliste](/docs/console/devices)).
- **Ordnerzugriff**: Ordner, deren Geräte die Person sieht. Ein Ordner, der für irgendjemanden ausgewählt ist, ist vor anderen Operatoren und Betrachtern verborgen, denen er nicht zugewiesen ist.
- **Einzelne Geräte**: Geräte, die die Person unabhängig von ihren Ordnern und Gruppen sieht, eine Geräte-ID pro Zeile; **Gerät hinzufügen** fügt eine Zeile hinzu.

Die **Standard-Sichtbarkeit von Geräten** unter **Einstellungen**, **Allgemein** legt fest, was darüber hinaus gilt. Mit **Offen** sehen Personen jedes Gerät außer denen in einem Ordner oder einer Gerätegruppe, deren Zugriffsliste sie nicht enthält. Mit **Eingeschränkt** sehen sie nur die Geräte, die ihnen zugewiesen sind, und wer nichts zugewiesen bekommen hat, sieht eine leere Geräteliste. Unter Offen verbirgt ein zugewiesener Ordner diesen Ordner zwar vor anderen, schränkt aber die Sicht der Person selbst nicht ein. Willst du Personen auf bestimmte Geräte beschränken, nimm deshalb Eingeschränkt. Die Spalte **Geräte** auf der Seite Benutzer zeigt das Ergebnis für jedes Konto.

Für eine Benutzergruppe klickst du im Bereich **Benutzergruppen** der Seite Benutzer auf **Gruppe erstellen**. Personen nimmst du in die Gruppe auf, wenn du sie bearbeitest. Löschst du eine Gruppe, verlieren ihre Mitglieder den Gerätezugriff, den sie über die Gruppe hatten. Dafür brauchst du eine Rolle, die jedes Mitglied der Gruppe ändern darf, und die Grenzen beim [Konsolenzugriff](/docs/people/permissions#console-access), die die Gruppe ihren Mitgliedern gesetzt hat, bleiben bei ihnen als eigene Einstellungen.

## Beispiel: ein Operator für einige Geräte {#example-an-operator-for-some-devices}

Wer sich mit ein paar Geräten verbinden und sonst nichts sehen soll, bekommt die Rolle Remote-Operator und einen Ordner:

1. Lege die Geräte unter **Geräte** in einen Ordner (siehe [Ordner](/docs/console/devices#folders)).
2. Füge die Person auf der Seite Benutzer mit der Rolle **Remote-Operator** hinzu. Wähle unter **Gerätezugriff** den Ordner in **Ordnerzugriff**. Für ein Team legst du stattdessen eine Benutzergruppe an, wählst sie im Ordner unter **Zugelassene Benutzergruppen** aus und nimmst die Personen in die Gruppe auf.
3. Setze unter **Einstellungen**, **Allgemein** die **Standard-Sichtbarkeit von Geräten** auf **Eingeschränkt**. Unter **Offen** würde die Person auch jedes Gerät sehen, das in keinem Ordner und keiner Gruppe mit Zugriffsliste liegt.

Danach kann sich die Person über den [Web-Viewer](/docs/console/remote-in-browser) der Konsole oder die RustDesk-App verbinden und ihr eigenes Passwort unter **Dein Konto** ändern. Der Gerätezugriff entscheidet nur, welche Geräte sie sieht: Beim Verbinden fragt das Gerät weiterhin nach seinem RustDesk-Passwort oder nach einer Bestätigung auf seinem Bildschirm. Willst du auch Teile der Konsole vor ihr verbergen, nutze den [Konsolenzugriff](/docs/people/permissions#console-access).

Für jemanden, der kurz ein Gerät braucht und kein Konto, reicht ein [Gastzugangslink](/docs/console/device-details#guest-access-links).

## Passwortregeln {#password-rules}

Ein neues Passwort braucht 8 bis 128 Zeichen, sonst wird nichts daran geprüft. Dieselbe Regel gilt auf der Seite Benutzer, wenn Personen ihr eigenes Passwort unter **Dein Konto**, **Passwort** ändern, für die Konten einer [Organisation](/docs/people/organizations) und für den Befehl zum Zurücksetzen weiter unten. Die Stärkeanzeige unter dem Passwortfeld ist nur ein Hinweis. Speicherst du ein neues eigenes Passwort, enden deine anderen Konsolensitzungen.

Kann sich niemand mehr als Admin anmelden, führe den Befehl zum Zurücksetzen auf dem Server aus. Nimm dafür den Benutzer und die Umgebung, mit denen der Dienst läuft, damit der Befehl dieselbe Datenbank öffnet. Er liest das neue Passwort von der Standardeingabe und legt ein Konto mit der Rolle Administrator und diesem Namen an, wenn es noch keines gibt:

```bash
read -rs NEW_PASSWORD
printf '%s\n' "$NEW_PASSWORD" | neodesk-server reset-password admin
```

Die Befehle für Docker und den Eintrag **Reset admin password** in den Menüs der Installer findest du unter [Fehlersuche](/docs/operations/troubleshooting#forgot-the-admin-password). Das Zurücksetzen lässt die Zwei-Faktor-Anmeldung, wie sie ist, außer du ergänzt `--reset-two-factor`, das sie für das Konto auch ausschaltet. Wie du sie in der Konsole für jemanden ausschaltest, steht unter [Zwei-Faktor-Anmeldung](/docs/people/two-factor#when-someone-has-lost-the-phone). Sperrt die Zwei-Faktor-Anmeldung den einzigen Admin aus, siehe [Wenn der einzige Admin ausgesperrt ist](/docs/people/two-factor#if-the-only-admin-is-locked-out).

## Sitzungen und fehlgeschlagene Anmeldungen {#sessions-and-failed-sign-ins}

Ein Konto kann auf bis zu 10 Browsern und Geräten gleichzeitig angemeldet sein. Eine Anmeldung darüber hinaus meldet den am längsten nicht verwendeten ab. **Eine Sitzung pro Konto** unter **Einstellungen**, **Anmeldung** erlaubt stattdessen nur eine. Jede Person sieht ihre eigenen Browser unter **Angemeldete Geräte** und meldet sie dort ab; siehe [Dein Konto](/docs/people/your-account#how-many-sessions-an-account-may-have). Eine Sitzung endet außerdem nach 30 Minuten ohne Aktivität und spätestens 24 Stunden nach der Anmeldung. Diese Umgebungsvariablen ändern das (siehe [Konfiguration](/docs/operations/configuration)):

| Variable | Standardwert | Bedeutung |
| --- | --- | --- |
| `SESSION_MAX_PER_USER` | nicht gesetzt | Konsolensitzungen pro Konto, 1 bis 1000, oder `0` für beliebig viele. Ist es gesetzt, entscheidet es statt **Eine Sitzung pro Konto**. |
| `SESSION_IDLE_TIMEOUT` | `1800000` | Millisekunden ohne Aktivität, bis die Sitzung endet, 1 Minute bis 24 Stunden. |
| `SESSION_MAX_AGE` | `86400000` | Millisekunden nach der Anmeldung, bis die Sitzung endet, 5 Minuten bis 7 Tage. |
| `API_MAX_FAILED_ATTEMPTS` | `10` | Fehlgeschlagene Anmeldungen eines Kontos von einer Adresse, nach denen das Konto für diese Adresse gesperrt wird. |
| `API_LOCKOUT_MINUTES` | `15` | Wie lange diese Sperre nach dem letzten Fehlversuch dauert. |
| `API_IP_RATE_LIMIT` | `30` | Fehlgeschlagene Anmeldungen von einer Adresse, nach denen die Adresse blockiert wird. |
| `API_ATTEMPT_WINDOW` | `15` | Minuten, in denen die fehlgeschlagenen Anmeldungen gezählt werden. |

Wie lange der RustDesk-Client angemeldet bleibt, stellst du getrennt davon unter **Einstellungen**, **Anmeldung**, **RustDesk-Clientsitzungen** ein: standardmäßig 7 Tage. Solange der Client genutzt wird, verlängert sich die Sitzung, höchstens auf 30 Tage.
