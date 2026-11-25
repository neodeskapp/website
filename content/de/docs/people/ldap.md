---
title: LDAP und Active Directory
description: Personen mit Benutzername und Passwort aus dem Verzeichnis an der Konsole anmelden lassen und ihnen Rollen aus ihren Verzeichnisgruppen geben.
order: 4
---

Ist die LDAP-Anmeldung eingeschaltet, melden sich Personen aus deinem Verzeichnis mit ihrem Benutzernamen und Passwort aus dem Verzeichnis an. Ihr Konto entsteht bei der ersten Anmeldung, und ihre Rolle ergibt sich bei jeder Anmeldung aus ihren Verzeichnisgruppen. Das funktioniert mit Active Directory und anderen LDAP-Servern.

## Wo du es einstellst {#where-it-is-set}

Öffne **Einstellungen**, **Anmeldung** und gehe unter **Für alle** zu **LDAP / Active Directory**. Den Bereich sehen Konten mit der Berechtigung **Server konfigurieren**: standardmäßig Super-Admin, Administrator und Serveradministrator.

Die Einstellungen liegen in der Datenbank des Servers. Es gibt keine Umgebungsvariablen dafür, und nach dem Speichern gelten sie ohne Neustart ab der nächsten Anmeldung. Wer schon angemeldet ist, bleibt angemeldet.

## Einstellungen {#settings}

Setze den Haken bei **LDAP-Anmeldung einschalten**, damit die Felder erscheinen.

