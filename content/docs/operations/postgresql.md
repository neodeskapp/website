---
title: PostgreSQL
description: Run NeoDesk on PostgreSQL instead of SQLite, move an existing install over, and back up the database.
order: 4
icon: database
---

By default NeoDesk keeps its devices, accounts, settings and the console's data in one SQLite file. It can keep the same data in a PostgreSQL database instead. This page covers when that is worth it, how to start on PostgreSQL, how to move an install that already runs on SQLite, and how to back the database up.

## When to use it

SQLite needs no setup, and every install type uses it unless you choose otherwise. The Linux installer suggests it for most installs and recommends PostgreSQL from about 100 devices. PostgreSQL also makes sense when you already run it and have backups and monitoring for it.

Either way, the server and the console share one database. The key pair, the API key and the console's uploaded files stay on disk, so they need a backup of their own. See [Backup and restore](/docs/operations/backup).

## Connection settings

`DATABASE_URL` names the database. The server opens PostgreSQL when it starts with `postgres://` or `postgresql://`, and treats anything else as the path of a SQLite file:

```text
postgres://neodesk:<password>@<database-host>:5432/neodesk?sslmode=require
```

- Write special characters in the password URL-encoded, or use a password of letters and digits only. This makes one:

  ```bash
  openssl rand -hex 24
  ```

- The parameters after `?` go to the PostgreSQL driver: `sslmode=disable` for a database on the same machine or network without TLS, `require` or `verify-full` for one elsewhere, and `pool_max_conns=20` to change the size of the connection pool.
- The server runs every database session in UTC, whatever the URL or the database says.

Older env files name the database with `DB_URL` and `DB_TYPE`. The server still reads them while `DATABASE_URL` is empty. On Linux and Windows, `DB_TYPE=sqlite` keeps an install on SQLite even when `DATABASE_URL` names a PostgreSQL database, and the log says so; remove `DB_TYPE` when you switch.

## Start a Docker install on PostgreSQL

With the install script, add `--postgres`:

```bash
sudo bash neodesk-docker.sh --postgres
```

It turns on the compose file's `postgres` service, which runs PostgreSQL in a second container, and writes a random password and the connection into `.env`.

By hand, put these lines into the `.env` file next to `docker-compose.yml` before the first start, with the same password in place of both `<password>`:

```ini
COMPOSE_PROFILES=postgres
POSTGRES_PASSWORD=<password>
DATABASE_URL=postgres://neodesk:<password>@postgres:5432/neodesk?sslmode=disable
```

Then start both containers:

```bash
docker compose up -d
```

`COMPOSE_PROFILES=postgres` makes every Compose command include the database container, so you don't have to add `--profile postgres` each time.

- The database lives in the volume `neodesk-postgres-data`. Its password is set when that volume is created; changing `POSTGRES_PASSWORD` later does not change it.
- At start the NeoDesk container waits up to a minute for the database's port, then starts anyway.
- The database container publishes no port, so only containers on the compose network reach it.
- The container's log names the database without the user name and password.

With `install/docker-compose.single.yml`, the file that builds the image from the repository, the password variable is `PG_PASSWORD` instead of `POSTGRES_PASSWORD`.

## Start a Linux or Windows install on PostgreSQL

```bash
sudo bash neodesk.sh --auto --postgresql
```

The Linux installer installs PostgreSQL on the same machine if it is missing, creates the role and the database `neodesk` with a generated password, and writes the connection into the env file as `DATABASE_URL`. For a database on this machine it also adds rules to `pg_hba.conf` that let the role sign in from `127.0.0.1` and `::1` with a password (`scram-sha-256`), and keeps a copy of the file it changed. In an interactive run, choose **PostgreSQL (production)** when it asks for the database type, then give the host, port, database, user and password, or leave the password empty to have one generated.

To use a database that exists already, here or on another machine, give its address instead, with the role's password in place of `<password>` and the database server in place of `<database-host>`. The installer then sets up no PostgreSQL and asks nothing about the database:

```bash
sudo bash neodesk.sh --auto --pg-uri 'postgres://neodesk:<password>@<database-host>:5432/neodesk?sslmode=require'
```

