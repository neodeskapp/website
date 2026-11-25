---
title: PostgreSQL
description: NeoDesk mit PostgreSQL statt SQLite betreiben, eine bestehende Installation umziehen und die Datenbank sichern.
order: 4
---

Standardmäßig hält NeoDesk seine Geräte, Konten, Einstellungen und die Daten der Konsole in einer einzigen SQLite-Datei. Dieselben Daten kann es stattdessen in einer PostgreSQL-Datenbank halten. Diese Seite erklärt, wann sich das lohnt, wie du mit PostgreSQL startest, wie du eine Installation umziehst, die schon mit SQLite läuft, und wie du die Datenbank sicherst.

## Wann es sich lohnt {#when-to-use-it}

SQLite braucht keine Einrichtung, und jede Installationsart nutzt es, solange du nichts anderes wählst. Der Linux-Installer schlägt es für die meisten Installationen vor und empfiehlt PostgreSQL ab etwa 100 Geräten. PostgreSQL ist auch sinnvoll, wenn du es schon betreibst und Backups und Monitoring dafür hast.

In beiden Fällen teilen sich Server und Konsole eine Datenbank. Das Schlüsselpaar, der API-Schlüssel und die hochgeladenen Dateien der Konsole bleiben auf der Platte und brauchen deshalb ein eigenes Backup. Siehe [Backup und Wiederherstellung](/docs/operations/backup).

## Verbindungseinstellungen {#connection-settings}

`DATABASE_URL` nennt die Datenbank. Der Server öffnet PostgreSQL, wenn der Wert mit `postgres://` oder `postgresql://` beginnt, und behandelt alles andere als Pfad einer SQLite-Datei:

```text
postgres://neodesk:<password>@<database-host>:5432/neodesk?sslmode=require
```

- Schreibe Sonderzeichen im Passwort URL-kodiert, oder nimm ein Passwort nur aus Buchstaben und Ziffern. Dieser Befehl erzeugt eins:

  ```bash
  openssl rand -hex 24
  ```

- Die Parameter nach `?` gehen an den PostgreSQL-Treiber: `sslmode=disable` für eine Datenbank auf demselben Rechner oder im selben Netz ohne TLS, `require` oder `verify-full` für eine Datenbank anderswo und `pool_max_conns=20`, um die Größe des Verbindungspools zu ändern.
- Der Server führt jede Datenbanksitzung in UTC aus, egal was die URL oder die Datenbank vorgibt.

Ältere env-Dateien nennen die Datenbank mit `DB_URL` und `DB_TYPE`. Der Server liest sie weiterhin, solange `DATABASE_URL` leer ist. Unter Linux und Windows hält `DB_TYPE=sqlite` eine Installation bei SQLite, auch wenn `DATABASE_URL` eine PostgreSQL-Datenbank nennt, und das Log sagt das. Entferne `DB_TYPE`, wenn du wechselst.

## Eine Docker-Installation mit PostgreSQL starten {#start-a-docker-install-on-postgresql}

Mit dem Installationsskript hängst du `--postgres` an:

```bash
sudo bash neodesk-docker.sh --postgres
```

Es schaltet den Dienst `postgres` der Compose-Datei ein, der PostgreSQL in einem zweiten Container betreibt, und schreibt ein zufälliges Passwort und die Verbindung in `.env`.

Von Hand trägst du vor dem ersten Start diese Zeilen in die Datei `.env` neben `docker-compose.yml` ein. Setze für beide `<password>` dasselbe Passwort ein:

```ini
COMPOSE_PROFILES=postgres
POSTGRES_PASSWORD=<password>
DATABASE_URL=postgres://neodesk:<password>@postgres:5432/neodesk?sslmode=disable
```

Starte dann beide Container:

```bash
docker compose up -d
```

Mit `COMPOSE_PROFILES=postgres` bezieht jeder Compose-Befehl den Datenbank-Container ein, du musst also nicht jedes Mal `--profile postgres` anhängen.

