// Checks that commands in the docs can be copied as they are: each command the
// reader runs is in a fenced block with a language, no block has a shell prompt,
// and placeholders are written one way, <lower-case-with-hyphens>, with a line
// next to the block that says what to put in.
import type { Token } from 'markdown-it';

/** A placeholder as the docs write it: <server-address>. */
export const PLACEHOLDER = /<([a-z][a-z0-9]*(?:-[a-z0-9]+)*)>/g;

// Blocks of these languages hold commands or settings the reader types or pastes
const PASTED = new Set(['fstab', 'bash', 'sh', 'shell', 'powershell', 'ps1', 'ini', 'env', 'yaml', 'yml', 'nginx', 'conf', 'caddy', 'json', 'sql', 'dockerfile']);
// Blocks of these languages are shell commands
const SHELL = new Set(['bash', 'sh', 'shell', 'powershell', 'ps1']);
// Blocks of these languages are code, where < and > belong to the language
const CODE = new Set(['js', 'javascript', 'ts', 'typescript', 'python', 'go', 'html', 'xml', 'svelte', 'rust', 'mts']);

interface Style {
	re: RegExp;
	what: string;
	/** Only in blocks the reader pastes, not in output or prose */
	pastedOnly?: boolean;
	/** Only in shell blocks: in a JSON answer "..." stands for text left out */
	shellOnly?: boolean;
	/** Only in inline code, such as the option tables */
	inlineOnly?: boolean;
}

