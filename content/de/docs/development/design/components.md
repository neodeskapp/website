---
title: Komponenten
description: Die Bausteine der Konsole in web-ui/src/lib/ui und welcher für Schaltflächen, Formulare, Listen, Zustände, Meldungen und Panels passt.
order: 2
---

Seiten bestehen aus den Komponenten in `web-ui/src/lib/ui/`. Jede Datei
beginnt mit einem Kommentar, der sagt, wofür sie da ist; diese Seite fasst sie
zusammen. Nimm die Komponente statt eigenem Markup, damit eine Seite aussieht
und sich verhält wie die anderen.

## Schaltflächen und Menüs {#buttons-and-menus}

| Komponente | Wofür |
|---|---|
| `Button` | Jede Schaltfläche. Eine Hauptschaltfläche pro Ansicht; sonst secondary (umrandet) als Standard; ghost; danger für die Antwort eines Dialogs; danger-quiet für eine zerstörende Aktion auf der Seite; link für eine Aktion im Fließtext. Zwei Größen, normal und klein. |
| `IconButton` | Ein Icon ohne Beschriftung, nur für Schließen, das Zeilenmenü, Kopieren und den Pfeil zum Aufklappen. Seine Beschriftung wird der Name für Screenreader. |
| `MenuButton`, `Menu`, `MenuItem`, `MenuDivider` | Ein kleines Menü hinter einer Schaltfläche mit Pfeil, oder das Zeilenmenü. Pfeiltasten bewegen, Pos1 und Ende springen, ein Buchstabe springt zum nächsten Eintrag damit. |
| `SegmentedFilter` | Filter für die Ansicht: Zustandsfilter über einer Liste, Liste oder Raster, Zeiträume. |
| `Tabs` | Teile einer Sache, etwa eines Detailbereichs oder einer Einstellungsseite. |

## Formulare {#forms}

| Komponente | Wofür |
|---|---|
| `Field` | Ein beschriftetes Feld: die Beschriftung darüber, das Element, ein Hinweis darunter, der Fehler, dann was nach einer Änderung passiert („Gilt sofort“, „Nach einem Neustart“). |
| `Input`, `Textarea`, `Select` | Text und Auswahl in einem `Field`. Eingabefelder gibt es in Breiten: kurz für Ports und Zahlen, mittel für Namen, host für Adressen. |
| `Checkbox`, `Switch`, `Radio`, `ChoiceList` | An und aus, und eins von wenigen. Ein Schalter ist ein Kontrollkästchen mit derselben Tastatur: Leertaste schaltet. Die ganze Beschriftung ist die Klickfläche. |
| `FormSection` | Eine benannte Gruppe von Feldern in einem Sheet oder Dialog. |
| `SaveBar` | Das Ende eines Formulars: seine Statuszeile und die eine Schaltfläche zum Speichern. |
| `SearchField` | Ein Suchfeld mit Icon vorn; seine Beschriftung ist Pflicht. |

## Listen und Daten {#lists-and-data}

| Komponente | Wofür |
|---|---|
| `Table` | Datentabellen, nach Spalten sortierbar. |
| `RowList`, `ListRow` | Dinge, die man öffnet oder bearbeitet, als Zeilen auf Linien in der Höhe von Tabellenzeilen. Eine Zeile, die irgendwohin führt, ist eine Klickfläche. |
| `Facts` | Paare aus Bezeichnung und Wert, auf schmalen Bildschirmen in einer Spalte. |
| `Toolbar` | Die Zeile über einer Liste: zuerst die Suche, dann Filter und Bedienelemente, dann Aktionen. |
| `Pagination` | Seitenwechsel unter einer Liste. |
| `Split` | Eine Liste mit dem geöffneten Eintrag daneben; unter 768 px eins von beiden. |
| `ValueCopy`, `CodeBlock` | Ein Wert zum Kopieren (ID, Adresse, Schlüssel), in Festbreitenschrift mit Schaltfläche zum Kopieren; und ein Textblock zum Kopieren, etwa ein Skript. |
| `Empty` | Kein Wert: ein gedämpfter Strich, oder ein Wort wie „Nie“. Nie in Festbreitenschrift. |

## Zustände und Personen {#status-and-people}

| Komponente | Wofür |
|---|---|
| `Status` | Ein Zeichen und ein Wort für einen Zustand. Jeder Ton hat seine eigene Form, Farbe ist also nie der einzige Hinweis. |
| `Presence` | Der Status einer Person: online, abwesend, beschäftigt, offline. |
| `Tag`, `TagSet` | Ein Wert aus einer Menge, oder Tags, die Leute setzen: ein ruhiges Zeichen, ein Hauch der Textfarbe, 3 px Ecken, nie eine Pille, nie je Wert eingefärbt. |
| `Avatar` | Ein Profilbild oder Initialen in einem festen Kasten mit 4 px Ecken, nie rund. |
| `Meter` | Der Anteil an einer Grenze, immer mit der Zahl als Text. |

## Meldungen und Panels {#messages-and-panels}

| Komponente | Wofür |
|---|---|
| `Notice` | Eine Meldung, die auf einer Seite oder in einem Sheet auffallen muss: eine Linie am Anfang in der Farbe ihres Tons, kein Kasten. |
| `Toast` | Eine kurze Meldung nach einer Aktion, angezeigt von `ToastHost`. |
| `Dialog` | Bestätigungen, eine Frage, eine Abfrage mit einem bis drei Feldern, alles, was blockieren muss. |
| `Sheet` | Ein Seitenpanel, um etwas mit mehr als ein paar Feldern anzulegen oder zu bearbeiten, und für die Details eines Eintrags. |
| `Disclosure` | Ein Abschnitt, der zugeklappt beginnt. |
| `DangerZone` | Gefährliche Aktionen gesammelt am Ende einer Seite, jede mit ihrer Folge in einem Satz. |
| `Steps` | Eine echte Abfolge, nummeriert. |
