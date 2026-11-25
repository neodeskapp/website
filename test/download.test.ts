// Tests of the download page's two decisions: which release it offers (src/client-release.ts)
// and which file it recommends for the visitor's system (src/detect.ts).   npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickRelease, fileOf, parseSums, compareTags } from '../src/client-release.ts';
import { detectSystem, recommendationOf, RECOMMENDATIONS } from '../src/detect.ts';
import type { Seen } from '../src/detect.ts';

/* ---------- which release ---------- */

const rel = (tag: string, prerelease: boolean, published: string | null = '2026-11-24T00:00:00Z', draft = false) => ({ tag, prerelease, published, draft });

test('only release candidates: the newest candidate, no preview', () => {
	const out = pickRelease([rel('desktop-v1.5.0-rc.4', true), rel('desktop-v1.5.0-rc.7', true), rel('desktop-v1.5.0-rc.6', true)]);
	assert.equal(out.main?.tag, 'desktop-v1.5.0-rc.7');
	assert.equal(out.preview, null);
});

test('a final release and a newer candidate: the final one, the candidate as preview', () => {
	const out = pickRelease([rel('desktop-v1.6.0-rc.1', true), rel('desktop-v1.5.0', false), rel('desktop-v1.5.0-rc.7', true)]);
	assert.equal(out.main?.tag, 'desktop-v1.5.0');
	assert.equal(out.preview?.tag, 'desktop-v1.6.0-rc.1');
});

test('a final release and only older candidates: the final one, no preview', () => {
	const out = pickRelease([rel('desktop-v1.5.0-rc.7', true), rel('desktop-v1.5.0', false)]);
	assert.equal(out.main?.tag, 'desktop-v1.5.0');
	assert.equal(out.preview, null);
});

test('a final release only', () => {
	const out = pickRelease([rel('desktop-v1.5.0', false), rel('desktop-v1.4.2', false)]);
	assert.equal(out.main?.tag, 'desktop-v1.5.0');
	assert.equal(out.preview, null);
});

test('nothing published: neither', () => {
	assert.deepEqual(pickRelease([]), { main: null, preview: null });
	const out = pickRelease([rel('desktop-v1.6.0', false, null), rel('desktop-v1.7.0', false, '2026-11-24T00:00:00Z', true), rel('support-v1.5.0', false), rel('v3.6.0', false)]);
	assert.deepEqual(out, { main: null, preview: null });
});

test('versions compare as numbers, rc.10 after rc.9', () => {
	assert.ok(compareTags('desktop-v1.5.0-rc.10', 'desktop-v1.5.0-rc.9') > 0);
	assert.ok(compareTags('desktop-v1.10.0', 'desktop-v1.9.0') > 0);
	assert.ok(compareTags('desktop-v1.5.0', 'desktop-v1.5.0-rc.9') > 0);
	assert.equal(pickRelease([rel('desktop-v1.5.0-rc.9', true), rel('desktop-v1.5.0-rc.10', true)]).main?.tag, 'desktop-v1.5.0-rc.10');
});

test('the files of a release by name', () => {
	assert.deepEqual(fileOf('neodesk-1.5.0-rc.7-windows-x86_64.exe'), { os: 'windows', arch: 'x64', kind: 'exe' });
	assert.deepEqual(fileOf('neodesk-1.5.0-rc.7-windows-aarch64.msi'), { os: 'windows', arch: 'arm64', kind: 'msi' });
	assert.deepEqual(fileOf('neodesk-1.5.0-rc.7-windows-x86_64.tar.gz'), { os: 'windows', arch: 'x64', kind: 'portable' });
	assert.deepEqual(fileOf('neodesk-1.5.0-rc.7-macos-aarch64.dmg'), { os: 'macos', arch: 'arm64', kind: 'dmg' });
	assert.deepEqual(fileOf('neodesk-1.5.0-rc.7-macos-x86_64-portable.zip'), { os: 'macos', arch: 'x64', kind: 'portable' });
	assert.deepEqual(fileOf('neodesk-1.5.0-rc.7-linux-aarch64.deb'), { os: 'linux', arch: 'arm64', kind: 'deb' });
	assert.deepEqual(fileOf('neodesk-1.5.0-rc.7-linux-x86_64.rpm'), { os: 'linux', arch: 'x64', kind: 'rpm' });
	assert.deepEqual(fileOf('neodesk-1.5.0-rc.7-linux-x86_64-suse.rpm'), { os: 'linux', arch: 'x64', kind: 'suse' });
	assert.deepEqual(fileOf('neodesk-1.5.0-rc.7-linux-aarch64-portable.tar.gz'), { os: 'linux', arch: 'arm64', kind: 'portable' });
	for (const other of ['neodesk-template-x86_64.msi', 'SHA256SUMS', 'neodesk-desktop-manifest.json', 'generator-templates-1.5.0-rc.7.tar.gz']) assert.equal(fileOf(other), null, other);
});

test('SHA256SUMS lines', () => {
	const sums = parseSums('ef03b3f019ba579a7f3eff4a608c90ae3e6e00b46abbea737e5055b412ebe72a  neodesk-1.5.0-rc.7-windows-x86_64.exe\r\nnot a line\n');
	assert.equal(sums.get('neodesk-1.5.0-rc.7-windows-x86_64.exe'), 'ef03b3f019ba579a7f3eff4a608c90ae3e6e00b46abbea737e5055b412ebe72a');
	assert.equal(sums.size, 1);
});

