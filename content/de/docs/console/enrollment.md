---
title: Registrierungsanfragen
description: Festlegen, welche neuen Geräte dem Server beitreten dürfen, und die Geräte genehmigen oder ablehnen, die anfragen.
order: 5
---

Der Registrierungsmodus entscheidet, ob ein neues Gerät dem Server von selbst beitreten kann oder warten muss, bis jemand es genehmigt. Wartende Geräte erscheinen unter **Geräte**, **Registrierungsanfragen**, wo du sie genehmigst oder ablehnst. Die Zahl neben **Registrierungsanfragen** in der Seitenleiste sagt, wie viele warten.

![Registrierungsanfragen mit zehn wartenden Geräten und dem Registrierungsmodus rechts](shot:registrations)

## Registrierungsmodi {#enrollment-modes}

| Modus | Was passiert, wenn sich ein neuer RustDesk-Client registriert |
|---|---|
| **Offen** | Jedes Gerät kann beitreten. Niemand muss es genehmigen. |
| **Verwaltet** | Ein neues Gerät braucht einen Token, sonst wartet es unter **Registrierungsanfragen**, bis jemand es genehmigt. |
| **Gesperrt** | Nur Geräte mit einem gültigen Token können beitreten. Andere werden abgewiesen und erscheinen nicht als Anfragen. |

Die Seitenspalte von **Registrierungsanfragen** zeigt, welcher Modus aktiv ist. Ein in der Konsole gespeicherter Modus bleibt über Neustarts erhalten. Solange keiner gespeichert ist, übernimmt der Server beim Start die Umgebungsvariable `ENROLLMENT_MODE` und speichert sie als Modus, oder er nutzt **Offen**, wenn die Variable nicht gesetzt ist. Die Installer und der Docker-Container setzen bei einer neuen Installation `managed`.

Der Modus entscheidet nur über neue Geräte. Ein Gerät, das der Server schon kennt, kann sich in jedem Modus jederzeit wieder registrieren. Tokens erstellst du unter **Einstellungen**, **Gerätetokens**. Ein Gerät, das bei der Registrierung einen gültigen Token sendet, tritt in den Modi **Verwaltet** und **Gesperrt** ohne Wartezeit bei. Tokens sind für NeoDesk-Clients gedacht: Der normale RustDesk-Client kann keinen senden.

