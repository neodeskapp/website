---
title: Die Einrichtungsanleitung
description: Die Checkliste, die eine neue Installation ihrem ersten Admin auf der Übersicht zeigt: die acht Schritte, wann sie sich abhaken, wie du sie ausblendest.
order: 1
---

Eine neue Installation öffnet die Übersicht mit einer Einrichtungsanleitung für
ihren ersten Admin. Sie ist eine Checkliste, **Diesen Server einrichten**, mit
acht Schritten in der Reihenfolge, in der ein neuer Admin sie braucht. Jeder
Schritt führt an die Stelle, wo du ihn erledigst, und hakt sich selbst ab,
sobald der Server ihn erledigt sieht. Von Hand abhaken lässt sich kein Schritt.

![Die Übersicht mit der Einrichtungsanleitung: 7 von 8 Schritten erledigt, HTTPS vor die Konsole setzen ist noch offen](shot:setup-guide)

## Wer sie sieht {#who-sees-it}

Die Anleitung öffnet sich einmal von selbst, für das erste Admin-Konto einer
neuen Installation. Neu ist eine Installation, wenn der Server ihre Datenbank
bei diesem Start angelegt hat, oder wenn sie noch niemand benutzt hat: Kein
Konto hat sich je angemeldet, und es gibt kein Gerät. Ein Update öffnet die
Anleitung nie auf einer Installation, die schon in Betrieb war, und kein
anderes Konto bekommt sie von selbst.

