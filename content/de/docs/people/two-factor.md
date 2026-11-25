---
title: Zwei-Faktor-Anmeldung
description: Codes einer Authenticator-App einschalten, damit anmelden, Wiederherstellungscodes nutzen und erneuern und die Zwei-Faktor-Anmeldung zur Pflicht machen.
order: 3
---

Mit der Zwei-Faktor-Anmeldung öffnet ein Passwort allein dein Konto nicht mehr: Nach dem Passwort tippst du zusätzlich einen sechsstelligen Code aus einer Authenticator-App auf deinem Handy ein, etwa Google Authenticator, Microsoft Authenticator oder Authy. Jede Person schaltet sie für ihr eigenes Konto ein, und ein Admin kann sie für Passwortkonten zur Pflicht machen.

![Die Einstellungsseite Anmeldung mit den Bereichen Passwort und Zwei-Faktor-Anmeldung](shot:settings-auth)

## Einschalten {#turn-it-on}

1. Öffne das Kontomenü am Ende der oberen Leiste, wähle **Ihr Konto** und gehe zu **Zwei-Faktor-Anmeldung**. Siehe [Dein Konto](/docs/people/your-account).
2. Klicke auf **Zwei-Faktor-Anmeldung einrichten**.
3. Installiere eine Authenticator-App auf deinem Handy, falls du noch keine hast.
4. Scanne den QR-Code mit der App. Klappt das Scannen nicht, tippe stattdessen den Wert unter **Manueller Schlüssel** in die App ein.
5. Tippe den sechsstelligen Code, den die App zeigt, in das Feld **Bitte geben Sie einen 6-stelligen Code ein** und klicke auf **Prüfen und einschalten**.
6. Die Seite zeigt acht **Wiederherstellungscodes**. Bewahre sie an einem sicheren Ort außerhalb des Handys auf, etwa in einem Passwortmanager, und klicke dann auf **Ich habe die Codes gespeichert**.

Der Bereich zeigt jetzt **Zwei-Faktor-Anmeldung ist aktiv**. Admins sehen dasselbe in der Spalte **Zwei-Faktor-Anmeldung** auf der Seite **Benutzer**. Das Einschalten meldet die anderen Browser deines Kontos ab; der, den du benutzt hast, bleibt angemeldet.

In der App heißt der neue Eintrag NeoDesk, gefolgt von deinem Benutzernamen. Jede App für zeitbasierte Codes funktioniert: Die Codes haben sechs Ziffern und wechseln alle 30 Sekunden.

Verlässt du die Seite vor Schritt 5, bleibt die Zwei-Faktor-Anmeldung aus. Das nächste **Zwei-Faktor-Anmeldung einrichten** erzeugt einen neuen Schlüssel, also entferne den ungenutzten Eintrag aus der App.

## Mit einem Code anmelden {#sign-in-with-a-code}

1. Gib wie bisher Benutzername und Passwort auf der Anmeldeseite ein.
2. Die Seite fragt nach dem **Bestätigungscode**. Tippe die sechs Ziffern ein, die deine App gerade zeigt, und klicke auf **Bestätigen**.

Der Code wechselt alle 30 Sekunden, und der Server nimmt nur den Code der aktuellen 30 Sekunden an. Jeder Code funktioniert einmal. Werden richtige Codes abgelehnt, prüfe, ob die Uhr auf deinem Handy und auf dem Server stimmt.

