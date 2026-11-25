// Where each page is served. The site has two hosts: the www host (neode.sk) with the
// home page and everything that is not docs, and the docs host (docs.neode.sk) with the
// docs, without /docs in the path. The beta keeps the docs under /docs on its own host,
// so it needs no second certificate; DOCS_URL, or config.docsUrl on production, says
// which.
//
// Inside the build every page keeps its logical address, the one it had when the docs
// lived under /docs: /docs/getting-started/docker/ and /de/docs/getting-started/docker/.
// `url` turns such an address into the one a visitor uses, and the logical address is
// also what the old links name, so the web server's redirects follow the same rule.
//
// One dist/ serves both hosts. The docs tree is dist/docs/, with each other language
// under it (dist/docs/de/...). The docs host's web server serves dist/docs/ as its root
// and the www host's /assets/, /fonts/, /img/, /og/ and llms files from dist/ (SHARED).
import { LOCALES } from './i18n.ts';

/** Folders and files of dist/ that the docs host serves from the www root. */
export const SHARED = /^\/(assets|fonts|img|og)\/|^\/llms(-[\w-]+)?\.txt$/;

const prefixes = LOCALES.filter((l) => l.prefix).map((l) => l.prefix.slice(1));
const LOGICAL_DOCS = new RegExp(`^(/(?:${prefixes.join('|')}))?/docs(/.*)?$`);

export interface Urls {
	/** The www host, without a trailing slash: https://neode.sk */
	www: string;
	/** Where the docs index is, without a trailing slash: https://docs.neode.sk, or https://beta.neode.sk/docs */
	docs: string;
	/** Whether the docs have a host of their own */
	separate: boolean;
	/** The address a visitor uses for a logical address of the site */
	url: (logical: string) => string;
	/** The file in dist/ for a logical address's file: de/docs/a/index.html is docs/de/a/index.html */
	distOf: (rel: string) => string;
	/** The address a file of dist/ is served at: docs/de/a/index.html is https://docs.neode.sk/de/a/ */
	urlOfFile: (rel: string) => string;
	/** The file of dist/ an address is served from, or null when it is outside the site */
	fileOfUrl: (url: string) => string | null;
	/** Whether a file of dist/ is a page of the docs host */
	isDocsFile: (rel: string) => boolean;
	/** The language code of a file of dist/, from its folder */
	localeOfFile: (rel: string) => string;
	/** A file of dist/ without its language folder: docs/de/a.md is docs/a.md, de/index.html is index.html */
	withoutLocale: (rel: string) => string;
	/** The same file in another language: docs/a.md in German is docs/de/a.md */
	inLanguage: (rel: string, prefix: string) => string;
}

export function makeUrls(www: string, docs: string): Urls {
	www = www.replace(/\/$/, '');
	docs = docs.replace(/\/$/, '');
	const separate = !docs.startsWith(`${www}/`);
	const url = (logical: string) => {
		const m = logical.match(LOGICAL_DOCS);
		return m ? `${docs}${m[1] ?? ''}${m[2] ?? '/'}` : `${www}${logical}`;
	};
	const distOf = (rel: string) => {
		const m = rel.match(LOGICAL_DOCS) ?? `/${rel}`.match(LOGICAL_DOCS);
		return m ? `docs${m[1] ?? ''}${m[2] ?? ''}`.replace(/\/$/, '') : rel;
	};
	const isDocsFile = (rel: string) => rel === 'docs' || rel.startsWith('docs/');
	const servedPath = (rel: string) => rel.replace(/(^|\/)index\.html$/, '$1');
	const urlOfFile = (rel: string) => (isDocsFile(rel) ? `${docs}/${servedPath(rel.slice(5))}` : `${www}/${servedPath(rel)}`);
	const fileOf = (p: string) => (p.endsWith('/') ? `${p.slice(1)}index.html` : decodeURIComponent(p.slice(1)));
	const fileOfUrl = (u: string) => {
		const clean = u.split('#')[0].split('?')[0];
		const under = (base: string) => clean === base || clean.startsWith(`${base}/`);
		if (under(docs)) {
			const p = clean.slice(docs.length) || '/';
			if (separate && SHARED.test(p)) return fileOf(p);
			return `docs/${fileOf(p)}`.replace(/\/$/, '');
		}
		if (under(www)) return fileOf(clean.slice(www.length) || '/');
		return null;
	};
	const localeOfFile = (rel: string) => {
		const inner = isDocsFile(rel) ? rel.slice(5) : rel;
		return LOCALES.find((l) => l.prefix && inner.startsWith(`${l.prefix.slice(1)}/`))?.code ?? LOCALES.find((l) => l.default)!.code;
	};
	const withoutLocale = (rel: string) => {
		for (const p of prefixes) {
			if (rel.startsWith(`docs/${p}/`)) return `docs/${rel.slice(p.length + 6)}`;
			if (rel.startsWith(`${p}/`)) return rel.slice(p.length + 1);
		}
		return rel;
	};
	const inLanguage = (rel: string, prefix: string) => {
		const p = prefix.replace(/^\//, '');
		if (!p) return rel;
		return isDocsFile(rel) ? `docs/${p}/${rel.slice(5)}` : `${p}/${rel}`;
	};
	return { www, docs, separate, url, distOf, urlOfFile, fileOfUrl, isDocsFile, localeOfFile, withoutLocale, inLanguage };
}
