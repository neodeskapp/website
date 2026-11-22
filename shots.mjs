// Retakes the console screenshots of the docs from shots.json, in light and dark.
//
//   ND_ADMIN_PASSWORD_FILE=<file> node shots.mjs            every shot
//   ND_ADMIN_PASSWORD_FILE=<file> node shots.mjs devices    only the named ones
//
// It signs in to a running console (ND_URL, default the "base" in shots.json)
// as ND_ADMIN_USER (default admin) with the password from ND_ADMIN_PASSWORD_FILE
// or ND_ADMIN_PASSWORD, and writes content/screenshots/<name>-<theme>.png.
// A run of every shot also deletes the screenshots shots.json no longer names.
// Playwright comes from PLAYWRIGHT_MODULE, or the playwright package installed next to this file.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const config = JSON.parse(fs.readFileSync(path.join(root, 'shots.json'), 'utf8'));
const OUT = path.join(root, 'content/screenshots');
const BASE = (process.env.ND_URL || config.base).replace(/\/$/, '');
const USER = process.env.ND_ADMIN_USER || 'admin';
const PASSWORD = process.env.ND_ADMIN_PASSWORD_FILE
	? fs.readFileSync(process.env.ND_ADMIN_PASSWORD_FILE, 'utf8').trim()
	: process.env.ND_ADMIN_PASSWORD || '';
if (!PASSWORD) {
	console.error('Set ND_ADMIN_PASSWORD_FILE (or ND_ADMIN_PASSWORD) to the console password of ' + USER);
	process.exit(2);
}

const only = process.argv.slice(2);
const shots = only.length ? config.shots.filter((s) => only.includes(s.name)) : config.shots;
for (const name of only) if (!config.shots.some((s) => s.name === name)) console.warn(`no shot named ${name}`);

async function signIn(context) {
	const page = await context.newPage();
	await page.goto(BASE + '/login');
	await page.locator('#username').fill(USER);
	await page.locator('input[type=password]').first().fill(PASSWORD);
	await page.locator('button[type=submit]').first().click();
	await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15000 });
	await page.close();
}

async function runStep(page, step) {
	const [kind] = Object.keys(step);
	const arg = step[kind];
	const at = (sel) => page.locator(sel).first();
	switch (kind) {
		case 'click': return at(arg).click();
		case 'fill': return at(arg[0]).fill(arg[1]);
		case 'select': return at(arg[0]).selectOption({ label: arg[1] });
		case 'press': return at(arg[0]).press(arg[1]);
		case 'hover': return at(arg).hover();
		case 'scroll': return at(arg).evaluate((el) => el.scrollIntoView({ block: 'start' }));
		case 'waitFor': return at(arg).waitFor({ state: 'visible', timeout: 15000 });
		case 'wait': return page.waitForTimeout(arg);
		default: throw new Error(`unknown step ${kind}`);
	}
}