Nach dem Passwort hast du fünf Minuten Zeit für den Code. Nach fünf falschen Codes oder wenn die Zeit um ist, zeigt die Seite „Sitzung abgelaufen. Bitte melden Sie sich erneut an.“ Klicke auf **Zurück zur Anmeldung** und fang wieder mit dem Passwort an. Falsche Codes zählen auch als fehlgeschlagene Anmeldungen, viele davon sperren das Konto also eine Zeit lang (siehe [fehlgeschlagene Anmeldungen](/docs/people/users-and-roles#sessions-and-failed-sign-ins)).

Auch der RustDesk-Client fragt nach dem Code, wenn du dich dort mit einem Konto anmeldest, bei dem die Zwei-Faktor-Anmeldung eingeschaltet ist.

## Einen Wiederherstellungscode verwenden {#use-a-recovery-code}

Hast du dein Handy nicht zur Hand, klicke auf der Code-Seite auf **Stattdessen einen Wiederherstellungscode verwenden**, tippe einen deiner Wiederherstellungscodes in **Wiederherstellungscode** und klicke auf **Bestätigen**. Großbuchstaben, Leerzeichen und Bindestriche spielen keine Rolle.

Jeder Wiederherstellungscode funktioniert einmal. So bekommst du einen neuen Satz, etwa wenn die Codes knapp werden:

1. Öffne **Ihr Konto** und klicke unter **Zwei-Faktor-Anmeldung** auf **Neue Wiederherstellungscodes**.
2. Tippe einen aktuellen Code aus deiner App in **Bestätigungscode** und klicke auf **Neue Wiederherstellungscodes**.
3. Bewahre die acht neuen Codes auf. Die alten funktionieren dann nicht mehr.

Ein falscher Code zählt als fehlgeschlagene Anmeldung.

## Ausschalten {#turn-it-off}

1. Öffne **Ihr Konto** im Kontomenü.
2. Klicke unter **Zwei-Faktor-Anmeldung** auf **Zwei-Faktor-Anmeldung ausschalten**.
3. Gib unter **Aktuelles Passwort** dein Passwort ein und klicke noch einmal auf **Zwei-Faktor-Anmeldung ausschalten**. Verzeichnis- und Single-Sign-on-Konten haben in dieser Konsole kein Passwort; sie tippen stattdessen einen aktuellen Code aus der App in **Bestätigungscode**.

Das löscht den Schlüssel und die Wiederherstellungscodes und meldet die anderen Browser deines Kontos ab. Ein falsches Passwort oder ein falscher Code zählt als fehlgeschlagene Anmeldung.

## Wenn jemand das Handy verloren hat {#when-someone-has-lost-the-phone}

Hat jemand sowohl das Handy als auch die Wiederherstellungscodes verloren, schaltet ein Admin die Zwei-Faktor-Anmeldung für diese Person aus:

1. Öffne **Personen**, dann **Benutzer**.
2. Wähle im Menü der Zeile der Person **Zwei-Faktor-Anmeldung ausschalten** und bestätige.

Das löscht Schlüssel und Wiederherstellungscodes der Person und beendet ihre Konsolensitzungen und Anmeldungen im RustDesk-Client. Sie meldet sich nur mit dem Passwort an, bis sie die Zwei-Faktor-Anmeldung wieder einrichtet. Den Menüeintrag gibt es bei Konten mit eingeschalteter Zwei-Faktor-Anmeldung, und zwar für Personen mit **Benutzer bearbeiten**, deren Rolle das Konto ändern darf (siehe [wer welche Rolle vergeben darf](/docs/people/users-and-roles#who-can-give-which-role)). Deine eigene Zwei-Faktor-Anmeldung schaltest du unter **Ihr Konto** aus.

Der Befehl des Servers zum Zurücksetzen des Passworts lässt die Zwei-Faktor-Anmeldung, wie sie ist.

## Zur Pflicht machen {#make-it-mandatory}

Ein Konto mit der Berechtigung **Server konfigurieren** (standardmäßig Super-Admin, Administrator und Serveradministrator) kann die Zwei-Faktor-Anmeldung für jedes Passwortkonto verlangen:

1. Öffne **Einstellungen**, **Anmeldung** und gehe zu **Für alle**.
2. Setze den Haken bei **Zwei-Faktor-Anmeldung verlangen** und klicke auf **Speichern**.

Ab dann richtet ein Passwortkonto ohne Zwei-Faktor-Anmeldung sie direkt nach dem Passwort ein, wenn es sich an der Konsole anmeldet. Die Anmeldeseite zeigt **Zwei-Faktor-Anmeldung einrichten** mit dem QR-Code und dem Feld **Manueller Schlüssel**. Die Person scannt den QR-Code, tippt den Code aus der App ein, klickt auf **Bestätigen**, bewahrt die Wiederherstellungscodes auf, klickt auf **Ich habe die Codes gespeichert** und ist dann angemeldet. Die Einrichtung muss innerhalb von 15 Minuten fertig sein, und fünf falsche Codes brechen sie ab; dann beginnt die Anmeldung wieder mit dem Passwort.

Solange das Konto keine Zwei-Faktor-Anmeldung hat, lehnt der RustDesk-Client es mit „Two-factor sign-in is required for this account. Sign in to the web console once to set it up.“ ab. Personen können die Zwei-Faktor-Anmeldung für ihr eigenes Konto weiterhin ausschalten, und ihre nächste Anmeldung an der Konsole verlangt dann wieder die Einrichtung.

Die Einstellung gilt nicht für Verzeichnis- und Single-Sign-on-Konten; die bleiben ihrem Verzeichnis oder Identitätsanbieter überlassen. Sie gilt auch nicht für Konten mit Pro-Lizenz: Diese können sich nicht an der Konsole anmelden, wo die Einrichtung stattfindet, und melden sich deshalb weiter mit ihrem Passwort im RustDesk-Client an.

## Verzeichnis- und Single-Sign-on-Konten {#directory-and-single-sign-on-accounts}

- Nach einem [Single Sign-on](/docs/people/oidc) fragt die Konsole nicht nach einem Code. Nutze stattdessen die Zwei-Faktor-Anmeldung deines Identitätsanbieters.
- Ein [Verzeichniskonto](/docs/people/ldap) kann die Zwei-Faktor-Anmeldung einschalten und wird dann nach Codes gefragt. Es schaltet sie mit einem aktuellen Code aus, wie unter [Ausschalten](#turn-it-off) beschrieben.
