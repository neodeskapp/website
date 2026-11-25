---
title: Design
description: Wie die Oberflächen von NeoDesk aussehen und klingen: Design-Tokens, Komponenten, Icons, Layout und Dialoge, und die Wörter.
order: 15
---

Diese Seiten sind für alle, die an der Web-Konsole oder am Desktop-Client
arbeiten. Sie beschreiben das Design-System der Konsole so, wie es im Code
steht: in `web-ui/src/lib/styles/tokens.css` und den Komponenten in
`web-ui/src/lib/ui/`. Das Logo, seine Farben und der Ton stehen auf der Seite
[Logo und Marke](/de/brand/).

- [Design-Tokens](/docs/development/design/tokens): Farben, Schrift, Abstände,
  Formen, Bewegung und die Größen der Bedienelemente.
- [Komponenten](/docs/development/design/components): die Bausteine jeder Seite
  und welcher wofür da ist.
- [Icons](/docs/development/design/icons): Material Symbols Outlined, ein Icon
  pro Bedeutung.
- [Layout und Dialoge](/docs/development/design/layout): der Rahmen der Seite,
  Abstände, und wann ein Dialog oder ein Sheet passt.
- [Texte in der Oberfläche](/docs/development/design/writing): die Regeln für
  Beschriftungen und Meldungen, und welche Wörter gelten.

## Regeln für jede Ansicht {#rules-for-every-screen}

- Satzanfang groß, sonst wie im Satz, überall. Keine Beschriftungen in
  Großbuchstaben mit Sperrung.
- Keine Pillen, Badges oder Chips, und keine Karten in Karten. Schlichter Text
  auf dem Hintergrund, Linien zwischen Zeilen.
- Keine Verläufe, keine Unschärfe, kein Leuchten und keine Schatten zur Zierde.
  Nur was schwebt, etwa Menüs und Dialoge, wirft einen Schatten.
- Ecken von 2 bis 4 px, auch bei Schaltflächen.
- Eine Hauptaktion pro Ansicht. Alles andere ist eine schlichte Schaltfläche
  oder ein Link.
- Festbreitenschrift nur für das, was man kopiert: Befehle, IDs, Adressen.
- Eine Spalte, eine linke Kante.
- Keine nachgebaute Oberfläche und keine Füllbilder. Zeig die Konsole mit
  einem echten Screenshot.
