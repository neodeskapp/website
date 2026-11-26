---
title: Erklärung zur Barrierefreiheit
description: Wie barrierefrei NeoDesk heute ist, wie wir getestet haben, was noch nicht geht und wie du ein Problem meldest.
order: 3
---

NeoDesk soll für alle nutzbar sein: mit Screenreader, allein mit der
Tastatur, mit Bildschirmlupe, in einem Kontrastdesign, per Sprache oder mit
einem Schalter. Diese Erklärung sagt, wie weit wir sind. Sie gilt für die
Webkonsole von NeoDesk {{VERSION}}, den Desktop-Client 1.5, diese Website
mit ihrer Dokumentation und die Mails, die der Server verschickt.

## Standard und Stand

Wir messen an den Web Content Accessibility Guidelines (WCAG) 2.2, Stufe
AA. Das deckt auch die europäische Norm EN 301 549 und die BITV 2.0 ab.

- **Webkonsole:** teilweise erfüllt. Was noch fehlt, steht unten.
- **Desktop-Client:** noch nicht erfüllt. Unter Windows bekommen
  Screenreader nichts von ihm. Das beheben wir zuerst.
- **Website und Dokumentation:** teilweise erfüllt. Ein Farbpaar liegt
  unter der Grenze.
- **Mails:** erfüllt, soweit wir ohne echte Mailprogramme testen konnten.

## Wie wir getestet haben

Letzte Prüfung: 26. November 2026.

- **Automatisch:** axe-core 4.14 auf jeder Seite der Konsole, angemeldet
  und abgemeldet, hell und dunkel, 320 und 1280 Pixel breit; auf jeder
  Vorlage der Website bei 320, 768 und 1280 Pixeln; auf allen 24 Mails hell
  und dunkel. Diese Prüfungen laufen bei jeder Änderung am Code und halten
  sie auf, wenn sie ein Problem finden.
- **Kontrast:** jedes Farbpaar der Konsole, in jedem eingebauten Design und
  Kontrastmodus, aus den Design-Tokens berechnet.
- **Tastatur:** die wichtigsten Aufgaben der Konsole, allein mit der
  Tastatur in automatischen Tests: einen Computer finden und seine Details
  lesen, einen Computer mit einer Einladung hinzufügen, eine Hilfeanfrage
  annehmen, eine Chatnachricht senden, eine Einstellung ändern und erfahren,
  dass sie gespeichert ist, einen Benutzer anlegen, einen Anmeldefehler
  lesen und darauf reagieren, sich mit einem eingefügten Zwei-Faktor-Code
  anmelden.
- **Von Hand:** Konsole, Website und Mails gegen jedes Erfolgskriterium von
  WCAG 2.2 A und AA, mit 200 % Zoom, einem 320 Pixel schmalen Fenster,
  weiterem Textabstand, erzwungenen Farben wie in den Kontrastdesigns von
  Windows und reduzierter Bewegung.
- **Desktop-Client:** die Barrierefreiheitsprüfungen von Flutter
  (Zielgrößen, Beschriftungen, Textkontrast) auf den Ansichten, die sich
  ohne Server testen lassen, und eine Durchsicht des Codes.
- **Screenreader: noch nicht.** Mit NVDA, JAWS, der Sprachausgabe von
  Windows, VoiceOver, TalkBack und Orca haben wir noch nicht getestet. Diese
  Tests sind in unserem Labor geplant. VoiceOver unter iOS und TalkBack
  können wir noch gar nicht testen. Bis diese Tests gemacht sind, beschreibt
  alles oben über Screenreader, was der Code ihnen geben sollte, nicht, was
  wir gehört haben.

## Was noch nicht geht

| Was | Wen es betrifft | Geplant |
|---|---|---|
| Der Desktop-Client gibt Screenreadern unter Windows gar keine Informationen. | Screenreader-Nutzende | Februar 2027 |
| Im Desktop-Client 1.5 lassen sich mehrere Bedienelemente (Titelleiste, Tabs, Einstellungsseiten, Dateilisten, die Verbindungsanfrage) nicht mit der Tastatur erreichen, und eine Sitzung hält die Tastatur fest. | Wer mit Tastatur oder Schalter bedient | Behoben für die nächste Version des Clients, sobald in unserem Labor geprüft |
| Der Desktop-Client 1.5 folgt nicht der Textgröße des Systems und nicht der Einstellung für hohen Kontrast. | Menschen mit Sehbehinderung | Behoben für die nächste Version des Clients, sobald in unserem Labor geprüft |
| Auf der Website zeigen Codebeispiele Schlüsselwörter und den Kopierknopf in einem Blau, das im hellen Modus 4.27:1 statt 4.5:1 erreicht. | Menschen mit Sehbehinderung | Offen |
| Die Mails wurden im Browser geprüft, nicht in echten Mailprogrammen wie Outlook und Gmail und nicht in deren dunklem Modus. | Wer Mails mit Screenreader oder im dunklen Modus liest | Januar 2027 |

Das Bild eines entfernten Computers ist ein Bild. Seinen Inhalt kann
NeoDesk nicht vorlesen. Alles drumherum schon: die Bedienelemente, der
Verbindungsstand, wer verbunden ist, Aufzeichnung und Privatsphäre, Chat,
Dateiübertragung und die Zwischenablage. Wer mit Screenreader den Inhalt
des entfernten Bildschirms braucht, kann auf dem entfernten Computer einen
Screenreader starten und den Ton der Sitzung einschalten. Der entfernte
Bildschirm hält die Tastatur nie fest. Im Browser gibt F8 oder
Strg+Alt+Umschalt+G sie zurück, im Desktop-Client Strg+Alt+Umschalt+G
(Befehl+Wahl+Umschalt+G auf dem Mac).

## Ein Problem melden

Schreib an [support@neode.sk](mailto:support@neode.sk). Sag uns bitte:

- wo es passiert ist: die Seite oder das Fenster, und was du tun wolltest
- was schiefging: was du erwartet hast und was passiert ist
- womit du arbeitest: deine Hilfstechnik und ihre Version (zum Beispiel
  NVDA 2025.3), der Browser oder der NeoDesk-Client und seine Version, und
  das Betriebssystem