/** Placeholder styles other than <name-with-hyphens>, and made-up values that stand in for one. */
const OTHER_STYLES: Style[] = [
	{ re: /<(?![a-z][a-z0-9]*(?:-[a-z0-9]+)*>)[A-Za-z0-9][\w .-]*>/g, what: 'a placeholder not written as <lower-case-with-hyphens>' },
	{ re: /\bYOUR_[A-Z_]+|\bYour[A-Z]\w+|\byour[-_][a-z][\w-]*/g, what: 'a "your-..." placeholder' },
	{ re: /\/\{[a-z_]+\}/g, what: 'a {name} path parameter' },
	{ re: /\/path\/to\//g, what: 'a /path/to/ placeholder' },
	{ re: /:\/\/[^\s:/@]+:[A-Z][A-Z_]+@/g, what: 'an upper-case password in a URL' },
	{ re: /\b(?:change|choose|replace)-(?:this|a|me)[\w-]*/g, what: 'a made-up value' },
	{ re: /(?:^|\s)--?[a-zA-Z][\w-]*\s+[A-Z][A-Z_]{2,}\b(?!=)/gm, what: 'an upper-case placeholder after a flag', inlineOnly: true },
	{ re: /(?:=|"|')\.\.\.(?="|'|\s|$)/gm, what: '"..." as a value', shellOnly: true },
	{ re: /\b[\w.-]*\bexample\.(?:com|org|net)\b/g, what: 'an example.com address', pastedOnly: true },
	{ re: /\b(?:192\.0\.2|198\.51\.100|203\.0\.113)\.\d+\b|\b192\.168\.\d+\.\d+\b/g, what: 'an example IP address', pastedOnly: true }
];

/** A shell prompt at the start of a line: "$ ", "PS C:\> ", "C:\> ". */
const PROMPT = /^\s*(?:\$ |PS [A-Z]:\\[^>]*> ?|[A-Z]:\\[^>]*> )/m;

/** An inline code span that is a command with arguments. */
const COMMAND =
	/^(?:sudo|docker|curl|systemctl|journalctl|git|npm|npx|go|nc|bash|sh|pnpm|psql|pg_dump|openssl|certbot|ufw|netsh|ssh|scp|python3?|pip|apt(?:-get)?|dnf|tar|mount|winget|neodesk(?:-server)?(?:\.exe)?|\.\\\S+|\.\/\S+|(?:Get|Set|Start|Stop|Restart|New|Invoke)-[A-Z]\w+)\s+\S/;
// A command the text tells the reader to run: right after "run", "with", "for example",
// a colon, or "On Linux," and the like. A command named as a reference, such as
// "`go build` embeds", "and runs `x`" or "the `docker compose` commands", stays inline.
const INSTRUCTION = /(?:\b[Rr]un|\b[Ww]ith|\b[Ee]xample|:|\b(?:Linux|Windows|Docker|macOS),)\s*$/;
const REFERENCE_AFTER = /^(?:\s+commands?\b|\s+as shown\b|'s\b)/;
// A command as the subject of its sentence: "`docker compose ps` shows the container as healthy"
const SUBJECT =
	/^\s*(?:\([^)]*\)\s*)?(?:in `[^`]*`\s*)?(?:also\s+|then\s+|only\s+)?(?:shows|lists|prints|is|are|checks|does|doesn't|opens|writes|copies|starts|stops|fails|runs|reads|sets|builds|takes|answers|works|deletes|removes|keeps|pulls|returns|gives|has|tests|asks|sends|makes|needs|exits|leaves|installs|updates|restores|creates|downloads|accepts|uses|calls|loads|waits|puts|turns|moves|adds|names|recreates|parses|marks|embeds|skips|passes|gets)\b/;

/** A block marked "quoted" (```powershell quoted) is exactly what NeoDesk prints, with NeoDesk's own placeholders. */
const isQuoted = (t: Token) => /\squoted\b/.test(t.info);

export interface CommandProblem {
	line: number;
	message: string;
}

// Inline tokens in tables carry no line, so the last line seen stands in
let lastLine = 0;
const lineOf = (t: Token) => (lastLine = t.map ? t.map[0] + 1 : lastLine);

/** The text of the paragraph or list item before and after a block, for the placeholder line. */
function textAround(tokens: Token[], i: number): string {
	const before: string[] = [];
	for (let k = i - 1; k >= 0 && before.length < 1; k--) if (tokens[k].type === 'inline') before.push(tokens[k].content);
	const after: string[] = [];
	for (let k = i + 1; k < tokens.length && after.length < 1; k++) if (tokens[k].type === 'inline') after.push(tokens[k].content);
	return [...before, ...after].join('\n');
}

const asText = (kids: Token[]) => kids.map((n) => (n.type === 'code_inline' ? '`' + n.content + '`' : n.content)).join('');

/**
 * quotedPage: the page quotes NeoDesk's own help text (front matter `quoted: true`, the
 * generated command reference), so its inline code is NeoDesk's syntax as the command line
 * prints it, `--file PATH` and `GET /api/devices/{id}` included, and is not held to the
 * placeholder rule. Its blocks still are, unless they are marked quoted themselves.
 */
export function checkCommands(tokens: Token[], { quotedPage = false }: { quotedPage?: boolean } = {}): CommandProblem[] {
	const problems: CommandProblem[] = [];
	let inTable = 0;
	let inHeading = false;
	lastLine = 0;
	// What quoted blocks print may be named as it is in the text
	const quoted = new Set<string>();
	for (const t of tokens) {
		if (t.type === 'fence' && isQuoted(t)) for (const style of OTHER_STYLES) for (const m of t.content.matchAll(style.re)) quoted.add(m[0]);
	}
	for (let i = 0; i < tokens.length; i++) {
		const t = tokens[i];
		lineOf(t);
		if (t.type === 'table_open') inTable++;
		else if (t.type === 'table_close') inTable--;
		else if (t.type === 'heading_open') inHeading = true;
		else if (t.type === 'heading_close') inHeading = false;
		else if (t.type === 'fence') {
			const lang = t.info.trim().split(/\s+/)[0].toLowerCase();
			const code = t.content;
			if (PROMPT.test(code)) problems.push({ line: lineOf(t), message: `a ${lang || 'code'} block starts a line with a shell prompt; leave it out so the block can be pasted` });
			if (CODE.has(lang) || isQuoted(t)) continue;
			const pasted = PASTED.has(lang);
			for (const style of OTHER_STYLES) {
				if (style.inlineOnly || (style.pastedOnly && !pasted) || (style.shellOnly && !SHELL.has(lang))) continue;
				for (const m of code.matchAll(style.re)) problems.push({ line: lineOf(t), message: `${style.what} in a ${lang} block: "${m[0]}"; write placeholders as <server-address>` });
			}
			if (!pasted) continue;
			const around = textAround(tokens, i);
			const names = new Set([...code.matchAll(PLACEHOLDER)].map((m) => m[0]));
			for (const name of names) {
				// Named in a code span of the text around it, alone or as part of a path
				const named = around.split('`').some((part, n) => n % 2 === 1 && part.includes(name));
				if (!named) problems.push({ line: lineOf(t), message: `the ${lang} block has ${name}, and the text right before or after it doesn't say what to put in for \`${name}\`` });
			}
		} else if (t.type === 'inline') {
			const kids = t.children ?? [];
			kids.forEach((c, k) => {
				if (c.type !== 'code_inline') return;
				for (const style of quotedPage ? [] : OTHER_STYLES) {
					if (style.pastedOnly || style.shellOnly) continue;
					for (const m of c.content.matchAll(style.re)) {
						if (!quoted.has(m[0])) problems.push({ line: lineOf(t), message: `${style.what} in \`${c.content}\`; write placeholders as <server-address>` });
					}
				}
				if (inTable || inHeading || !COMMAND.test(c.content)) return;
				// Bold labels such as "**Web UI CI: `npm audit`.**" name a command
				const opened = kids.slice(0, k).filter((n) => n.type === 'strong_open').length;
				const closed = kids.slice(0, k).filter((n) => n.type === 'strong_close').length;
				const before = asText(kids.slice(0, k)).split(/(?<=[.;!?])\s+/).pop() ?? '';
				const after = asText(kids.slice(k + 1));
				if (opened > closed || !INSTRUCTION.test(before) || REFERENCE_AFTER.test(after) || SUBJECT.test(after)) return;
				problems.push({ line: lineOf(t), message: `the command \`${c.content}\` is inline; put it in a fenced block of its own` });
			});
		}
	}
	return problems;
}
