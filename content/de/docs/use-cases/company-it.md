---
title: IT-Support im eigenen Unternehmen
description: Hilf den Leuten in deiner Firma vom eigenen Server aus: Anmeldung über Active Directory, LDAP oder OIDC, Rollen fürs IT-Team und ein Audit-Protokoll.
order: 2
og: use-case
---

Dein IT-Team hilft den Leuten in der eigenen Firma: beim Laptop, der nicht
druckt, beim PC für den neuen Kollegen, beim Server im Nebenraum. Mit NeoDesk
läuft der Server für die Fernwartung in deinem Unternehmen. Die Leute melden
sich mit den Konten an, die sie schon haben, jeder in der IT bekommt die
passende Rolle, und das Audit-Protokoll zeigt, wer was getan hat. Diese Seite
geht die Einrichtung durch, mit einem Link in die Doku für jeden Schritt.

## Mit den Konten der Firma anmelden {#sign-in-with-the-companys-accounts}

Öffne **Einstellungen**, **Anmeldung**. Unter **Für alle** findest du zwei
Wege, dein Verzeichnis anzubinden:

- **LDAP / Active Directory**: Die Leute melden sich mit Benutzernamen und
  Passwort aus dem Verzeichnis an. Ihr Konto entsteht bei der ersten
  Anmeldung, und ihre Rolle kommt bei jeder Anmeldung aus ihren
  Verzeichnisgruppen. Siehe [LDAP und Active Directory](/docs/people/ldap).
- **OIDC / OAuth2 (SSO)**: Die Anmeldeseite bekommt eine Schaltfläche, die zu
  deinem Identity Provider führt, etwa Keycloak, Okta, Azure AD oder Google.
  Rollen können aus den Gruppen kommen, die der Provider schickt. Siehe
  [Single Sign-on mit OIDC](/docs/people/oidc).

![Die Einstellungsseite Anmeldung mit den Bereichen Passwort und Zwei-Faktor-Anmeldung](shot:settings-auth)

Beides funktioniert auch im normalen RustDesk-Client: Die Leute melden sich
dort mit demselben Konto an und bekommen ihr Adressbuch.

## Jedem in der IT die passende Rolle geben {#give-each-person-in-it-the-right-role}

Ordne Verzeichnisgruppen Rollen zu. Dann ändert eine Änderung im Verzeichnis
bei der nächsten Anmeldung, was jemand darf. Diese Rollen passen zu einem
internen IT-Team:

| Rolle | Wofür |
| --- | --- |
| Super-Admin | Alles, auch Benutzer und Servereinstellungen |
| Serveradministrator | Servereinstellungen, die Sperrliste und Registrierungstokens, ohne Verbindung zu Geräten |
| Globaler Administrator | Benutzer, Organisationen und Geräte, ohne Servereinstellungen |
| Remote-Operator | Mit Geräten verbinden und ihre Details bearbeiten |
| Betrachter | Geräte und Aktivität sehen, ohne sich zu verbinden |
| Gastlink-Aussteller | Gastlinks zu Geräten ausgeben, ohne sich zu verbinden |

Ein Super-Admin ändert unter **Personen**, **Rollen und Berechtigungen**, was
jede Rolle darf, und schränkt mit dem **Konsolenzugriff** einzelne Teile der
Konsole für eine Person oder Gruppe ein. Siehe
[Benutzer und Rollen](/docs/people/users-and-roles) und
[Rollen und Berechtigungen](/docs/people/permissions).

## Einen zweiten Faktor verlangen {#require-a-second-factor}

Für Konten, die sich mit Passwort anmelden, setzt du unter **Einstellungen**,
**Anmeldung**, **Für alle** den Haken bei **Zwei-Faktor-Anmeldung verlangen**.
Ab dann richtet jeder bei der nächsten Anmeldung an der Konsole eine
Authenticator-App ein, und auch der RustDesk-Client fragt nach dem Code.
Verzeichniskonten können die Zwei-Faktor-Anmeldung selbst einschalten;
Single-Sign-on-Konten nutzen den zweiten Faktor deines Identity Providers.
Siehe [Zwei-Faktor-Anmeldung](/docs/people/two-factor).