// Draws the annotations on top of the page: a box around the target, or an
// arrow pointing at it, each with a short label.
function draw({ items, theme }) {
	const color = theme === 'dark' ? '#a3e635' : '#4d8f06';
	const ink = theme === 'dark' ? '#141616' : '#ffffff';
	const layer = document.createElement('div');
	layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483647';
	// In the page from the start, so the labels can be measured
	document.body.appendChild(layer);
	const vw = window.innerWidth, vh = window.innerHeight;
	const label = (text, x, y) => {
		const el = document.createElement('div');
		el.textContent = text;
		el.style.cssText = `position:absolute;left:${x}px;top:${y}px;background:${color};color:${ink};font:600 15px/1.2 "IBM Plex Sans",system-ui,sans-serif;padding:6px 11px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.25)`;
		layer.appendChild(el);
		const r = el.getBoundingClientRect();
		el.style.left = Math.max(8, Math.min(x, vw - r.width - 8)) + 'px';
		el.style.top = Math.max(8, Math.min(y, vh - r.height - 8)) + 'px';
		return el.getBoundingClientRect();
	};
	for (const { type, box: b, text, side } of items) {
		if (type === 'box') {
			const pad = 6;
			const el = document.createElement('div');
			el.style.cssText = `position:absolute;left:${b.x - pad}px;top:${b.y - pad}px;width:${b.width + 2 * pad}px;height:${b.height + 2 * pad}px;border:3px solid ${color};border-radius:12px;box-sizing:border-box`;
			layer.appendChild(el);
			if (side === 'left') {
				// Measured first, then moved next to the box's left edge
				const r = label(text, 0, 0);
				label(text, b.x - pad - r.width - 12, b.y + b.height / 2 - r.height / 2);
				layer.removeChild(layer.children[layer.children.length - 2]);
			} else {
				label(text, b.x - pad, side === 'above' ? b.y - pad - 40 : b.y + b.height + pad + 8);
			}
		} else {
			// The label sits away from the target; the arrow runs from it to the target's edge
			const below = side !== 'above';
			const tx = b.x + b.width / 2, ty = below ? b.y + b.height + 4 : b.y - 4;
			const r = label(text, tx - 160, below ? ty + 90 : ty - 120);
			const sx = Math.min(Math.max(tx, r.left + 20), r.right - 20), sy = below ? r.top - 4 : r.bottom + 4;
			const ns = 'http://www.w3.org/2000/svg';
			const svg = document.createElementNS(ns, 'svg');
			svg.setAttribute('width', vw); svg.setAttribute('height', vh);
			svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
			svg.innerHTML = `<defs><marker id="bd-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${color}"/></marker></defs><line x1="${sx}" y1="${sy}" x2="${tx}" y2="${ty}" stroke="${color}" stroke-width="4" stroke-linecap="round" marker-end="url(#bd-head)"/>`;
			layer.insertBefore(svg, layer.firstChild);
		}
	}
}

async function take(context, shot, theme) {
	const page = await context.newPage();
	await page.goto(BASE + shot.path);
	await page.waitForLoadState('load');
	await page.waitForTimeout(1200);
	for (const step of shot.steps || []) await runStep(page, step);
	// No text cursor or hover state in the picture
	await page.mouse.move(0, 799);
	await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
	if (shot.annotations?.length) {
		const items = [];
		for (const a of shot.annotations) {
			const box = await page.locator(a.target).first().boundingBox();
			if (!box) throw new Error(`${shot.name}: annotation target not visible: ${a.target}`);
			items.push({ type: a.type, box, text: a.label, side: a.side });
		}
		await page.evaluate(draw, { items, theme });
	}
	const file = path.join(OUT, `${shot.name}-${theme}.png`);
	await page.screenshot({ path: file });
	await page.close();
	console.log('wrote', path.relative(root, file));
}

const browser = await chromium.launch();
let failed = 0;
try {
	for (const theme of ['light', 'dark']) {
		const options = { viewport: config.viewport, deviceScaleFactor: config.scale, colorScheme: theme, locale: 'en-US', timezoneId: 'Europe/Berlin' };
		const signedIn = await browser.newContext(options);
		await signIn(signedIn);
		const anonymous = await browser.newContext(options);
		for (const shot of shots) {
			try {
				await take(shot.signedIn === false ? anonymous : signedIn, shot, theme);
			} catch (err) {
				failed++;
				console.error(`${shot.name} (${theme}): ${err.message.split('\n')[0]}`);
			}
		}
		await signedIn.close();
		await anonymous.close();
	}
} finally {
	await browser.close();
}

if (!only.length && !failed) {
	const keep = new Set(config.shots.flatMap((s) => [`${s.name}-light.png`, `${s.name}-dark.png`]));
	for (const f of fs.readdirSync(OUT)) {
		if (f.endsWith('.png') && !keep.has(f)) {
			fs.unlinkSync(path.join(OUT, f));
			console.log('deleted', f);
		}
	}
}
process.exit(failed ? 1 : 0);