Nur Konten mit der Berechtigung **Server konfigurieren** sehen die Anleitung
und können sie zurückholen, siehe
[Ausblenden und zurückholen](#hide-it-and-bring-it-back).

## Die Schritte {#the-steps}

Die Anleitung zeigt die Schritte in dieser Reihenfolge. Ein Konto bekommt nur
die Schritte, die es selbst erledigen darf, deshalb sieht ein anderer Admin
eventuell weniger als acht.

| Schritt | Wohin er führt | Hakt sich ab, wenn |
|---|---|---|
| **Erstes Passwort ändern** | **Einstellungen**, **Anmeldung**, das Passwortformular | Das Passwort des ersten Admins nicht mehr das ist, das die Installation erzeugt hat |
| **Zwei-Faktor-Anmeldung einschalten** | **Einstellungen**, **Anmeldung**, **Zwei-Faktor-Anmeldung** | Dein Konto die Zwei-Faktor-Anmeldung eingeschaltet hat |
| **Adresse für Clients festlegen** | **Einstellungen**, **Allgemein**, **Öffentliche Client-Endpunkte** | Die Adresse, die Clients bekommen, für andere Computer erreichbar ist |
| **HTTPS vor die Konsole setzen** | [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls), in einem neuen Tab | Du die Konsole über HTTPS geöffnet hast oder die Konsole selbst HTTPS anbietet |
| **Ersten Computer hinzufügen** | **Computer hinzufügen**, direkt auf der Übersicht | Der Server ein Gerät hat |
| **Eine Fernsitzung öffnen** | **Alle Geräte** | Der Server eine Fernsitzung gesehen hat |
| **Weitere Personen hinzufügen** | **Benutzer** | Es ein weiteres Konto gibt, das nicht deaktiviert ist, oder Single Sign-on oder LDAP eingeschaltet ist |
| **Sicherung erstellen** | **Einstellungen**, **Sicherung**, **Sicherung erstellen** | Eine Sicherung von Hand erstellt wurde oder eine geplante Sicherung geklappt hat |

Die Fortschrittszeile über der Liste zählt die Schritte, zum Beispiel „3 von 8
erledigt. Ein Schritt hakt sich selbst ab, sobald der Server ihn erledigt
sieht.“ Sind alle Schritte erledigt, steht dort „Alle Schritte sind erledigt.
Sie können die Anleitung jetzt ausblenden.“

### Welche Schritte ein Konto bekommt {#which-steps-an-account-gets}

- **Erstes Passwort ändern** sieht nur der erste Admin, das Konto, für das sich
  die Anleitung geöffnet hat, und nur solange es sich mit einem eigenen
  Passwort anmeldet.
- **Zwei-Faktor-Anmeldung einschalten** sehen Konten, die sich mit einem
  eigenen Passwort anmelden, nicht über Single Sign-on oder LDAP.
- **Ersten Computer hinzufügen** braucht **Registrierungen genehmigen**.
- **Eine Fernsitzung öffnen** braucht **Mit Geräten verbinden**.
- **Weitere Personen hinzufügen** braucht **Benutzer erstellen**.
- **Sicherung erstellen** sehen nur Konten mit der Rolle Super-Admin oder
  Administrator, weil nur sie eine vollständige Sicherung erstellen dürfen.

### Wann ein Schritt als erledigt gilt {#when-a-step-counts-as-done}

**Adresse für Clients festlegen** prüft die Adresse, die der Server Clients
gibt, wenn niemand eine nennt. Der Schritt bleibt offen, solange diese Adresse
`localhost` ist, eine Loopback-Adresse oder `0.0.0.0`, ein Name ohne Punkt
(etwa der eines Containers) oder ein Name, der auf `.local` endet. Leg die
Adresse unter **Öffentliche Client-Endpunkte** fest, wie
[Die Adresse für die Clients festlegen](/docs/getting-started/first-sign-in#set-the-address-clients-use)
es beschreibt.

**HTTPS vor die Konsole setzen** ist erledigt, wenn du die Konsole über HTTPS
nutzt. Hinter einem Reverse Proxy, der TLS beendet, muss die Konsole dem Proxy
vertrauen, sonst sieht sie nicht, dass die Anfrage über HTTPS kam; siehe
[Dem Proxy vertrauen](/docs/operations/reverse-proxy-tls#trusting-the-proxy).
Der Schritt ist auch erledigt, wenn die Konsole HTTPS auf ihrem eigenen Port
anbietet, so wie die Skripte für Linux und Windows sie auf 5443 einrichten.

**Eine Fernsitzung öffnen** zählt jede Sitzung zu jedem Gerät: eine, die der
Server aufgebaut hat, im Browser oder in einer App, oder eine, die ein Client
gemeldet hat.

Eine Sitzung, eine Sicherung und ein geändertes erstes Passwort bleiben
erledigt, sobald die Anleitung sie gesehen hat, auch wenn ihre Spur längst aus
den Protokollen verschwunden ist.

## Einen Schritt erledigen {#doing-a-step}

Klick auf einen Schritt. Die meisten Schritte öffnen eine Seite der Konsole mit
einer Zeile darüber: **Zurück zur Einrichtungsanleitung** und der Name des
Schritts nach „Schritt:“. Die Zeile bringt dich zurück zur Übersicht.
**Ersten Computer hinzufügen** öffnet
[Computer hinzufügen](/docs/console/add-a-computer) direkt auf der Übersicht,
und **HTTPS vor die Konsole setzen** öffnet die Doku in einem neuen Tab, weil
HTTPS außerhalb der Konsole eingerichtet wird.

Die Übersicht prüft die Schritte alle 30 Sekunden, solange ihr Tab offen ist,
wenn du **Aktualisieren** wählst und wenn **Computer hinzufügen** sich
schließt.

## Ausblenden und zurückholen {#hide-it-and-bring-it-back}

**Anleitung ausblenden**, oben rechts in der Anleitung, blendet sie für dein
Konto aus. Die Konsole meldet dann „Die Einrichtungsanleitung ist
ausgeblendet. Unter Hilfe und in den Einstellungen holen Sie sie zurück.“ Was
die Anleitung schon erledigt gesehen hat, bleibt erhalten.

Um sie wieder anzuzeigen, wähl an einer von zwei Stellen
**Einrichtungsanleitung anzeigen**:

- **Hilfe** in der oberen Leiste, ganz oben im Bereich
- **Einstellungen**, dann **Allgemein**, am Ende der Seitenspalte

Beides öffnet die Übersicht mit der Anleitung. Ausblenden und Zurückholen
ändern die Anleitung nur für dein Konto.