## Den Client ausrollen {#roll-the-client-out}

Für den normalen RustDesk-Client unter Windows rollst du das MSI von RustDesk
aus wie gewohnt, etwa über Intune. Danach lässt du das Skript aus
**Übersicht**, **Client-Einrichtung**, **Mehr**,
**Windows-Installationsskript (Intune)** laufen: Es gibt RustDesk die vier
Werte deines Servers und kann auch ein permanentes Passwort für den
unbeaufsichtigten Zugriff setzen. Für den NeoDesk-Client erstellst du unter
**Geräte**, **Computer hinzufügen** einen Einladungslink, der mehrmals
funktioniert. Siehe
[Viele Computer auf einmal einrichten](/docs/getting-started/connect-a-client/many-computers).

Neue Installationen starten im Registrierungsmodus **Verwaltet**: Ein neuer
RustDesk-Client wartet unter **Registrierungsanfragen**, bis ihn jemand aus der
IT genehmigt. Ein Computer kommt also nicht schon deshalb herein, weil er die
Adresse des Servers kennt. Computer, die über einen Einladungslink kommen,
sind sofort genehmigt. Siehe [Registrierung](/docs/console/enrollment).

![Registrierungsanfragen mit zehn wartenden Geräten und dem Registrierungsmodus rechts](shot:registrations)

## Einem Kollegen helfen {#help-a-colleague}

Such den Computer unter **Geräte** nach Name, ID oder Benutzer und klicke auf
**Verbinden**. Die Sitzung öffnet sich in einem Browser-Tab; die Person am
Computer nimmt sie an, oder das permanente Passwort des Computers lässt dich
herein. Siehe [Remote Desktop im Browser](/docs/console/remote-in-browser).

Für einen Computer, der noch nicht auf dem Server ist, etwa den Laptop einer
Kollegin im Homeoffice, schickst du einen
[Schnellhilfe-Link](/docs/console/quick-support). Er gilt einmal für eine
Stunde, und installiert wird nichts.

## Sehen, wer was getan hat {#see-who-did-what}

Unter **Aktivität**, **Sicherheit und Protokoll** liegt das Audit-Protokoll:
jede Anmeldung, Sperre, Genehmigung und Änderung an Geräten, Personen und
Einstellungen, mit Konto, Zeit und Adresse. Filtere es nach Art, oder such
nach einer Person oder einem Gerät. Der Server hält diese Einträge 90 Tage;
willst du die Ereignisse des Servers länger behalten, schreib sie mit
`AUDIT_LOG_FILE` zusätzlich in eine Datei. Siehe
[Aktivität und Audit-Protokoll](/docs/console/activity) und
[Überwachung](/docs/operations/monitoring#audit-entries).

![Das Audit-Protokoll mit Anmeldungen und Änderungen an Gerätegruppen](shot:security-audit)

## Wenn jemand die Firma verlässt {#when-someone-leaves}

Wähle in der Zeile der Person auf der Seite **Benutzer** den Eintrag
**Konto deaktivieren**. Sie kann sich dann weder an der Konsole noch im
RustDesk-Client anmelden, und ihre offenen Sitzungen enden. Verzeichnis- und
Single-Sign-on-Konten deaktivierst du, statt sie zu löschen: Solange sie
automatisch angelegt werden, würde die nächste Anmeldung ein neues Konto
erzeugen. Siehe [Konto deaktivieren](/docs/people/users-and-roles#disable-an-account).

## Was in der Firma bleibt {#what-stays-in-the-company}

Server, Datenbank und Audit-Protokoll laufen auf deiner Maschine. NeoDesk
schickt keine Analysedaten, Absturzberichte oder Nutzungsdaten. Einige
Funktionen gehen ins Internet, etwa die Client-Downloads für Einladungslinks,
die von GitHub kommen; [Datenschutz](/docs/project/privacy) listet jeden Host,
den der Server kontaktiert, und wann.
