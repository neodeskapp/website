// Draws the card at the top of a release's notes: the version, a title, the date and the
// release's numbers against the release before, counted from git.
//
//   node release-card.ts <repo> <tag> "<title>" [options]
//
//   --previous <tag>   the release to compare with (default: the tag before <tag> with the
//                      same prefix, in version order; name it when that one was never published)
//   --product <name>   says which product above the version, such as "Desktop client"
//   --accent lime      the colour of that line: blue (default, the server) or lime (the client)
//   --note "<text>"    a short line under the numbers, such as what makes them large
//   --out <file>       default public/img/releases/<tag>/card.png in this repository
//   --width <px>       default 1600
//
// It prints the numbers it counted. Commit the PNG, push, and put it first in the notes as
// https://raw.githubusercontent.com/neodeskapp/website/<commit>/public/img/releases/<tag>/card.png
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderReleaseCard } from './src/og.ts';
import type { CardFigure } from './src/og.ts';

const root = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const options: Record<string, string> = {};
const positional: string[] = [];
for (let i = 0; i < args.length; i++) {
	if (args[i].startsWith('--')) options[args[i].slice(2)] = args[++i] ?? '';
	else positional.push(args[i]);
}
const [repo, tag, title] = positional;
if (!repo || !tag || !title) {
	console.error('node release-card.ts <repo> <tag> "<title>" [--previous <tag>] [--product <name>] [--accent lime] [--note "<text>"] [--out <file>]');
	process.exit(2);
}

const git = (...a: string[]) => execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8', maxBuffer: 64 << 20 }).trim();

// The version part of the tag: v3.6.0-rc.2, desktop-v1.5.0-rc.4
const match = tag.match(/v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/);
if (!match) {
	console.error(`${tag} has no version in it`);
	process.exit(2);
}
const version = match[1];
const prefix = tag.slice(0, tag.length - match[0].length);

function previousTag(): string {
	if (options.previous) return options.previous;
	// Version order with pre-releases before their release: 1.5.0-rc.4 < 1.5.0
	const tags = git('-c', 'versionsort.suffix=-', 'tag', '--list', `${prefix}v*`, '--sort=v:refname').split('\n').filter(Boolean);
	const at = tags.indexOf(tag);
	if (at < 1) {
		console.error(`no tag before ${tag}; name one with --previous`);
		process.exit(2);
	}
	return tags[at - 1];
}
const previous = previousTag();
const range = `${previous}..${tag}`;

const commits = Number(git('rev-list', '--count', range));
// Renames count as renames, also when a release moves thousands of files
const shortstat = git('-c', 'diff.renameLimit=100000', 'diff', '--shortstat', '-M', range);
const number = (re: RegExp) => Number(shortstat.match(re)?.[1] ?? 0);
const files = number(/(\d+) files? changed/);
const added = number(/(\d+) insertions?\(\+\)/);
const removed = number(/(\d+) deletions?\(-\)/);
const subjects = git('log', '--format=%s', range).split('\n').filter(Boolean);
const fixes = subjects.filter((s) => /^fix(\([^)]*\))?!?:/.test(s)).length;
const people = new Set(git('log', '--format=%aN', range).split('\n').filter((n) => n && !n.endsWith('[bot]')));
const date = new Date(git('log', '-1', '--format=%cI', tag)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' });

const n = (v: number) => v.toLocaleString('en-US');
const figures: CardFigure[] = [
	{ value: n(commits), label: commits === 1 ? 'commit' : 'commits' },
	{ value: n(files), label: files === 1 ? 'file changed' : 'files changed' },
	{ value: `+${n(added)}`, label: 'lines added', tone: 'add' },
	{ value: `−${n(removed)}`, label: 'lines removed', tone: 'remove' }
];
if (people.size > 1) figures.push({ value: n(people.size), label: 'contributors' });
if (fixes > 0) figures.push({ value: n(fixes), label: fixes === 1 ? 'fix' : 'fixes' });

const prerelease = version.includes('-');
const kind = prerelease ? 'pre-release' : 'release';
const kicker = options.product ? `${options.product} ${kind}` : kind[0].toUpperCase() + kind.slice(1);

const out = options.out ?? path.join(root, 'public/img/releases', tag, 'card.png');
fs.mkdirSync(path.dirname(out), { recursive: true });
const png = renderReleaseCard(
	{ version: `v${version}`, title, kicker, accent: options.accent === 'lime' ? 'lime' : 'blue', date, figures, note: options.note },
	Number(options.width ?? 1600)
);
fs.writeFileSync(out, png);
console.log(`${tag} against ${previous}: ${commits} commits, ${files} files changed, +${added} -${removed} lines, ${fixes} fixes, ${people.size} contributor(s)`);
console.log(`wrote ${path.relative(process.cwd(), out)} (${png.length} bytes)`);
