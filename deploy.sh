#!/usr/bin/env bash
# Build the site for one host and upload it to the web VM.
#   bash deploy.sh beta        -> https://beta.neode.sk   (/var/www/beta.neode.sk)
#   bash deploy.sh production  -> https://neode.sk        (/var/www/neode.sk)
# The upload goes to a new folder next to the live one and is swapped in, so a
# visitor never sees half a site. The previous version stays as <folder>.old.
# The web server to upload to (ssh host) comes from DEPLOY_SSH_HOST or the
# untracked file .deploy-host next to this script.
set -euo pipefail
cd "$(dirname "$0")"
ssh_host="${DEPLOY_SSH_HOST:-$(cat .deploy-host 2>/dev/null || true)}"
[ -n "$ssh_host" ] || { echo 'Set DEPLOY_SSH_HOST or write the ssh host into .deploy-host' >&2; exit 2; }
case "${1:-}" in
    beta) host=beta.neode.sk ;;
    production) host=neode.sk ;;
    *) sed -n '2,6p' "$0"; exit 2 ;;
esac
SITE_URL="https://$host" node build.mjs
# /var/www belongs to root, so the folders are made and swapped with sudo
tar -C dist -cf - . | ssh -o BatchMode=yes "$ssh_host" "
    set -e
    sudo rm -rf /var/www/$host.new
    sudo mkdir /var/www/$host.new
    sudo chown ubuntu:www-data /var/www/$host.new
    tar -C /var/www/$host.new -xf -
    chmod -R a+rX /var/www/$host.new
    sudo rm -rf /var/www/$host.old
    sudo mv /var/www/$host /var/www/$host.old
    sudo mv /var/www/$host.new /var/www/$host
"
echo "Deployed to https://$host"
