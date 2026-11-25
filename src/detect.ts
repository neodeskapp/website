// Which download the download page recommends: the visitor's system, and the processor
// where the browser tells it. Both functions run in the visitor's browser: the build puts
// their source into the page's script (src/download.ts), so they are written in plain
// ES5, use nothing outside themselves and hold no comments inside. Tests are in
// test/download.test.ts.
//
// What a browser tells:
// - navigator.userAgentData (Chrome, Edge, Opera): the platform and whether it is a phone,
//   and on request the processor's architecture ("arm" or "x86"). It is the only way to
//   learn a Mac's processor, or the processor of Windows on ARM in Chrome and Edge.
// - The user agent string: the system. Safari and Firefox on a Mac say "Intel Mac OS X"
//   on every Mac, so there the processor stays unknown. Windows says ARM64 only in some
//   browsers, so x64 is a guess there. Firefox on Linux names the real processor, and
//   some Linux browsers name the distribution (Ubuntu, Fedora).
// - maxTouchPoints: an iPad asks for desktop pages and says "Macintosh"; a Mac has no
//   touch screen, so a touch screen there means an iPad.

export interface Seen {
	userAgent: string;
	/** navigator.userAgentData's low-entropy values, plus architecture once getHighEntropyValues answered */
	hints?: { platform?: string; mobile?: boolean; architecture?: string } | null;
	/** navigator.maxTouchPoints */
	touchPoints?: number;
}

export interface System {
	os: 'windows' | 'macos' | 'linux' | 'phone' | 'other';
	arch: 'x64' | 'arm64' | null;
	/** Whether the browser said the processor, rather than the page guessing it */
	archSure: boolean;
	/** The Linux package family the user agent names, if any */
	linux: 'deb' | 'rpm' | 'suse' | null;
}

export function detectSystem(seen: Seen): System {
	var ua = seen.userAgent || '';
	var h = seen.hints || {};
	var platform = String(h.platform || '').toLowerCase();
	var hintArch = String(h.architecture || '').toLowerCase();
	var arch: System['arch'] = hintArch.indexOf('arm') === 0 ? 'arm64' : hintArch === 'x86' ? 'x64' : null;
	var archSure = arch !== null;
	var none: System = { os: 'other', arch: null, archSure: false, linux: null };
	if (/iPhone|iPad|iPod|Android|Windows Phone/i.test(ua) || h.mobile === true || platform === 'android' || platform === 'ios') {
		return { os: 'phone', arch: null, archSure: false, linux: null };
	}
	if (/Macintosh/.test(ua) && (seen.touchPoints || 0) > 1) return { os: 'phone', arch: null, archSure: false, linux: null };
	if (/CrOS/.test(ua) || platform === 'chrome os' || platform === 'chromeos') return none;
	if (platform === 'windows' || /Windows NT/.test(ua)) {
		if (!arch && /ARM64|aarch64/i.test(ua)) {
			arch = 'arm64';
			archSure = true;
		}
		return { os: 'windows', arch: arch || 'x64', archSure: archSure, linux: null };
	}
	if (platform === 'macos' || /Macintosh|Mac OS X/.test(ua)) return { os: 'macos', arch: arch, archSure: archSure, linux: null };
	if (platform === 'linux' || /Linux|X11/.test(ua)) {
		if (!arch) {
			if (/aarch64|arm64|armv8/i.test(ua)) arch = 'arm64';
			else if (/x86_64|amd64|x64/i.test(ua)) arch = 'x64';
			else if (/i[3-6]86|armv[67]/i.test(ua)) return none;
			archSure = arch !== null;
		}
		var family: System['linux'] = /SUSE/i.test(ua) ? 'suse' : /Ubuntu|Debian|Mint|Pop!_OS|elementary/i.test(ua) ? 'deb' : /Fedora|Red Hat|CentOS|Rocky|Alma/i.test(ua) ? 'rpm' : null;
		return { os: 'linux', arch: arch || 'x64', archSure: archSure, linux: family };
	}
	return none;
}

/**
 * The recommendation for a system, as the key of one of the page's prepared blocks:
 * windows-x64, windows-arm64, windows-guess (x64, with a line for ARM), macos-arm64,
 * macos-x64, macos (processor unknown: both files), linux-deb-x64 and the like, linux-x64
 * and linux-arm64 (family unknown: deb and rpm), phone, other (pick your system).
 */
export function recommendationOf(system: System): string {
	if (system.os === 'windows') return system.arch === 'arm64' ? 'windows-arm64' : system.archSure ? 'windows-x64' : 'windows-guess';
	if (system.os === 'macos') return system.arch ? 'macos-' + system.arch : 'macos';
	if (system.os === 'linux') return 'linux-' + (system.linux ? system.linux + '-' : '') + (system.arch || 'x64');
	return system.os === 'phone' ? 'phone' : 'other';
}

/** Every key recommendationOf can give; the page has a block for each */
export const RECOMMENDATIONS = [
	'windows-x64',
	'windows-arm64',
	'windows-guess',
	'macos-arm64',
	'macos-x64',
	'macos',
	...(['deb', 'rpm', 'suse'] as const).flatMap((f) => [`linux-${f}-x64`, `linux-${f}-arm64`]),
	'linux-x64',
	'linux-arm64',
	'phone',
	'other'
];