- Die Datenbank liegt im Volume `neodesk-postgres-data`. Ihr Passwort wird gesetzt, wenn dieses Volume angelegt wird; wenn du `POSTGRES_PASSWORD` später änderst, ändert sich das Passwort nicht.
- Beim Start wartet der NeoDesk-Container bis zu einer Minute auf den Port der Datenbank und startet dann trotzdem.
- Der Datenbank-Container veröffentlicht keinen Port, deshalb erreichen ihn nur Container im Compose-Netz.
- Das Log des Containers nennt die Datenbank ohne Benutzername und Passwort.

Mit `install/docker-compose.single.yml`, der Datei, die das Image aus dem Repository baut, heißt die Passwort-Variable `PG_PASSWORD` statt `POSTGRES_PASSWORD`.

## Eine Linux- oder Windows-Installation mit PostgreSQL starten {#start-a-linux-or-windows-install-on-postgresql}

```bash
sudo bash neodesk.sh --auto --postgresql
```

Der Linux-Installer installiert PostgreSQL auf demselben Rechner, wenn es fehlt, legt die Rolle und die Datenbank `neodesk` mit einem erzeugten Passwort an und schreibt die Verbindung als `DATABASE_URL` in die env-Datei. Für eine Datenbank auf diesem Rechner ergänzt er außerdem Regeln in `pg_hba.conf`, mit denen sich die Rolle von `127.0.0.1` und `::1` aus mit Passwort (`scram-sha-256`) anmelden kann, und behält eine Kopie der Datei, die er geändert hat. Wähle bei einem interaktiven Lauf **PostgreSQL (production)**, wenn er nach dem Datenbanktyp fragt. Gib dann Host, Port, Datenbank, Benutzer und Passwort an, oder lass das Passwort leer, damit eines erzeugt wird.

Um eine bestehende Datenbank zu nutzen, hier oder auf einem anderen Rechner, gibst du stattdessen ihre Adresse an. Setze für `<password>` das Passwort der Rolle und für `<database-host>` den Datenbankserver ein. Der Installer richtet dann kein PostgreSQL ein und fragt nichts zur Datenbank:

```bash
sudo bash neodesk.sh --auto --pg-uri 'postgres://neodesk:<password>@<database-host>:5432/neodesk?sslmode=require'
```

Der Windows-Installer installiert kein PostgreSQL und legt keine Datenbank an: Beides muss es schon geben. Gib ihm die Verbindung und setze für `<password>` das Passwort der Rolle ein:

```powershell
.\neodesk.ps1 -Auto -PgUri 'postgres://neodesk:<password>@localhost:5432/neodesk?sslmode=disable'
```

Oder starte ihn mit `-Auto -PostgreSQL` und setze `$env:POSTGRESQL_PASS`, dazu `POSTGRESQL_USER`, `POSTGRESQL_HOST`, `POSTGRESQL_PORT` und `POSTGRESQL_DB`, wo sie von `neodesk`, `localhost`, `5432` und `neodesk` abweichen. Bei einem interaktiven Lauf fragt er danach.

Für eine Datenbank auf einem anderen Rechner legst du Rolle und Datenbank dort an, setzt `DATABASE_URL` in der env-Datei und startest den Dienst neu. Der Server legt seine Tabellen beim Start an.

## Eine bestehende Installation auf PostgreSQL umziehen {#move-an-existing-install-to-postgresql}

Der Umzug legt die Tabellen in PostgreSQL selbst an und kopiert dann jede Tabelle von Server und Konsole mit ihren IDs dorthin. Bevor er beginnt, speichert er eine Kopie der SQLite-Datei daneben als `db_v2_backup_<time>.sqlite3`. Eine Datenbank, die schon Zeilen enthält, lehnt er ab, außer du erlaubst ihm, alles darin zu ersetzen.

### Docker mit dem Skript {#docker-with-the-script}

```bash
sudo bash neodesk-docker.sh postgres
```