| Einstellung | Bedeutung |
| --- | --- |
| **Host** | Hostname oder Adresse des Verzeichnisservers, etwa `dc01.example.com`. |
| **Port** | `389` für einfaches LDAP und StartTLS, `636` für LDAPS. Ein Haken bei **LDAPS (TLS)** stellt 389 auf 636 um. |
| **LDAPS (TLS)** | Von Anfang an mit TLS verbinden. |
| **StartTLS** | Über den unverschlüsselten Port verbinden und dann auf TLS umschalten. Ohne Wirkung, wenn LDAPS angehakt ist. |
| **TLS-Prüfung überspringen** | Das Zertifikat des Servers nicht prüfen. Nur für Tests. |
| **Verbindungs-Timeout (s)** | Wie viele Sekunden auf die Verbindung zum Verzeichnis und auf jede seiner Antworten gewartet wird. Standard 10. Eine ganze Anmeldung wartet höchstens 30 Sekunden; siehe [Wie lange eine Anmeldung wartet](#how-long-a-sign-in-waits). |
| **Direkter Bind** | Bei der Anmeldung den DN des Benutzers aus einer Vorlage bilden, statt ihn mit einem Dienstkonto zu suchen. |
| **Bind-DN (Dienstkonto)** | Ein Konto mit Lesezugriff, mit dem sich der Server anmeldet, um Benutzer zu suchen. |
| **Bind-Passwort** | Sein Passwort. Ein gespeichertes Passwort erscheint als Punkte; lass sie stehen, um es zu behalten. |
| **Basis-DN** | Wo die Suche nach Benutzern beginnt, etwa `dc=example,dc=com`. Nötig, außer Direkter Bind ist angehakt. |
| **Benutzerfilter** | Die Suche nach dem Benutzer, mit `{{username}}` für den Namen, der bei der Anmeldung eingegeben wurde. Standard `(sAMAccountName={{username}})`. |
| **DN-Vorlage für direkten Bind** | Bei Direktem Bind: der DN des Benutzers mit `{{username}}`, etwa `uid={{username}},ou=users,dc=example,dc=com`. |
| **Benutzernamen-Attribut** | Unter **Benutzerattribute**. Sein Wert wird in Kleinbuchstaben zum Kontonamen. Standard `sAMAccountName`. |
| **E-Mail-Attribut**, **Anzeigenamen-Attribut** | Standard `mail` und `displayName`. Ihre Werte werden bei jeder Anmeldung mit dem Konto gespeichert; die E-Mail-Adresse erscheint in der Spalte **E-Mail** der Seite Benutzer. |
| **Basis-DN für Gruppen** | Wo eine Gruppensuche beginnt. Leer heißt: beim Basis-DN. |
| **Gruppenfilter** | Die Gruppensuche, mit `{{dn}}` für den DN des Benutzers und `{{username}}` für den Kontonamen. Standard `(member={{dn}})`. |
| **Gruppennamen-Attribut** | Das Attribut, das die Gruppensuche abfragt. Standard `cn`. |
| **Benutzer automatisch anlegen** | Standardmäßig an: Wen das Verzeichnis akzeptiert, bekommt bei der ersten Anmeldung ein Konto. Aus: Nur wer hier schon ein Verzeichniskonto hat, kann sich über das Verzeichnis anmelden. |
| **Standardrolle** | Die Rolle für Personen, von deren Gruppen keine in der Zuordnung steht: **Betrachter**, **Operator** oder **Administrator**. Das sind die Rollen Betrachter, Remote-Operator und Administrator aus der [Rollentabelle](/docs/people/users-and-roles#roles). |
| **Zuordnung Gruppe zu Rolle** | Verzeichnisgruppen und die Rolle, die jede davon gibt (siehe unten). |

Bei OpenLDAP und ähnlichen Servern setzt du **Benutzerfilter** etwa auf `(uid={{username}})` und **Benutzernamen-Attribut** auf `uid`.

::: warning
**Administrator** unter **Standardrolle** ist die Rolle Administrator, die jede Berechtigung hat. Damit bekommt jede Person, die das Verzeichnis akzeptiert, die volle Kontrolle über den Server.
:::

## Konten aus dem Verzeichnis {#accounts-from-the-directory}

Meldet sich jemand zum ersten Mal mit Zugangsdaten aus dem Verzeichnis an, legt der Server ein Konto mit dem Tag **LDAP/AD** an. Es heißt wie der Wert aus **Benutzernamen-Attribut**, in Kleinbuchstaben. Solange **Benutzer automatisch anlegen** eingeschaltet ist, bekommt jede Person ein Konto, die der **Benutzerfilter** findet und das Verzeichnis akzeptiert. Willst du nur eine Gruppe hereinlassen, nimm sie in den Filter auf:

```text
(&(sAMAccountName={{username}})(memberOf=CN=NeoDesk Users,OU=Groups,DC=example,DC=com))
```

Was du über Verzeichniskonten wissen solltest:

- Das Verzeichnis prüft das Passwort bei jeder Anmeldung. Die Konsole speichert für diese Konten kein nutzbares Passwort und hat kein Passwortfeld für sie.
- Personen können ihren Benutzernamen in beliebiger Groß- und Kleinschreibung eingeben. Der Kontoname ist immer kleingeschrieben, und jede Schreibweise meldet sich am selben Konto an.
- Gibt es schon ein Passwortkonto mit demselben Namen, wird die Anmeldung über das Verzeichnis mit „Ein lokales Konto mit diesem Benutzernamen existiert bereits.“ abgelehnt. Soll sich die Person über das Verzeichnis anmelden, lösche zuerst das Passwortkonto.
- Solange **Benutzer automatisch anlegen** eingeschaltet ist, hält das Löschen eines Verzeichniskontos auf der Seite Benutzer die Person nicht auf: Ihre nächste Anmeldung legt ein neues Konto an. Um jemanden auszusperren, wähle stattdessen **Konto deaktivieren** im Menü der Zeile (siehe [Konto deaktivieren](/docs/people/users-and-roles#disable-an-account)). Ein deaktiviertes Verzeichniskonto bleibt deaktiviert, wenn sich die Person erneut anmeldet.

## Der RustDesk-Client {#the-rustdesk-client}

Verzeichniskonten melden sich im RustDesk-Client mit demselben Benutzernamen und Verzeichnispasswort an wie in der Konsole. Der Client braucht diesen Server als API-Server (siehe [Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client)). Der Server prüft das Passwort auf dieselbe Weise gegen das Verzeichnis. Solange **Benutzer automatisch anlegen** eingeschaltet ist, legt eine erste Anmeldung im Client das Konto genauso an wie eine Anmeldung in der Konsole. Hat das Konto die [Zwei-Faktor-Anmeldung](/docs/people/two-factor) eingeschaltet, fragt der Client auch nach dem Code.

## Rollen aus Verzeichnisgruppen {#roles-from-directory-groups}

Die Rolle wird bei jeder Anmeldung neu gesetzt, deshalb kannst du sie auf der Seite Benutzer nicht ändern. Der Server liest die Gruppen aus dem Attribut `memberOf` des Benutzers. Nur wenn der Eintrag keines hat, sucht er mit **Basis-DN für Gruppen** und **Gruppenfilter**.

Schreibe einen Eintrag pro Zeile oder trenne die Einträge mit `|`. Jeder Eintrag besteht aus einer Gruppe, `=` und einem Rollennamen aus der [Rollentabelle](/docs/people/users-and-roles#roles), etwa `viewer`, `operator`, `global_admin`, `server_admin` oder `super_admin`. Das letzte `=` in einem Eintrag trennt die Gruppe von der Rolle, deshalb funktionieren auch DNs, die selbst `=` enthalten. Ein Eintrag mit unbekanntem Rollennamen wird übersprungen.

Eine Gruppe, die als vollständiger DN geschrieben ist, muss dem DN der Gruppe entsprechen; Groß- und Kleinschreibung spielen dabei keine Rolle. Ein bloßer Name oder ein einzelnes `CN=name` passt auf jede Gruppe mit diesem Common Name, egal wo sie liegt. Passen mehrere Gruppen, gewinnt die Rolle mit den meisten Rechten: Super-Admin und Administrator, dann Serveradministrator und Globaler Administrator, dann Remote-Operator, dann Betrachter. Passt keine, bekommt die Person die **Standardrolle**.

## Beispiel für Active Directory {#example-for-active-directory}

Eine Domäne `example.com` mit einem Dienstkonto mit Lesezugriff und zwei Gruppen für NeoDesk:

| Einstellung | Wert |
| --- | --- |
| **Host** | `dc01.example.com` |
| **Port** und **LDAPS (TLS)** | `636`, angehakt |
| **Bind-DN (Dienstkonto)** | `CN=svc-neodesk,OU=Service Accounts,DC=example,DC=com` |
| **Basis-DN** | `DC=example,DC=com` |
| **Benutzerfilter** | `(sAMAccountName={{username}})` |
| **Standardrolle** | **Betrachter** |

**Zuordnung Gruppe zu Rolle**:

```text
CN=NeoDesk Admins,OU=Groups,DC=example,DC=com=global_admin
CN=NeoDesk Operators,OU=Groups,DC=example,DC=com=operator
```

Personen melden sich dann mit ihrem `sAMAccountName` in Kleinbuchstaben an, etwa `jdoe`, und mit ihrem Domänenpasswort. Mitglieder von NeoDesk Admins werden Globaler Administrator, Mitglieder von NeoDesk Operators werden Remote-Operator, und alle anderen, die der Filter findet, werden Betrachter.

## Wie lange eine Anmeldung wartet {#how-long-a-sign-in-waits}

Eine Anmeldung über das Verzeichnis hat insgesamt 30 Sekunden, in der Konsole und im RustDesk-Client, egal was unter **Verbindungs-Timeout (s)** steht. Der Server hört 2 Sekunden vorher auf, auf das Verzeichnis zu warten, damit er noch antworten kann.

Hat das Verzeichnis in dieser Zeit nicht geantwortet, zeigt die Anmeldeseite der Konsole „Der Verzeichnisserver hat zu lange für die Antwort gebraucht. Versuchen Sie es gleich noch einmal.“ Der Server legt dann kein Konto an und vermerkt keine Anmeldung. In der Konsole zählt der Versuch nicht für die Sperre des Kontos, weil das Passwort nicht falsch war. Das Audit-Log führt ihn als fehlgeschlagene Anmeldung.

## Testen {#test-it}

1. Fülle die Einstellungen aus und klicke auf **Verbindung testen**. Der Test prüft, ob der Server das Verzeichnis mit den gewählten TLS-Einstellungen erreicht und ob **Bind-DN** und **Bind-Passwort** funktionieren. Er sucht keinen Benutzer.
2. Klicke auf **LDAP-Einstellungen speichern** und bestätige.
3. Bleib angemeldet und melde dich in einem privaten Browserfenster mit einem Verzeichniskonto an.
4. Auf der Seite **Benutzer** erscheint das Konto mit dem Tag **LDAP/AD** und seiner Rolle.

Zeigt die Anmeldung „Ungültiger Benutzername oder Passwort.“, obwohl das Passwort stimmt, prüfe **Basis-DN** und **Benutzerfilter**. Zeigt sie „Der Verzeichnisserver hat zu lange für die Antwort gebraucht. Versuchen Sie es gleich noch einmal.“, hat das Verzeichnis länger als 30 Sekunden gebraucht; siehe [Wie lange eine Anmeldung wartet](#how-long-a-sign-in-waits). Ist die Rolle falsch, prüfe die Zuordnung. Ist die Zuordnung ausgefüllt und die Person in irgendeiner Gruppe, steht im Log des Servers eine Zeile, die mit `[LDAP] User` beginnt und die gefundenen Gruppen und die gewählte Rolle nennt. Wo das Log liegt, steht unter [Fehlersuche](/docs/operations/troubleshooting).
