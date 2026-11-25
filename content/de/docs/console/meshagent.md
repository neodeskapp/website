---
title: MeshAgent-Geräte
description: Computer mit dem Agenten von MeshCentral an den Server anbinden, genehmigen und ihr Terminal, ihre Dateien, Port-Relays und Energiebefehle nutzen.
order: 12
---

NeoDesk spricht das Protokoll von MeshAgent, dem Agenten von MeshCentral. Ein Computer mit dem unveränderten MeshAgent verbindet sich mit dem Server und erscheint in [der Geräteliste](/docs/console/devices) als Mesh-Agent, neben den RustDesk-Clients. Du öffnest seinen Bildschirm im [Web-Viewer](/docs/console/remote-in-browser) und bekommst ein Terminal, einen Dateibrowser, Port-Relays und Energiebefehle. Der Filter **Mesh-Agenten** in der Geräteliste zeigt nur diese Geräte.

## Die MeshCentral-Schicht {#the-meshcentral-layer}

Die Schicht ist eingeschaltet, außer der Server startet mit `MESH_ENABLED=N`, siehe [Konfiguration](/docs/operations/configuration). Ihre Einstellungen liegen unter **Einstellungen**, **Allgemein**, im Abschnitt **MeshCentral-Kompatibilität**, für Konten, die Servereinstellungen ändern dürfen. Der Abschnitt zeigt:

| Zeile | Was sie zeigt |
|---|---|
| **MeshCentral-Schicht** | **Aktiviert**, solange die Schicht läuft |
| **Jetzt verbundene Agenten** | Wie viele Agenten online sind |
| **Server-ID** | Die ID des Agenten-Zertifikats, die jede .msh-Datei nennt |
| **Agenten-Zertifikat** | Ob die Datei `mesh_agent_server.pem` existiert und seit wann |

