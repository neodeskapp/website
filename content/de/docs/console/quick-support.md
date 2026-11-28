---
title: Schnellhilfe
description: Jemandem an einem nicht eingerichteten Computer helfen, mit einem Link, der einmal für eine Stunde gilt und keine Installation braucht.
order: 6
---

Mit der Schnellhilfe hilfst du einer Person, deren Computer nicht auf deinem
Server ist. Du schickst ihr einen Link; sie lädt eine kleine Hilfe-App herunter,
öffnet sie und klickt auf **Erlauben**. Du verbindest dich ohne ID und ohne
Passwort, und die Sitzung endet, wenn die Person die App schließt. Installiert
wird nichts.

Du brauchst die Berechtigung **Mit Geräten verbinden**.

## Einen Sitzungslink erstellen {#make-a-session-link}

Klicke in der oberen Leiste oder auf der Seite **Hilfeanfragen** auf
**Schnellhilfe**.

![Die obere Leiste mit markierter Schaltfläche Schnellhilfe](shot:quick-support-start)

Die Konsole erstellt den Link sofort. Er gilt einmal, für eine Stunde.

![Der Dialog Schnellhilfe mit Sitzungslink und QR-Code, der auf die Person wartet](shot:quick-support)

Der Link steht oben: Schick ihn mit **Kopieren** oder mit
**Per E-Mail senden**, wenn E-Mail unter **Einstellungen**, **E-Mail**
eingerichtet ist. Der QR-Code mit seiner Beschriftung steht daneben, für ein
Handy. Wie bei Einladungen nutzt der Link die öffentliche Adresse
der Konsole und warnt, wenn sie reines HTTP ist; siehe
[Computer hinzufügen](/docs/console/add-a-computer#send-the-link).

## Die Sitzung verfolgen {#follow-the-session}

Der Dialog zeigt den aktuellen Stand:

- Er wartet darauf, dass die Person den Link öffnet, und zeigt, wann der Link
  abläuft.
- Die App ist auf ihrem Computer geöffnet und wartet darauf, dass sie auf
  **Erlauben** klickt.
- Der Computer hat den Zugriff erlaubt. **Verbinden** öffnet die Sitzung
  [im Browser](/docs/console/remote-in-browser); **In der Desktop-App öffnen**
  bietet NeoDesk und RustDesk an und öffnet sie in dem, das du wählst (siehe
  [Links, die die App öffnen](/docs/getting-started/connect-a-client#links-that-open-the-app)).
  Du brauchst kein Passwort: Die App übergibt es für dich an den Server.
- Die Person hat abgelehnt, die Sitzung ist beendet oder der Link ist
  abgelaufen. **Neuen Link erstellen** fängt von vorn an.

**Link zurückziehen**, neben der Zeile, die sagt, dass der Link wartet,
beendet einen unbenutzten Link. **Sitzung beenden**
beendet eine laufende Sitzung. Du kannst den Dialog jederzeit schließen: Die
Sitzung bleibt offen, und **Deine Schnellhilfe-Sitzungen** auf der Seite
**Hilfeanfragen** listet sie mit **Öffnen** auf, damit du zu ihr zurückkommst.

## Was eine Sitzung dir gibt {#what-a-session-gives-you}

Eine Schnellhilfe-Sitzung gibt dir den Bildschirm, die Maus und die Tastatur der
Person. Genau darum bittet die App sie. Der Server schaltet jede andere
Berechtigung der Sitzung aus, darunter die Zwischenablage, die Dateiübertragung
und das Drucken, den Ton, die Kamera, das Terminal, Tunnel, den Neustart des
Computers, die Aufzeichnung, das Sperren ihrer Eingabe und den
Privatsphäre-Modus. Eine Sitzung für Dateiübertragung, Tunnel, RDP, Terminal
oder Kamera zu ihrem Computer lehnt er mit „The person did not allow this in
their quick support session“ ab.

Text kopieren und Dateien kopieren sind eigene Berechtigungen. Die Person kann
jede davon für sich erlauben, und der Server schaltet dann für diese Sitzung die
Zwischenablage oder die Dateiübertragung samt Drucken ein. Die Hilfe-App des
aktuellen Client-Releases fragt nur nach Bildschirm, Maus und Tastatur, beides
bleibt also aus. Die Auswahl dafür kommt mit dem nächsten Client-Release.

## Was die Person sieht {#what-the-person-sees}

Der Link öffnet eine Seite, die sagt, wer helfen will, und
**NeoDesk Schnellhilfe herunterladen** für das System der Person anbietet, mit
den Schritten: die Datei öffnen, prüfen, dass dort dein Name steht, und auf
**Erlauben** klicken. Ist die Person fertig, klickt sie oben auf ihrem
Bildschirm auf **Beenden** oder schließt die App. Die App stammt aus denselben
signierten Client-Releases wie bei
[Computer hinzufügen](/docs/console/add-a-computer#what-the-person-sees).

Nach der Sitzung kann die App unter Windows anbieten, als Empfänger-App auf
dem Computer zu bleiben, die dann deinem Server beitritt. Siehe
[Das Angebot nach der Schnellhilfe](/docs/console/receiver-app#the-offer-after-quick-support).