/* ---------- which file ---------- */

const CHROME_WIN = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const EDGE_WIN = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0';
const FIREFOX_WIN = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0';
const SAFARI_MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15';
const CHROME_MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const FIREFOX_MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:133.0) Gecko/20100101 Firefox/133.0';
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1';
const ANDROID_PHONE = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';
const ANDROID_TABLET = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const FIREFOX_UBUNTU = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0';
const FIREFOX_FEDORA = 'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0';
const FIREFOX_LINUX_ARM = 'Mozilla/5.0 (X11; Linux aarch64; rv:133.0) Gecko/20100101 Firefox/133.0';
const CHROME_LINUX = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const CHROMIUM_PI32 = 'Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const CHROMEBOOK = 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const CASES: [string, Seen, string][] = [
	// Windows: the processor is sure only where userAgentData tells it
	['Chrome on Windows, no architecture yet', { userAgent: CHROME_WIN, hints: { platform: 'Windows', mobile: false } }, 'windows-guess'],
	['Chrome on Windows x64', { userAgent: CHROME_WIN, hints: { platform: 'Windows', mobile: false, architecture: 'x86' } }, 'windows-x64'],
	['Edge on Windows on ARM', { userAgent: EDGE_WIN, hints: { platform: 'Windows', mobile: false, architecture: 'arm' } }, 'windows-arm64'],
	['Firefox on Windows', { userAgent: FIREFOX_WIN }, 'windows-guess'],
	['a Windows user agent that names ARM64', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; ARM64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' }, 'windows-arm64'],
	// macOS: Safari and Firefox never tell the processor
	['Safari on a Mac', { userAgent: SAFARI_MAC, touchPoints: 0 }, 'macos'],
	['Firefox on a Mac', { userAgent: FIREFOX_MAC }, 'macos'],
	['Chrome on a Mac, no architecture yet', { userAgent: CHROME_MAC, hints: { platform: 'macOS', mobile: false } }, 'macos'],
	['Chrome on an Apple silicon Mac', { userAgent: CHROME_MAC, hints: { platform: 'macOS', mobile: false, architecture: 'arm' } }, 'macos-arm64'],
	['Chrome on an Intel Mac', { userAgent: CHROME_MAC, hints: { platform: 'macOS', mobile: false, architecture: 'x86' } }, 'macos-x64'],
	// Linux
	['Firefox on Ubuntu', { userAgent: FIREFOX_UBUNTU }, 'linux-deb-x64'],
	['Firefox on Fedora', { userAgent: FIREFOX_FEDORA }, 'linux-rpm-x64'],
	['Firefox on ARM Linux', { userAgent: FIREFOX_LINUX_ARM }, 'linux-arm64'],
	['Chrome on Linux x64', { userAgent: CHROME_LINUX, hints: { platform: 'Linux', mobile: false, architecture: 'x86' } }, 'linux-x64'],
	['Chrome on ARM Linux', { userAgent: CHROME_LINUX, hints: { platform: 'Linux', mobile: false, architecture: 'arm' } }, 'linux-arm64'],
	['Chromium on 32-bit Raspberry Pi OS', { userAgent: CHROMIUM_PI32 }, 'other'],
	// Phones and tablets
	['Safari on an iPhone', { userAgent: IPHONE, touchPoints: 5 }, 'phone'],
	['Safari on an iPad, which asks for the desktop page', { userAgent: SAFARI_MAC, touchPoints: 5 }, 'phone'],
	['Chrome on an Android phone', { userAgent: ANDROID_PHONE, hints: { platform: 'Android', mobile: true } }, 'phone'],
	['Chrome on an Android tablet', { userAgent: ANDROID_TABLET, hints: { platform: 'Android', mobile: false } }, 'phone'],
	// Unknown
	['a Chromebook', { userAgent: CHROMEBOOK, hints: { platform: 'Chrome OS', mobile: false } }, 'other'],
	['no user agent', { userAgent: '' }, 'other'],
	['a crawler', { userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }, 'other']
];

for (const [name, seen, want] of CASES) {
	test(`recommends ${want} for ${name}`, () => assert.equal(recommendationOf(detectSystem(seen)), want));
}

test('a Linux family the user agent names picks its package', () => {
	assert.equal(recommendationOf({ os: 'linux', arch: 'arm64', archSure: true, linux: 'suse' }), 'linux-suse-arm64');
});

test('every recommendation has a block on the page', () => {
	for (const [, seen] of CASES) assert.ok(RECOMMENDATIONS.includes(recommendationOf(detectSystem(seen))));
});

test('the two functions work on their own, as the page runs them', () => {
	// The page's script holds their source text without the module around it
	const detect = new Function(`return ${detectSystem.toString()}`)() as typeof detectSystem;
	const recommend = new Function(`return ${recommendationOf.toString()}`)() as typeof recommendationOf;
	for (const [name, seen, want] of CASES) assert.equal(recommend(detect(seen)), want, name);
});
