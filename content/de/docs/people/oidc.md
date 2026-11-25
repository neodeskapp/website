---
title: Single Sign-on mit OIDC
description: Personen über einen OpenID-Connect-Identitätsanbieter an der Konsole anmelden lassen und ihnen Rollen aus den Gruppen geben, die der Anbieter schickt.
order: 5
---

Ist Single Sign-on eingeschaltet, bekommt die Anmeldeseite eine Schaltfläche, die Personen zu deinem OpenID-Connect-Identitätsanbieter schickt, etwa Keycloak, Okta, Azure AD oder Google. Nachdem sie sich dort angemeldet haben, kommen sie angemeldet zur Konsole zurück. Die erste Anmeldung legt ihr Konto an.

## Wo du es einstellst {#where-it-is-set}

Öffne **Einstellungen**, **Single Sign-on**. Den Tab sehen Konten mit der Berechtigung **Server konfigurieren**: standardmäßig Super-Admin, Administrator und Serveradministrator.

Die Einstellungen liegen in der Datenbank des Servers und gelten ohne Neustart ab der nächsten Anmeldung. Wer schon angemeldet ist, bleibt angemeldet.

## NeoDesk beim Anbieter registrieren {#register-neodesk-at-the-provider}

1. Lege bei deinem Anbieter eine OpenID-Connect-Anwendung an, die sich mit dem Authorization Code Flow anmeldet.
2. Trage diese Weiterleitungsadresse ein, mit der Adresse, unter der Personen die Konsole öffnen:

   ```text
   https://desk.example.com/api/auth/oidc/callback
   ```

   Sie muss genau mit **Weiterleitungs-URL** in NeoDesk übereinstimmen. Der Pfad `/api/oidc/callback` funktioniert auch.
3. Kopiere die Client-ID und das Client-Secret.
4. Willst du Rollen aus Gruppen, lass den Anbieter die Gruppen der Person in einen Claim schreiben, standardmäßig `groups`.

Öffne die Konsole zum Anmelden unter genau dieser Adresse. Der Browser trägt vom Beginn bis zum Ende der Anmeldung ein Cookie mit. Eine Anmeldung, die unter einer anderen Adresse beginnt, etwa unter der IP-Adresse des Servers, scheitert deshalb mit „Ungültiger OIDC-Rückruf. Bitte versuchen Sie es erneut.“ Hinter einem Reverse Proxy nimmst du die öffentliche Adresse (siehe [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls)).

## Einstellungen {#settings}

Setze den Haken bei **Single Sign-on einschalten**, damit die Felder erscheinen. Beim Einschalten füllt die Konsole **Weiterleitungs-URL** und **Panel-URL** mit der Adresse, die du gerade nutzt, wenn die Felder leer sind.

