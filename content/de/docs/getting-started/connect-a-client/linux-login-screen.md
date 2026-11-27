---
title: Linux-Anmeldebildschirm
description: Erreiche einen Linux-Computer, bevor sich jemand angemeldet hat, unter Wayland oder X11, und was beim Anmelden, Sperren und Abmelden passiert.
order: 2
---

Mit dem installierten NeoDesk-Paket erreichst du einen Linux-Computer, sobald
er hochgefahren ist: Der Anmeldebildschirm erscheint, und du kannst für die
Person, der du hilfst, das Passwort eingeben. Das geht mit
Anmeldebildschirmen unter X11 und seit Client-Version 1.5.0 auch unter
Wayland, das bei Ubuntu, Fedora und vielen anderen Distributionen
voreingestellt ist.

Du brauchst das installierte Paket, die `.deb`- oder `.rpm`-Datei von der
[Download-Seite](/de/download/). Das portable `.tar.gz` hat keinen
Hintergrunddienst und kann den Anmeldebildschirm deshalb nicht zeigen; das
sagt auch sein Startbildschirm.

## So funktioniert es {#how-it-works}

Unter X11 liest der NeoDesk-Dienst den Anmeldebildschirm wie bisher vom
X-Server. Unter Wayland gibt es keinen X-Server, und die Bildschirmfreigabe
des Desktops braucht jemanden am Computer, der zustimmt, und das kann vor der
Anmeldung niemand. Deshalb liest der NeoDesk-Dienst an einem
Wayland-Anmeldebildschirm das Bild direkt vom Grafiktreiber (DRM/KMS) und
tippt über eine virtuelle Tastatur und Maus.

Das passiert nur am Anmeldebildschirm. Sobald sich jemand angemeldet hat,
nutzt NeoDesk wie bisher die Bildschirmfreigabe des Desktops, mit ihrer
Abfrage am Computer. Passwort, Annehmen per Klick und die Berechtigungen des
Servers gelten am Anmeldebildschirm genauso wie in einer Sitzung.

## Was Schritt für Schritt passiert {#step-by-step}

Getestet unter GNOME (Ubuntu 24.04 und Fedora 45) für Wayland und unter GNOME
mit einem X11-Anmeldebildschirm. Unter KDE wurden der Anmeldebildschirm und
das Anmelden getestet.

| Schritt | Wayland-Anmeldebildschirm | X11-Anmeldebildschirm |
|---------|---------------------------|-----------------------|
| Verbinden, bevor sich jemand angemeldet hat | Der Anmeldebildschirm erscheint; Maus und Tastatur funktionieren, auch mit zwei Monitoren nebeneinander und mit skalierter Anzeige (200 %) | Der Anmeldebildschirm erscheint; Maus und Tastatur funktionieren |
| Der Bildschirm war aus | Er geht beim Verbinden an | Nicht getestet |
| Passwort eingeben und anmelden | Die Verbindung bleibt offen. Danach fragt der Computer nach der Bildschirmfreigabe: unter GNOME **Remote Desktop** mit **Share**, unter KDE **Remote Control Requested** mit **Allow**. Jemand am Computer muss zustimmen; bis dahin siehst du „Please select the screen to be shared“. Unter GNOME schalte auch **Allow Remote Interaction** ein, sonst bewirken deine Maus und Tastatur nichts | Der Desktop erscheint sofort |
| Bildschirm sperren | Das Bild bleibt auf dem letzten Stand stehen und kommt nach dem Entsperren nicht wieder. Schließ den Tab und verbinde dich neu; der Computer fragt dann wieder nach der Bildschirmfreigabe | Der Sperrbildschirm erscheint |
| Abmelden | Du bist ohne weiteres Zutun wieder am Anmeldebildschirm | Du bist nach einem Moment wieder am Anmeldebildschirm |
| Computer neu starten | **Restart remote device** in der Symbolleiste funktioniert an einem Wayland-Anmeldebildschirm nicht; starte aus einer Sitzung heraus neu. Nach dem Neustart verbindet sich NeoDesk von selbst wieder mit dem Anmeldebildschirm | Nicht getestet |
| Jemand meldet sich am Computer an, während du mit dem Anmeldebildschirm verbunden bist | Die Übertragung des Anmeldebildschirms endet; die neue Sitzung fragt wie jede andere nach der Bildschirmfreigabe | Nicht getestet |

Wenn nach der Anmeldung niemand am Computer sein kann, nutze für den ganzen
Besuch einen X11-Anmeldebildschirm und eine X11-Sitzung, siehe
[X11 stattdessen](#x11-fallback).

## Getestete Systeme {#tested}

Getestet mit NeoDesk-Client 1.5.0 auf virtuellen Maschinen mit virtueller
Grafikkarte (virtio-gpu, ohne 3D-Beschleunigung). Echte Grafikkarten sind
noch nicht getestet.

| Distribution | Desktop | Anmeldebildschirm | Anmeldebildschirm erreichbar |
|--------------|---------|-------------------|------------------------------|
| Ubuntu 24.04 | GNOME 46 | GDM 46 unter Wayland | Ja |
| Fedora 45 | GNOME 51 | GDM 51 unter Wayland | Ja |
| Fedora 45 | KDE Plasma 6.8 | SDDM 0.21 unter Wayland | Ja |
| Ubuntu 24.04 | GNOME 46 | GDM 46 unter X11 | Ja |

Die Pakete lassen sich auch unter Debian 12, openSUSE Leap 15.6 und openSUSE
Tumbleweed installieren und starten; deren Anmeldebildschirme sind nicht
getestet.

## Bekannte Grenzen {#limits}

- Auf einem Computer ohne 3D-Grafik, etwa einer virtuellen Maschine ohne
  3D-Beschleunigung, wird das Bild des Anmeldebildschirms in Software
  umgewandelt: Solange du mit dem Anmeldebildschirm verbunden bist, sind ein
  bis zwei CPU-Kerne ausgelastet. In einer Sitzung passiert das nicht.
- **Restart remote device** funktioniert an einem Wayland-Anmeldebildschirm
  nicht.
- Nach dem Sperren einer Wayland-Sitzung bleibt das Bild stehen, siehe oben.

## X11 stattdessen {#x11-fallback}

Ein X11-Anmeldebildschirm und eine X11-Sitzung geben Zugriff ohne Abfrage
nach der Anmeldung. Bei GDM trägst du das im Abschnitt `[daemon]` von
`/etc/gdm3/custom.conf` (Ubuntu), `/etc/gdm3/daemon.conf` (Debian) oder
`/etc/gdm/custom.conf` (Fedora) ein und startest den Computer neu:

```ini
[daemon]
WaylandEnable=false
```

Der Desktop braucht außerdem eine X11-Sitzung, in die man sich anmelden kann.
Ubuntu 24.04 hat eine; das GNOME von Fedora 45 hat keine, dort hilft das also
nicht.

## Ausschalten {#turn-off}

Damit NeoDesk einen Wayland-Anmeldebildschirm nicht erreicht, führe aus:

```bash
sudo neodesk --option allow-drm-login-screen N
```

Eine Server-Strategie kann dieselbe Option setzen. Verbindungen zum
Anmeldebildschirm werden dann abgelehnt, wie vor Version 1.5.0, und der
Startbildschirm sagt, dass der Zugriff auf den Anmeldebildschirm
ausgeschaltet ist. Mit `Y` schaltest du es wieder ein. Sitzungen sind davon
in keinem Fall betroffen.