Agenten verbinden sich über HTTPS mit der eigenen Adresse der Konsole, unter `/agent.ashx`. Die Konsole reicht `/agent.ashx`, `/meshrelay.ashx` und `/control.ashx` an die Schicht weiter, die im selben Programm läuft. Die Konsole muss deshalb unter der Adresse, die die Agenten nutzen, über HTTPS erreichbar sein: entweder hinter einem [Reverse Proxy mit TLS](/docs/operations/reverse-proxy-tls), der WebSocket-Upgrades durchreicht, oder mit dem [eigenen HTTPS der Konsole](/docs/operations/reverse-proxy-tls#https-without-a-proxy).

## Den Agenten auf einem Gerät installieren {#install-the-agent-on-a-device}

1. Öffne in **MeshCentral-Kompatibilität** den Punkt **MeshAgent auf einem Gerät installieren**.
2. Gib unter **Name in der .msh-Datei** den Namen ein, den MeshAgent für den Server anzeigt, und klicke auf **MeshAgent .msh herunterladen**. Diese Datei gilt für die Gruppe mit der ID `default`. Für eine andere Gruppe nimm **.msh-Datei herunterladen** in der Zeile dieser Gruppe unter **Mesh-Gruppen**.
3. Öffne die Datei, `meshagents.msh`, in einem Texteditor und prüfe die Zeile `MeshServer=`. Sie nennt die öffentliche Adresse der Konsole (`PANEL_PUBLIC_URL` oder `PANEL_PUBLIC_HOST`) oder, wenn keine von beiden gesetzt ist, die Adresse, unter der du die Konsole geöffnet hast. Die Zeile muss aus `wss://`, der Adresse, unter der die Agenten die Konsole über HTTPS erreichen (mit dem Port, wenn er nicht 443 ist), und `/agent.ashx` bestehen, zum Beispiel `MeshServer=wss://desk.example.com/agent.ashx`. Korrigiere die Zeile, wenn sie eine andere Adresse zeigt, etwa `127.0.0.1`.
4. Installiere den unveränderten MeshAgent zusammen mit der .msh-Datei auf dem Gerät.
5. Der Agent bittet um Aufnahme und wartet unter [Registrierungsanfragen](/docs/console/enrollment), wo in **Eingegangen über** der Eintrag **Mesh-Agent** steht. Genehmige ihn. Der Agent kommt bei seiner nächsten Verbindung herein und erscheint als online.

Jeder neue Agent wartet auf eine Genehmigung, unabhängig vom Registrierungsmodus. Solange 500 Anfragen warten, nimmt der Server keine neuen von Agenten an. Ein abgelehnter, gesperrter oder gelöschter Agent wird abgewiesen, ebenso ein Agent, dessen .msh-Datei zu keiner Gruppe gehört; das Log zeigt dann `[mesh] agent from <address> refused: unknown mesh id`.

## Mesh-Gruppen {#mesh-groups}

**Mesh-Gruppen** listet die Gruppen mit **Name**, **Gruppen-ID** und **MeshID**. Jede Gruppe hat ihre eigene .msh-Datei, und ein Gerät, das mit der Datei einer Gruppe installiert wird, tritt dieser Gruppe bei. **Gruppe hinzufügen** fragt nach einer Gruppen-ID, also einem kurzen Namen ohne Leerzeichen, der sich später nicht ändern lässt, und nach einem Anzeigenamen. Das Zeilenmenü enthält **.msh-Datei herunterladen**, **Umbenennen** und **Entfernen**.

::: warning
Der Server lässt einen Agenten nur herein, solange die Gruppe seiner .msh-Datei existiert. Entfernst du eine Gruppe, sperrst du damit auch die Agenten aus, die mit der Datei dieser Gruppe installiert wurden, und zwar bei ihrer nächsten Verbindung.
:::

## Zertifikate {#certificates}

Am Agenten-Zertifikat, `mesh_agent_server.pem` (`MESH_AGENT_CERT_FILE` nennt eine andere Datei), erkennen die Agenten den Server: Seine ID steht in der Zeile `ServerID=` jeder .msh-Datei. Nimm es in deine [Backups](/docs/operations/backup) auf.

MeshAgent meldet außerdem das TLS-Zertifikat, das er unter der Adresse aus `MeshServer` gesehen hat. Hat der Server ein Zertifikat für diesen Vergleich, lehnt er einen Agenten ab, der ein anderes gesehen hat, und das Log zeigt `[mesh] agent web cert hash mismatch from <address>`. Der Server nimmt das Zertifikat aus `MESH_WEB_CERT_FILE`, sonst sein eigenes TLS-Zertifikat (`TLS_CERT` oder `-tls-cert` der Installer). Fehlt beides, vergleicht er nicht.

Hinter einem Reverse Proxy sehen die Agenten das Zertifikat des Proxys. Setze `MESH_WEB_CERT_FILE` auf diese Zertifikatsdatei, zum Beispiel die `fullchain.pem`, die certbot erzeugt hat, damit der Server mit dem richtigen Zertifikat vergleicht. Der Server liest die Datei beim Start, starte ihn deshalb neu, nachdem das Zertifikat erneuert wurde.

## Ein MeshAgent-Gerät nutzen {#using-a-meshagent-device}

Solange der Agent online ist, bieten das Zeilenmenü und der Tab **Aktionen** im [Seitenbereich des Geräts](/docs/console/device-details) diese Werkzeuge, jeweils für Konten mit der passenden Berechtigung:

| Werkzeug | Was es tut |
|---|---|
| **Web-Remote** | Öffnet den Bildschirm des Geräts im Web-Viewer |
| **Terminal** | Eine Shell auf dem Gerät in einem Seitenbereich. Escape geht an die Shell, Shift+Escape schließt das Terminal, und das Schließen beendet die Verbindung |
| **Dateibrowser** | Öffnet die Dateien des Geräts in der Dateiübertragung des Web-Viewers, in einem neuen Tab |
| **Befehl ausführen** | Schickt einen Befehl an den Agenten, mit **In Shell ausführen**, um ihn in einer Shell laufen zu lassen. Die Konsole meldet, wann der Agent ihn angenommen hat; die Ausgabe zeigt sie nicht |
| **Link to RustDesk/CDAP peer on same host** | Verknüpft den Agenten mit dem RustDesk- oder CDAP-Gerät auf demselben Computer, über dessen ID. Lass die ID leer, um die Verknüpfung zu lösen |
| **Gast-Desktop-Link** | Ein Link nur zum Ansehen des Bildschirms, für jemanden ohne Konto in der Konsole, gültig für 15 bis 1440 Minuten, standardmäßig 120 |
| **TCP-Port-Relay**, **UDP port relay** | Öffnet vom Agenten aus eine Verbindung zu einem Host und Port aus Sicht des Geräts (`127.0.0.1` ist das Gerät selbst), zeigt, was zurückkommt, und sendet Text, den du eintippst. Das Schließen des Bereichs beendet die Verbindung |
| **Wake**, **Schlafen**, **Neustart**, **Power off** | Energiebefehle, jeweils nach einer Bestätigung |

Ist der Agent offline, bleibt nur **Wake**. Der Server sendet dann ein Wake-on-LAN-Paket als Broadcast in sein eigenes Netzwerk, an den Netzwerkadapter, den der Agent früher gemeldet hat, oder, falls es keinen gibt, an den des verknüpften Geräts. Das Paket erreicht das Gerät nur, wenn Server und Gerät im selben lokalen Netzwerk sind.

Im Web-Viewer schaltet **Aufnehmen** in einer MeshAgent-Sitzung die Aufzeichnung auf dem Server ein oder aus, und die Sitzung verbindet sich neu. Die Aufnahmen stehen unter **Aufgezeichnete Sitzungen** in **MeshCentral-Kompatibilität**, mit **Herunterladen** für Konten, die sich mit Geräten verbinden dürfen. Der Server legt sie als `.mcrec`-Dateien in einem Ordner `mesh-recordings` neben seiner Datenbankdatei ab.

Welche Rolle das Terminal, die Dateien und die Energiebefehle bekommt, steht in [Was jede Rolle darf](/docs/people/users-and-roles#what-each-role-can-do).
