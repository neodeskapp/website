// The desktop client's downloads for the download page (/download/): which release the
// page offers, and what each of its files is. The build reads the client's published
// releases from GitHub, as it reads the server's version; when it can't, it uses the
// release recorded in src/client-release.json by the last build that could.
//
// pickRelease is the choice itself, a pure function with tests in test/download.test.ts:
// a final release wins over a newer release candidate, which the page then offers lower
// down as a preview; while there is no final release, the newest candidate is the one.

export type ClientOs = 'windows' | 'macos' | 'linux';
export type ClientArch = 'x64' | 'arm64';
/** exe and msi for Windows, dmg for macOS, deb, rpm and suse (the openSUSE rpm) for Linux, and a portable archive for each */
export type FileKind = 'exe' | 'msi' | 'dmg' | 'deb' | 'rpm' | 'suse' | 'portable';

export interface ClientFile {
	name: string;
	os: ClientOs;
	arch: ClientArch;
	kind: FileKind;
	/** Bytes */
	size: number;
	/** The asset's address on GitHub */
	url: string;
	/** From the release's SHA256SUMS; empty when the release publishes none for this file */
	sha256: string;
}

export interface ClientRelease {
	tag: string;
	/** The version without the tag's prefix: 1.5.0-rc.7 */
	version: string;
	prerelease: boolean;
	/** ISO date of publication */
	published: string;
	/** The release's page on GitHub */
	page: string;
	/** The SHA256SUMS file of the release, when it has one */
	sums: string;
	files: ClientFile[];
}

/** What the download page offers: the release, and a newer release candidate as a preview when the release is final */
export interface ClientOffer {
	main: ClientRelease | null;
	preview: ClientRelease | null;
}

/** The part of a release that the choice reads */
export interface ReleaseLike {
	tag: string;
	draft?: boolean;
	prerelease: boolean;
	published: string | null;
}

/** The desktop client's tags: desktop-v1.5.0, desktop-v1.5.0-rc.7. The support agent's support-v tags are another product. */
const TAG = /^desktop-v(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

/** The version of a desktop tag, or null for any other tag */
export const versionOf = (tag: string) => (TAG.test(tag) ? tag.replace(/^desktop-v/, '') : null);

/** Orders two desktop tags by their version, a pre-release before its final release (semver) */
export function compareTags(a: string, b: string): number {
	const ma = a.match(TAG);
	const mb = b.match(TAG);
	if (!ma || !mb) return 0;
	for (let i = 1; i <= 3; i++) if (Number(ma[i]) !== Number(mb[i])) return Number(ma[i]) - Number(mb[i]);
	if (!ma[4] || !mb[4]) return ma[4] ? -1 : mb[4] ? 1 : 0;
	const pa = ma[4].split('.');
	const pb = mb[4].split('.');
	for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
		if (pa[i] === undefined) return -1;
		if (pb[i] === undefined) return 1;
		const na = /^\d+$/.test(pa[i]);
		const nb = /^\d+$/.test(pb[i]);
		if (na && nb && Number(pa[i]) !== Number(pb[i])) return Number(pa[i]) - Number(pb[i]);
		if (na !== nb) return na ? -1 : 1;
		if (!na && pa[i] !== pb[i]) return pa[i] < pb[i] ? -1 : 1;
	}
	return 0;
}

/**
 * The release the page offers, and a preview. Drafts, unpublished releases and tags that
 * are not the desktop client's are left out. With a final release, it is the main one, and
 * the newest release candidate is the preview only when it is newer than that release.
 * Without one, the newest release candidate is the main one and there is no preview.
 */
export function pickRelease<T extends ReleaseLike>(releases: T[]): { main: T | null; preview: T | null } {
	const published = releases.filter((r) => !r.draft && r.published && versionOf(r.tag)).sort((a, b) => compareTags(b.tag, a.tag));
	const final = published.find((r) => !r.prerelease) ?? null;
	const candidate = published.find((r) => r.prerelease) ?? null;
	if (!final) return { main: candidate, preview: null };
	return { main: final, preview: candidate && compareTags(candidate.tag, final.tag) > 0 ? candidate : null };
}

const FILE = /^neodesk-.+-(windows|macos|linux)-(x86_64|aarch64)(?:-(portable|suse))?\.(exe|msi|tar\.gz|dmg|zip|deb|rpm)$/;

/** What a release file is, from its name, or null for a file the page doesn't offer (templates, manifests, sums) */
export function fileOf(name: string): Pick<ClientFile, 'os' | 'arch' | 'kind'> | null {
	const m = name.match(FILE);
	if (!m) return null;
	const os = m[1] as ClientOs;
	const arch: ClientArch = m[2] === 'aarch64' ? 'arm64' : 'x64';
	const ext = m[4];
	let kind: FileKind | null = null;
	if (m[3] === 'portable' || (os === 'windows' && ext === 'tar.gz')) kind = 'portable';
	else if (m[3] === 'suse' && ext === 'rpm') kind = 'suse';
	else if (os === 'windows' && (ext === 'exe' || ext === 'msi')) kind = ext;
	else if (os === 'macos' && ext === 'dmg') kind = 'dmg';
	else if (os === 'linux' && (ext === 'deb' || ext === 'rpm')) kind = ext;
	return kind ? { os, arch, kind } : null;
}

/** The lines of a SHA256SUMS file as file name to hash */
export function parseSums(text: string): Map<string, string> {
	const out = new Map<string, string>();
	for (const line of text.split(/\r?\n/)) {
		const m = line.match(/^([0-9a-f]{64}) [ *](.+)$/i);
		if (m) out.set(m[2].trim(), m[1].toLowerCase());
	}
	return out;
}

/** A release from GitHub's API, as far as the build reads it */
export interface GitHubRelease {
	tag_name: string;
	draft: boolean;
	prerelease: boolean;
	published_at: string | null;
	html_url: string;
	assets: { name: string; size: number; browser_download_url: string; digest?: string | null }[];
}

/**
 * A GitHub release as the page's release, with the hashes of its SHA256SUMS. A file whose
 * hash in SHA256SUMS differs from the one GitHub computed is a problem: the build stops.
 */
export function toClientRelease(r: GitHubRelease, sums: Map<string, string>, problems: string[]): ClientRelease {
	const files: ClientFile[] = [];
	for (const a of r.assets) {
		const what = fileOf(a.name);
		if (!what) continue;
		const sha256 = sums.get(a.name) ?? '';
		const digest = a.digest?.replace(/^sha256:/, '').toLowerCase();
		if (sha256 && digest && sha256 !== digest) problems.push(`${r.tag_name}: ${a.name} has ${sha256} in SHA256SUMS, but GitHub computed ${digest}`);
		files.push({ name: a.name, ...what, size: a.size, url: a.browser_download_url, sha256 });
	}
	const sumsAsset = r.assets.find((a) => a.name === 'SHA256SUMS');
	return {
		tag: r.tag_name,
		version: versionOf(r.tag_name) ?? r.tag_name,
		prerelease: r.prerelease,
		published: r.published_at ?? '',
		page: r.html_url,
		sums: sumsAsset?.browser_download_url ?? '',
		files
	};
}