Das Skript stoppt NeoDesk, sichert die Datenvolumes, startet den PostgreSQL-Container, zieht die Daten mit dem Befehl `migrate` des Servers um und startet NeoDesk mit PostgreSQL. Schlägt der Umzug fehl oder wird NeoDesk mit PostgreSQL nicht „healthy“, bleibt die Installation wie vorher bei SQLite. Gibt es noch ein PostgreSQL-Volume von einem früheren Versuch, bricht das Skript ab; `--overwrite-postgres` löscht dieses Volume vorher.

### Docker von Hand {#docker-by-hand}

Im Ordner mit `docker-compose.yml`:

1. Stoppe NeoDesk:

   ```bash
   docker compose stop neodesk
   ```

2. Trage die drei PostgreSQL-Zeilen wie oben gezeigt in `.env` ein, starte nur die Datenbank und warte, bis `docker compose ps` sie als „healthy“ zeigt:

   ```bash
   docker compose up -d postgres
   ```

3. Führe den Umzug mit dem Befehl `migrate` des Servers aus, als der Benutzer, unter dem der Container läuft (10001, oder deine Werte für `PUID` und `PGID`):

   ```bash
   docker compose run --rm --no-deps -T --user 10001:10001 --entrypoint sh neodesk -c 'exec /usr/local/bin/neodesk-server migrate -mode sqlite2pg -src /opt/neodesk/data/db_v2.sqlite3 -dst "$DATABASE_URL"'
   ```

4. Starte NeoDesk, das jetzt PostgreSQL öffnet:

   ```bash
   docker compose up -d
   ```

Die alte SQLite-Datei bleibt neben den Schlüsseln im Volume `neodesk-data`, bis du sie löschst.

### Linux und Windows {#linux-and-windows}

Wähle im Menü des Installers **Database migration**, dann **SQLite -> PostgreSQL**. Der Menüpunkt fragt nach der SQLite-Datei, standardmäßig der eigenen der Installation, nach der PostgreSQL-Verbindung und danach, ob Daten ersetzt werden sollen, die schon in der Datenbank sind. Für die eigene Datenbank der Installation stoppt er den Dienst, zieht die Daten um, schreibt die neue `DATABASE_URL` in die env-Datei und startet den Dienst wieder. Schlägt der Umzug fehl, bleibt die Installation bei ihrer SQLite-Datei.

Das Menü führt den Befehl `migrate` des installierten Servers aus. `neodesk-server migrate -h` listet seine Modi auf, darunter `pg2sqlite` für den Weg zurück.

Behalte die SQLite-Datei, bis du Geräte, Konten und Einstellungen in der Konsole geprüft hast.

## Die Datenbank sichern {#back-up-the-database}

`pg_dump` erstellt eine konsistente Kopie, während der Server läuft. Unter Docker, im Ordner mit `docker-compose.yml`:

```bash
docker compose exec -T -u postgres postgres pg_dump -U neodesk -Fc neodesk > neodesk-db.dump
```

Der Befehl `backup` des Docker-Skripts speichert ebenfalls einen Dump der Datenbank neben dem Backup der Volumes.

Bei einer Linux-Installation mit der Datenbank auf demselben Rechner:

```bash
sudo -u postgres pg_dump -Fc neodesk > neodesk-db.dump
```

Zum Wiederherstellen stoppst du zuerst NeoDesk und lädst dann den Dump in die Datenbank. Er ersetzt, was dort ist:

```bash
docker compose stop neodesk
docker compose exec -T -u postgres postgres pg_restore -U neodesk -d neodesk --clean --if-exists < neodesk-db.dump
docker compose start neodesk
```

Unter Linux:

```bash
sudo systemctl stop neodesk-server
sudo -u postgres pg_restore -d neodesk --clean --if-exists < neodesk-db.dump
sudo systemctl start neodesk-server
```

**Sicherung herunterladen** unter **Server**, **Sicherungen** enthält auch unter PostgreSQL jede Tabelle, als Dump, den die Konsole wiederherstellen kann, zusammen mit den Schlüsseln und Dateien. Für die Datenbank selbst verlass dich auf `pg_dump`.