Der Modus gilt für RustDesk-Clients. Neue Mesh-Agenten warten unabhängig vom Modus in derselben Liste auf eine Genehmigung; siehe [MeshAgent-Geräte](/docs/console/meshagent#install-the-agent-on-a-device).

### Den Modus ändern {#changing-the-mode}

Ändere ihn unter **Einstellungen**, **Gerätetokens**, in der Seitenspalte. Der Modus wird gespeichert, sobald du ihn auswählst. Diese Seite braucht die Berechtigung, die Registrierung zu verwalten: Standardmäßig haben sie Konten mit den Rollen Super-Admin, Serveradministrator und Globaler Administrator.

Die Änderung gilt sofort für Geräte, die ab dann beitreten. Geräte, die schon auf dem Server sind, funktionieren weiter.

Für Konten mit dieser Berechtigung zeigt **Registrierungsanfragen** unter dem aktuellen Modus den Link **Anmeldemodus ändern**. Außerdem zeigt unter **Einstellungen**, **Anmeldung**, Abschnitt **Für alle**, der Eintrag **Geräteregistrierung (RustDesk)** den aktuellen Modus mit **Unter Gerätetokens ändern**. Beide Links öffnen **Gerätetokens**. Andere Konten, die **Registrierungsanfragen** öffnen, sehen in der Seitenspalte „Ein Administrator kann das unter Gerätetokens ändern.“, solange RustDesk-Clients im Modus **Offen** oder **Gesperrt** warten.

::: note
`ENROLLMENT_MODE_ENV_OVERRIDE=Y` in der Umgebung des Servers sorgt dafür, dass der Server `ENROLLMENT_MODE` bei jedem Start anwendet, auch wenn in der Konsole ein anderer Modus gespeichert ist. Eine Änderung in der Konsole gilt dann nur bis zum nächsten Neustart. Siehe [Konfiguration](/docs/operations/configuration#security).
:::

Wechselst du zu **Offen**, während RustDesk-Clients warten, können sich diese Geräte beim nächsten Versuch verbinden, ob du sie genehmigst oder nicht; eine Genehmigung setzt trotzdem ihren Namen und Ordner. Wechselst du zu **Gesperrt**, bleiben die wartenden Geräte blockiert, bis du sie genehmigst. Die Seitenspalte weist darauf hin, solange das zutrifft.

## Die Liste {#the-list}

Die Schaltflächen über der Liste legen fest, was sie zeigt: **Wartend**, **Genehmigt**, **Abgelehnt** oder **Alle**. Das Suchfeld findet Anfragen nach Name, ID oder Adresse. Die Zeile darunter sagt, wie viele Geräte warten und wie lange das älteste schon wartet, zum Beispiel „10 warten, älteste: Vor 6 Tag(en).“

| Spalte | Zeigt |
|---|---|
| **Gerät** | Den Namen, den das Gerät gesendet hat, oder **Kein Name übermittelt**, und seine ID |
| **Plattform** | Das Betriebssystem und die Client-Version |
| **IP-Adresse** | Die Adresse, von der die Anfrage kam |
| **Eingegangen über** | **RustDesk-Client**, **Lokales Netzwerk** oder **Mesh-Agent** |
| **Angefragt** | Wann das Gerät angefragt hat |
| **Status** | **Wartend**, **Genehmigt** oder **Abgelehnt**, dazu wer wann entschieden hat, und „Gerät gesperrt“, wenn es dabei auch gesperrt wurde |

Auf den meisten Bildschirmen sind **IP-Adresse** und **Eingegangen über** ausgeblendet; klicke auf eine Zeile, um alle Details einer Anfrage in einem Seitenbereich zu sehen. Die Liste aktualisiert sich von selbst, wenn eine Anfrage eintrifft oder jemand anderswo über eine entscheidet.

**Lokales Netzwerk** steht für einen Client, der diesen Server über die Suche im lokalen Netzwerk gefunden und nach seinen Einstellungen gefragt hat. **RustDesk-Client** steht für einen RustDesk-Client, der sich beim Server registriert hat, während eine Genehmigung nötig war.

Jede Zeile hat außerdem ein Menü mit **ID kopieren**. Bei einer entschiedenen Anfrage aus **Lokales Netzwerk** enthält es auch **Eintrag löschen**. Das entfernt die Anfrage aus der Liste und ändert am Gerät nichts; dafür brauchst du die Berechtigung, die Registrierung zu verwalten, dieselbe, die **Gerätetokens** braucht.

## Ein Gerät genehmigen {#approving-a-device}

Klicke bei einer wartenden Anfrage auf **Genehmigen**. Ein Seitenbereich öffnet sich mit den Details der Anfrage und einem kurzen Formular:

- **Gerätename**: vorbelegt mit dem Namen, den das Gerät gesendet hat. Er erscheint in der Geräteliste.
- **Ordner**: wohin das Gerät kommt, oder **Kein Ordner**.
- **Tags**: Hake Tags an, die andere Geräte nutzen, oder tippe einen neuen ein und klicke auf **Hinzufügen**. Ist **Tags aus vorhandenen Geräte-Tags auswählen** unter **Einstellungen**, **Anmeldung** ausgeschaltet, ist das ein einzelnes Textfeld mit den Tags, durch Kommas getrennt.
- **Gerätegruppen**: Hake die Gruppen an, in denen das Gerät sein soll. Eine Gruppe legt fest, wer das Gerät sehen kann und welche Zugriffsregeln für es gelten. Hier stehen nur Gruppen, die du von Hand füllst; dynamische Gruppen folgen den Tags des Geräts.
- **Statusmeldungen**: wie oft das Gerät Auslastung, Laufwerke und installierte Software meldet: **Standard**, **Sparsam** oder **Häufig**. Bei Anfragen aus **Lokales Netzwerk** fehlt dieses Feld, und es spielt nur bei Clients eine Rolle, die diese Meldungen senden.

Klicke unten im Seitenbereich auf **Genehmigen**. Das Gerät bekommt die Servereinstellungen, wenn es sich das nächste Mal beim Server meldet. Name, Ordner, Tags und Gruppen kannst du später im [Seitenbereich des Geräts](/docs/console/device-details#editing-a-device) ändern.

Eine genehmigte Anfrage zeigt **Gerät öffnen**. Das öffnet den Seitenbereich des Geräts auf derselben Seite.

## Ein Gerät ablehnen {#rejecting-a-device}

Klicke in der Zeile oder im Seitenbereich auf **Ablehnen**. Was der Dialog bietet, hängt davon ab, woher die Anfrage kam:

- Bei einem RustDesk-Client oder einem Mesh-Agenten kann sich das Gerät nicht mit diesem Server verbinden, solange die Ablehnung gilt. Hake **Dieses Gerät sperren** an, um es zusätzlich zu sperren, damit es nicht noch einmal anfragen kann. Ein gesperrtes Gerät erscheint dann unter dem Filter **Gesperrt** in [der Geräteliste](/docs/console/devices#banned-devices).
- Bei einer Anfrage aus **Lokales Netzwerk** kannst du einen Grund angeben, den das Gerät erhält. Das Gerät bekommt die Einstellungen dieses Servers nicht, und der Eintrag bleibt in der Liste.

Ein abgelehnter RustDesk-Client oder Mesh-Agent kommt nicht wieder in die Warteschlange, wenn er erneut anfragt. Um ihm noch eine Chance zu geben, öffne den Filter **Abgelehnt** und klicke in seiner Zeile auf **Wieder zulassen**: Das Gerät kann wieder um Aufnahme bitten, und wurde es beim Ablehnen gesperrt, wird die Sperre aufgehoben.

## Was ein wartendes Gerät kann {#what-a-waiting-device-can-do}

Im Modus **Verwaltet** kann niemand ein Gerät erreichen, das auf eine Genehmigung wartet, und das Gerät kann selbst keine Verbindung zu einem anderen Gerät aufbauen. Für das Gerät ändert sich nichts, bis du es genehmigst oder ablehnst.

- Neue, unbekannte RustDesk-Clients werden ohne Anfrage abgewiesen, solange 1000 Geräte warten. Neue Mesh-Agenten kommen nicht in die Liste, solange 500 warten.
- Eine Anfrage aus **Lokales Netzwerk**, über die niemand entscheidet, wird nach 30 Tagen gelöscht. Das Gerät erscheint wieder, wenn es erneut anfragt.

## Wer genehmigen darf {#who-can-approve}

Genehmigen und Ablehnen braucht die Berechtigung, Geräte zu genehmigen. Standardmäßig haben sie Konten mit den Rollen Super-Admin und Globaler Administrator; Konten mit den Rollen Remote-Operator, Betrachter und Serveradministrator haben sie nicht. Konten ohne diese Berechtigung sehen **Registrierungsanfragen** nicht in der Seitenleiste. Ein Administrator kann die Standardwerte ändern, siehe [Benutzer und Rollen](/docs/people/users-and-roles).