| Einstellung | Bedeutung |
| --- | --- |
| **Text der Schaltfläche** | Der Name des Anbieters auf der Anmeldeschaltfläche. |
| **Aussteller-URL** | Die Issuer-Adresse des Anbieters. Ist Automatische Discovery an, findet der Server daraus die übrigen Adressen. |
| **Erlaubte private OIDC-Netzwerke** | Adressen oder Bereiche, durch Kommas getrennt, für einen Anbieter in einem privaten Netz, etwa `10.20.0.0/16`. Ohne sie kontaktiert der Server keine Anbieter unter privaten Adressen. Nur private Bereiche werden angenommen, und Anbieter auf dem Server selbst werden nie kontaktiert. |
| **Client-ID**, **Client-Secret** | Vom Anbieter. Ein gespeichertes Secret erscheint als Punkte; lass sie stehen, um es zu behalten. |
| **Weiterleitungs-URL (Callback)** | Die beim Anbieter registrierte Weiterleitungsadresse. Sie muss http oder https nutzen und auf `/api/auth/oidc/callback` oder `/api/oidc/callback` enden. |
| **Panel-URL** | Die Adresse, unter der Personen die Konsole öffnen. Der Server schickt den Browser dorthin, um die Anmeldung abzuschließen. Ist sie leer, gilt `PANEL_PUBLIC_URL` oder `PUBLIC_URL` aus der Umgebung. |
| **Scopes** | Standard `openid profile email`. |
| **PKCE verwenden (empfohlen)** | Ergänzt die Anmeldung um PKCE. Angehakt bei einem Single Sign-on, das noch nie gespeichert wurde; ein gespeichertes behält den Wert, mit dem es gespeichert wurde. |
| **Automatische Discovery** | Standardmäßig an. Ausgeschaltet erscheinen **Autorisierungs-Endpoint**, **Token-Endpoint** und **UserInfo-Endpoint**, die du von Hand ausfüllst. |
| **Benutzer automatisch erstellen** | Standardmäßig an: Die erste Anmeldung legt ein Konto an. Aus: Nur wer hier schon ein Single-Sign-on-Konto hat, kann sich anmelden. |
| **Single Sign-on bevorzugen** | Die Anmeldeseite geht direkt zum Anbieter (siehe unten). Standardmäßig aus. |
| **Benutzername-Claim** | Unter **Claims**. Der Claim, der zum Kontonamen wird. Standard `preferred_username`. |
| **E-Mail-Claim** | Standard `email`. Wird bei jeder Anmeldung mit dem Konto gespeichert und in der Spalte **E-Mail** der Seite Benutzer angezeigt. Der Teil vor dem @ dient nur dann als Kontoname, wenn der Anbieter keinen Benutzername-Claim schickt und die Adresse als bestätigt meldet. |
| **Anzeigename-Claim** | Standard `name`. Wird bei jeder Anmeldung mit dem Konto gespeichert. |
| **Gruppen-Claim** | Der Claim mit den Gruppen der Person. Standard `groups`. |
| **Standardrolle** | Unter **Rollen**: **Betrachter**, **Operator** oder **Administrator**. Das sind die Rollen Betrachter, Remote-Operator und Administrator aus der [Rollentabelle](/docs/people/users-and-roles#roles). |
| **Gruppen zu Rollen** | Gruppen und die Rolle, die jede davon gibt (siehe unten). |

Damit du mit eingeschaltetem Single Sign-on speichern kannst, braucht der Server eine Client-ID, eine Weiterleitungs-URL und entweder eine Aussteller-URL oder sowohl den Autorisierungs- als auch den Token-Endpoint.

::: warning
**Administrator** unter **Standardrolle** ist die Rolle Administrator, die jede Berechtigung hat. Damit bekommt jede Person, die dein Anbieter durchlässt, die volle Kontrolle über den Server.
:::

## Rollen aus Gruppen {#roles-from-groups}

Schreibe einen Eintrag pro Zeile, als `group=role`, mit einem Rollennamen aus der [Rollentabelle](/docs/people/users-and-roles#roles), etwa `viewer`, `operator`, `global_admin` oder `super_admin`. Gruppennamen müssen genau so geschrieben sein, wie der Anbieter sie schickt, auch in Groß- und Kleinschreibung. Der Gruppen-Claim kann eine Liste sein oder ein Text, in dem die Namen durch Leerzeichen oder Kommas getrennt sind.

Die Rolle beginnt bei der **Standardrolle**, und eine Gruppe in der Zuordnung kann sie nur anheben: Passen mehrere, gewinnt die mit den meisten Rechten. Ein neues Konto bekommt diese Rolle.

Ist eine Zuordnung ausgefüllt, wird die Rolle bei jeder Anmeldung neu gesetzt. Wessen Gruppen zu keinem Eintrag der Zuordnung passen, bekommt die **Standardrolle**. Wer beim Anbieter aus einer Gruppe entfernt wird, verliert deshalb bei der nächsten Anmeldung die Rolle dieser Gruppe. Eine Rolle, die du auf der Seite **Benutzer** wählst, gilt nur bis dahin. Ohne Zuordnung gilt die **Standardrolle** nur für neue Konten, und eine Rolle, die du auf der Seite Benutzer wählst, bleibt.

## Was Personen sehen {#what-people-see}

Die Anmeldeseite zeigt das Passwortformular, dann „oder“ und eine Schaltfläche **Mit … anmelden**, in der statt der Punkte der **Text der Schaltfläche** steht; ohne ihn heißt sie **Mit SSO anmelden**. Nach dem Anbieter landen Personen angemeldet auf der Seite, die sie öffnen wollten. Konten, die so entstehen, haben auf der Seite Benutzer den Tag **SSO** und können sich nicht mit einem Passwort anmelden. Die Konsole fragt sie nicht nach einem [Zwei-Faktor-Code](/docs/people/two-factor).

Mit **Single Sign-on bevorzugen** zeigt die Anmeldeseite „Single Sign-on wird geöffnet…“ und geht von selbst zum Anbieter, außer:

- wenn die Adresse `/login?autoLaunch=0` ist,
- direkt nach einem fehlgeschlagenen Single Sign-on,
- bei Besuchern von einer privaten Netzwerkadresse (10.x, 172.16.x bis 172.31.x, 192.168.x, 127.x und die entsprechenden IPv6-Adressen).

Hinter einem Reverse Proxy sieht die Konsole die Adresse des Proxys, es sei denn, sie ist so eingestellt, dass sie dem Proxy vertraut. Steht der Proxy auf demselben Rechner oder in einem privaten Netz, zählen dann alle als lokal, und die Seite geht nie von selbst zum Anbieter. Wie du das einstellst, steht unter [Dem Proxy vertrauen](/docs/operations/reverse-proxy-tls#trusting-the-proxy). Wie die Konsole dich einordnet, siehst du, wenn du `/api/auth/oidc/status` unter der Adresse der Konsole öffnest. Damit die Seite von selbst zum Anbieter geht, müssen `enabled` und `prefer_sso` auf `true` stehen und `local_bypass` auf `false`.

**Single Sign-on bevorzugen** ändert nur die Anmeldeseite. Die Anmeldung mit Passwort funktioniert weiter.

Um eine einzelne Person von der Anmeldung per Single Sign-on abzuhalten, deaktiviere ihr Konto auf der Seite Benutzer (siehe [Konto deaktivieren](/docs/people/users-and-roles#disable-an-account)). Löschen reicht nicht, solange **Benutzer automatisch erstellen** eingeschaltet ist, denn die nächste Anmeldung legt ein neues Konto an.

## Single Sign-on im RustDesk-Client {#single-sign-on-in-the-rustdesk-client}

Ist Single Sign-on eingeschaltet, bietet der Server es RustDesk-Clients als zweiten Weg zur Anmeldung an, benannt nach dem **Text der Schaltfläche** oder, ohne ihn, SSO. Der Client öffnet den Anbieter im Browser des Computers. Nach der Anmeldung dort zeigt der Browser „Sign-in successful“ und „You can close this window and return to RustDesk.“, und der Client ist angemeldet.

Der Client nutzt dieselben Einstellungen, dieselbe **Weiterleitungs-URL** und dieselben Konten wie die Konsole, du registrierst beim Anbieter also nichts weiter. Er braucht Folgendes:

- Der Client hat diesen Server als API-Server (siehe [Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client)).
- Die **Weiterleitungs-URL** lässt sich auf dem Computer öffnen, auf dem der Client läuft. Wartet der Client nach der Anmeldung beim Anbieter weiter, prüfe, ob der Browser diese Adresse erreicht hat und „Sign-in successful“ zeigt.
- Die Anmeldung im Browser ist innerhalb von 10 Minuten abgeschlossen.

Eine abgelehnte Anmeldung zeigt im Browser „Sign-in failed“ mit dem Grund, etwa „Your account was not found and auto-provisioning is disabled.“ Nach einem Single Sign-on fragt der Client nicht nach einem Zwei-Faktor-Code. Ein Single-Sign-on-Konto kann sich im Client nicht mit einem Passwort anmelden.

## Beispiel mit einem allgemeinen Anbieter {#example-with-a-generic-provider}

| Einstellung | Wert |
| --- | --- |
| **Text der Schaltfläche** | `Example ID` |
| **Aussteller-URL** | `https://sso.example.com` |
| **Client-ID** | `neodesk` |
| **Weiterleitungs-URL (Callback)** | `https://desk.example.com/api/auth/oidc/callback` |
| **Panel-URL** | `https://desk.example.com` |
| **PKCE verwenden (empfohlen)** | Angehakt |
| **Standardrolle** | **Betrachter** |

**Gruppen zu Rollen** für einen Anbieter, der diese Namen in `groups` schickt:

```text
neodesk-admins=global_admin
neodesk-operators=operator
```

## Testen {#test-it}

1. Klicke auf **Discovery testen**. Der Server holt das Discovery-Dokument der **Aussteller-URL** und listet die gefundenen Endpoints auf. Client-ID und Secret prüft er nicht.
2. Klicke auf **Single-Sign-on-Einstellungen speichern** und bestätige.
3. Bleib angemeldet, öffne die Anmeldeseite in einem privaten Browserfenster und klicke auf die neue Schaltfläche.

| Meldung auf der Anmeldeseite | Bedeutung |
| --- | --- |
| Der Zugriff wurde vom Identitätsanbieter verweigert. | Der Anbieter hat abgelehnt, oder die Person hat abgebrochen. |
| Ihr Konto wurde nicht gefunden und die automatische Registrierung ist deaktiviert. | **Benutzer automatisch erstellen** ist aus, und es gibt kein Single-Sign-on-Konto mit diesem Namen. |
| OIDC-Authentifizierung fehlgeschlagen. Bitte versuchen Sie es erneut. | Der Server konnte die Anmeldung beim Anbieter nicht abschließen, zum Beispiel wegen eines falschen Client-Secrets, oder weil der Anbieter länger als 15 Sekunden für die Antwort auf die Token-Anfrage des Servers gebraucht hat. |
| Ungültiger OIDC-Rückruf. Bitte versuchen Sie es erneut. | Der Callback gehört nicht zu einer Anmeldung, die dieser Browser begonnen hat, oder die Anmeldung beim Anbieter hat länger als 10 Minuten gedauert. |
| Beim SSO-Anmelden ist ein Fehler aufgetreten. | Der Server konnte die Anmeldung nicht beginnen oder nicht abschließen, zum Beispiel weil er den Anbieter nicht erreicht. |
| Dieser Name gehört zu einem Konto, das sich mit einem Passwort oder über das Verzeichnis anmeldet, daher kann Single Sign-On Sie nicht anmelden. Wenden Sie sich an einen Administrator. | Es gibt schon ein Passwort- oder Verzeichniskonto mit demselben Namen. Single Sign-on übernimmt ein solches Konto nie. |
| Dieses Konto ist deaktiviert. Wenden Sie sich an einen Administrator. | Das Konto ist auf der Seite Benutzer deaktiviert. |

Schickt der Anbieter den Browser zurück, wartet die Konsole bis zu 30 Sekunden, bis der Server die Anmeldung beim Anbieter abgeschlossen hat. Kommt in dieser Zeit keine Antwort, zeigt der Browser eine Seite, auf der nur „OIDC callback proxy failed“ steht. Versuch es noch einmal; passiert das immer wieder, antwortet der Anbieter zu langsam.
