---
title: Organisationen
description: Personen und Geräte pro Kunde oder Standort gruppieren, ein Adressbuch mit Mitgliedern teilen und wissen, was die Mitgliedschaft ändert und was nicht.
order: 6
---

Eine Organisation fasst Personen und Geräte zusammen, die zusammengehören, zum Beispiel einen Kunden oder einen Standort. Sie hat Mitglieder, zugeordnete Geräte, ein gemeinsames Adressbuch für den RustDesk-Client und einige gespeicherte Einstellungen.

![Die Seite Organisationen mit drei Organisationen und der Zahl ihrer Benutzer und Geräte](shot:organizations)

## Was die Mitgliedschaft bewirkt und was nicht {#what-membership-does-and-does-not-do}

Mitglied einer Organisation zu sein ändert nicht, was eine Person in der Konsole sieht oder tun darf. Das ergibt sich allein aus ihrer [Rolle und ihrem Gerätezugriff](/docs/people/users-and-roles): Die Seite **Organisationen** listet jede Organisation für alle, die die Seite öffnen dürfen, und die Geräteliste filtert nicht nach Organisation.

Die Mitgliedschaft gibt dafür das gemeinsame Adressbuch der Organisation. Mitglieder, die sich im RustDesk-Client anmelden, finden dessen Kontakte in ihrem Adressbuch (siehe [das gemeinsame Adressbuch](#the-shared-address-book)). Innerhalb der Organisation haben Mitglieder keine Rolle.

## Wer Organisationen verwalten darf {#who-can-manage-organizations}

Die Seite liegt unter **Personen**, **Organisationen**, für Rollen mit **Organisationen erstellen**, **Organisationen bearbeiten** oder **Organisationsbenutzer verwalten**: standardmäßig Super-Admin, Administrator und Globaler Administrator.

| Aktion | Berechtigung |
| --- | --- |
| Organisationen sehen, mit ihren Geräten, Einstellungen und ihrem Adressbuch | Benutzer anzeigen |
| Die Mitglieder sehen | Benutzer anzeigen und Organisationsbenutzer verwalten |
| Eine Organisation anlegen | Organisationen erstellen |
| Name, Kurzname, Logo und Adressbuch ändern | Organisationen bearbeiten |
| Mitglieder hinzufügen und entfernen, Einladungen erstellen und widerrufen | Organisationsbenutzer verwalten |
| Geräte zuordnen und entfernen | Organisationsgeräte verwalten |
| Eine Organisation löschen | Organisationen löschen |

## Organisation anlegen {#create-an-organization}

1. Öffne **Personen**, dann **Organisationen**, und klicke auf **Organisation anlegen**.
2. Trage unter **Name** einen Namen ein.
3. Trage unter **Kurzname** einen eindeutigen Kurznamen aus 3 bis 64 Kleinbuchstaben, Ziffern und Bindestrichen ein, etwa `example-clinic`.
4. Trage bei Bedarf unter **Logo-URL** die Webadresse eines Bildes ein.
5. Klicke auf **Organisation anlegen**.

Die Liste zeigt für jede Organisation Namen und Kurznamen, die Zahl ihrer Benutzer und Geräte und wann sie angelegt wurde. Klicke auf eine Zeile, um die Organisation zu öffnen. Ihre Seite hat die Tabs **Benutzer**, **Geräte**, **Adressbuch** und **Einstellungen** und eine Spalte **Details** mit Kurzname, Datum, Logo-Adresse und ID.

## Personen hinzufügen {#add-people}

Öffne die Organisation, gehe zum Tab **Benutzer** und klicke auf **Benutzer hinzufügen**. Der Dialog hat zwei Tabs:

- **Neues Konto**: ein **Benutzername** und ein **Passwort** mit mindestens 8 Zeichen. Das legt eine [Client-Anmeldung](#client-sign-ins) an, die es nur in dieser Organisation gibt.
- **Vorhandener Serverbenutzer**: Wähle unter **Benutzer auswählen** ein Konto der Konsole. Die Person meldet sich weiter mit ihrem eigenen Konto an.

Du kannst ein Konto der Konsole auch auf der Seite **Benutzer** hinzufügen: Wähle **Organisationen…** im Menü seiner Zeile, wähle die **Organisation** und klicke auf **Zur Organisation hinzufügen**. Dasselbe Fenster listet, wo die Person Mitglied ist, und nimmt sie mit **Entfernen** wieder heraus. Die Spalte **Organisationen** der Seite Benutzer zeigt, wo jede Person Mitglied ist.

**Aus der Organisation entfernen** im Menü der Zeile eines Mitglieds löscht ein Konto, das nur für diese Organisation angelegt wurde. Ein Serverkonto bleibt bestehen und verlässt nur die Organisation.

## Client-Anmeldungen {#client-sign-ins}

Ein Konto, das in der Organisation angelegt wurde, mit **Neues Konto** oder über eine [Einladung](#invitations), hat in der Mitgliederliste den Tag **Client-Anmeldung**. Es ist eine Anmeldung für den NeoDesk-Client: Die Person meldet sich dort über den Kurznamen der Organisation mit diesem Benutzernamen und Passwort bei der Organisation an, und der Client zeigt das gemeinsame Adressbuch der Organisation. An der Konsole oder am normalen RustDesk-Client kann sie sich damit nicht anmelden, und das Konto steht nicht auf der Seite Benutzer.

Außer dem gemeinsamen Adressbuch kann eine Client-Anmeldung nur Name, Kurzname und Logo der Organisation lesen. Mitglieder, Einladungen, zugeordnete Geräte, Einstellungen und Richtlinien kann sie nicht lesen.

### Einladungen {#invitations}

Mit einer Einladung wählt die Person Benutzername und Passwort selbst:

1. Klicke im Tab **Benutzer** unter **Einladungen** auf **Einladung erstellen**.
2. Trage bei Bedarf die **E-Mail** der Person ein und setze **Gültig für (Stunden)**: 1 bis 720, standardmäßig 72.
3. Klicke auf **Einladung erstellen** und kopiere den **Einladungslink**. Er wird nur jetzt angezeigt und funktioniert einmal.
4. Schicke den Link an die Person. NeoDesk verschickt selbst keine E-Mail.

Der Link öffnet eine Seite der Konsole. Dort gibt die Person unter **Benutzername** einen Namen aus 3 bis 64 Buchstaben, Ziffern und `.`, `_`, `@` oder `-` ein, unter **Passwort** und **Passwort wiederholen** ein Passwort mit mindestens 8 Zeichen, und klickt auf **Anmeldung erstellen**. Danach sagt ihr die Seite, dass sie sich im NeoDesk-Client bei der Organisation anmelden soll. Einen Benutzernamen, den es in der Organisation schon gibt, lehnt die Seite mit „Diese Organisation hat diesen Benutzernamen schon. Wähle einen anderen.“ ab.

Die Liste unter **Einladungen** zeigt für jede Einladung die E-Mail-Adresse, wann sie abläuft und wann sie benutzt wurde. **Widerrufen** macht eine unbenutzte Einladung ungültig.

## Geräte zuordnen {#assign-devices}

Klicke im Tab **Geräte** auf **Gerät zuordnen** und gib die **Geräte-ID** ein, die der RustDesk-Client auf diesem Gerät zeigt. **Abteilung** und **Gebäude** sind optionale Notizen. **Aus der Organisation entfernen** im Menü der Zeile eines Geräts nimmt es wieder heraus; das Gerät bleibt auf dem Server.

Der Tab listet auch die Gerätegruppen und Benutzergruppen, die mit der Organisation verknüpft sind. **Gerätegruppe erstellen** legt eine mit ihr verknüpfte Gerätegruppe an, für Konten mit **Geräte bearbeiten**. Die Geräte dieser Gruppe und wer sie nutzen darf, verwaltest du auf der Seite [Geräte](/docs/console/devices). Dort lässt sich auch eine verknüpfte Benutzergruppe für die Gruppe zulassen.

## Das gemeinsame Adressbuch {#the-shared-address-book}

Im Tab **Adressbuch** pflegst du die Kontakte, die Mitglieder im RustDesk-Client bekommen.

1. Setze den Haken bei **Dieses Adressbuch mit Organisationsmitgliedern teilen**.
2. Klicke auf **Kontakt hinzufügen** und gib eine **Geräte-ID** ein, optional einen **Alias** und **Kontakt-Tags**. Oder klicke auf **Geräte der Organisation hinzufügen**, um alle zugeordneten Geräte auf einmal aufzunehmen.
3. Klicke auf **Adressbuch speichern**.

Mitglieder, die sich im RustDesk-Client anmelden, bekommen diese Kontakte in ihr Adressbuch. Ihre persönlichen Einträge bleiben privat und haben Vorrang, wenn beide dasselbe Gerät enthalten. Kontakte für Geräte, die die Person nicht sehen darf, fallen weg.

**Passwort setzen** bei einem Kontakt speichert das dauerhafte Passwort dieses Geräts verschlüsselt in der Datenbank, damit Mitglieder sich verbinden können, ohne es einzutippen. Es muss mit dem Passwort übereinstimmen, das auf dem Gerät gesetzt ist. Wer den Kontakt sehen kann, bekommt dieses Passwort unter Umständen beim Verbinden. Setze es deshalb nur bei Kontakten, die jedes Mitglied nutzen darf.

## Einstellungen und Löschen {#settings-and-deleting}

Der Tab **Einstellungen** listet unter **Alle gespeicherten Einstellungen** jeden Wert, der für die Organisation gespeichert ist, auch Richtlinien von der Seite **Richtlinien**. Die Regeln, denen Geräte folgen, wenn sich jemand mit ihnen verbindet, legst du auf dieser Seite fest; **Richtlinien öffnen** in diesem Tab bringt dich dorthin. Was jede Person in einer Sitzung tun darf, legst du mit den [Client-Funktionen](/docs/people/permissions#client-features) fest.

Um eine Organisation zu löschen, klicke im Tab Einstellungen unter **Löschen** auf **Organisation löschen…** oder in der Liste auf **Löschen** im Menü ihrer Zeile, und bestätige. Das löscht die Client-Anmeldungen, Einladungen, Einstellungen und das gemeinsame Adressbuch der Organisation sowie die gespeicherten Gerätepasswörter. Serverkonten bleiben, und die Geräte bleiben ohne Organisation auf dem Server. Das lässt sich nicht rückgängig machen.