The Windows installer does not install PostgreSQL or create the database: both must exist. Give it the connection, with the role's password in place of `<password>`:

```powershell
.\neodesk.ps1 -Auto -PgUri 'postgres://neodesk:<password>@localhost:5432/neodesk?sslmode=disable'
```

Or run it with `-Auto -PostgreSQL` and set `$env:POSTGRESQL_PASS`, and `POSTGRESQL_USER`, `POSTGRESQL_HOST`, `POSTGRESQL_PORT` and `POSTGRESQL_DB` where they differ from `neodesk`, `localhost`, `5432` and `neodesk`. In an interactive run it asks for them.

For a database on another machine, create the role and the database there, set `DATABASE_URL` in the env file, and restart the service. The server creates its tables at start.

## Move an existing install to PostgreSQL

The move copies every table of the server and the console into PostgreSQL with their ids, after it has created the tables itself. Before it starts, it saves a copy of the SQLite file next to it as `db_v2_backup_<time>.sqlite3`. It refuses a database that holds rows already, unless you allow it to replace everything in it.

### Docker with the script

```bash
sudo bash neodesk-docker.sh postgres
```

The script stops NeoDesk, backs up the data volumes, starts the PostgreSQL container, moves the data with the server's `migrate` command, and starts NeoDesk on PostgreSQL. If the move fails or NeoDesk does not get healthy on PostgreSQL, the install stays on SQLite as it was. If a PostgreSQL volume from an earlier try exists, it stops; `--overwrite-postgres` deletes that volume first.

### Docker by hand

In the folder with `docker-compose.yml`:

1. Stop NeoDesk:

   ```bash
   docker compose stop neodesk
   ```

2. Add the three PostgreSQL lines to `.env` as shown above, start only the database, and wait until `docker compose ps` shows it as healthy:

   ```bash
   docker compose up -d postgres
   ```

3. Run the move with the server's `migrate` command, as the user the container runs as (10001, or your `PUID` and `PGID`):

   ```bash
   docker compose run --rm --no-deps -T --user 10001:10001 --entrypoint sh neodesk -c 'exec /usr/local/bin/neodesk-server migrate -mode sqlite2pg -src /opt/neodesk/data/db_v2.sqlite3 -dst "$DATABASE_URL"'
   ```

4. Start NeoDesk, which now opens PostgreSQL:

   ```bash
   docker compose up -d
   ```

The old SQLite file stays in the `neodesk-data` volume, next to the keys, until you delete it.

### Linux and Windows

In the installer's menu, choose **Database migration**, then **SQLite -> PostgreSQL**. It asks for the SQLite file, by default the install's own, and the PostgreSQL connection, and whether to replace data that is already in the database. For the install's own database it stops the service, moves the data, writes the new `DATABASE_URL` into the env file and starts the service again. If the move fails, the install stays on its SQLite file.

The menu runs the installed server's `migrate` command. `neodesk-server migrate -h` lists its modes, among them `pg2sqlite` for the way back.

Keep the SQLite file until you have checked devices, accounts and settings in the console.

## Back up the database

`pg_dump` makes a consistent copy while the server runs. In Docker, in the folder with `docker-compose.yml`:

```bash
docker compose exec -T -u postgres postgres pg_dump -U neodesk -Fc neodesk > neodesk-db.dump
```

The Docker script's `backup` command also saves a dump of the database next to the volume backup.

On a Linux install with the database on the same machine:

```bash
sudo -u postgres pg_dump -Fc neodesk > neodesk-db.dump
```

To restore, stop NeoDesk first, then load the dump into the database, replacing what is there:

```bash
docker compose stop neodesk
docker compose exec -T -u postgres postgres pg_restore -U neodesk -d neodesk --clean --if-exists < neodesk-db.dump
docker compose start neodesk
```

On Linux:

```bash
sudo systemctl stop neodesk-server
sudo -u postgres pg_restore -d neodesk --clean --if-exists < neodesk-db.dump
sudo systemctl start neodesk-server
```

The console's **Download backup** under **Server**, **Backups** also holds every table on PostgreSQL, as a dump the console can restore, together with the keys and files. For the database itself, rely on `pg_dump`.
