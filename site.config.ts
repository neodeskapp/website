// What the build needs to know about the site. Content is in content/docs.
import type { SiteConfig } from './src/types.ts';

const config: SiteConfig = {
	name: 'NeoDesk',
	// Where the site is served. SITE_URL overrides it for another host, such as the beta.
	url: 'https://neode.sk',
	repo: 'https://github.com/neodeskapp/neodesk',
	// For the home page's structured data: the license text and where releases are
	license: 'https://www.gnu.org/licenses/agpl-3.0.html',
	downloadUrl: 'https://github.com/neodeskapp/neodesk/releases',
	// The current NeoDesk version comes from the repository's VERSION file at build
	// time (ND_VERSION overrides it). This one is used, with a warning, when it cannot be fetched.
	versionUrl: 'https://raw.githubusercontent.com/neodeskapp/neodesk/main/VERSION',
	version: '3.6.2',
	// "Edit on GitHub" appears on docs pages once this points at the folder that holds
	// content/docs in a repository, for example
	// https://github.com/neodeskapp/website/edit/main/content/docs
	editBase: '',
	// AI crawlers that robots.txt on neode.sk names as allowed, next to the allow-all,
	// as each vendor's own crawler page spells them. Other hosts, such as the beta,
	// get the allow-all only, and every page there says noindex.
	aiCrawlers: [
		'GPTBot', // OpenAI: developers.openai.com/api/docs/bots
		'OAI-SearchBot',
		'ChatGPT-User',
		'ClaudeBot', // Anthropic: support.claude.com, "Does Anthropic crawl data from the web"
		'Claude-User',
		'Claude-SearchBot',
		'PerplexityBot', // Perplexity: docs.perplexity.ai/guides/bots
		'Perplexity-User',
		'Google-Extended', // Google: developers.google.com, Google's common crawlers
		'Applebot-Extended', // Apple: support.apple.com/en-us/119829
		'CCBot', // Common Crawl: commoncrawl.org/ccbot
		'Bytespider', // ByteDance: no crawler page of its own found; the name crawler lists use
		'meta-externalagent' // Meta: developers.facebook.com, web crawlers
	],
	summary:
		'NeoDesk is a remote desktop server you run yourself. It speaks the RustDesk protocol, so the normal RustDesk client connects to it, and one Go binary serves the ID server, the relay, the client API and a web console for the devices you look after. It is open source under AGPL-3.0.',
	// The docs sections in sidebar order. `intro` is the paragraph on the section's own page.
	sections: [
		{
			slug: 'getting-started',
			label: 'Getting started',
			intro: 'Start here. What NeoDesk is, installing it with Docker, on Linux or on Windows, signing in for the first time and connecting the first RustDesk client.'
		},
		{
			slug: 'console',
			label: 'Using the console',
			intro: 'The web console page by page: the overview, the device list, adding a computer with an invite, a device\'s details and how to connect to it, enrollment requests, quick support, remote desktop in the browser and the activity log.',
			description: 'The web console page by page: devices, adding a computer, enrollment, quick support, remote desktop in the browser and the activity log.'
		},
		{
			slug: 'people',
			label: 'People and sign-in',
			intro: 'Who can sign in and what they can do: users, roles and permissions, two-factor sign-in, LDAP or Active Directory, single sign-on with OIDC, and organizations.',
			description: 'Who can sign in and what they can do: users, roles, permissions, two-factor sign-in, LDAP or Active Directory, OIDC and organizations.'
		},
		{
			slug: 'operations',
			label: 'Running the server',
			intro: 'For the person who runs the server: configuration, ports and firewall, a reverse proxy with TLS, PostgreSQL, updating, backup and troubleshooting.'
		},
		{
			slug: 'development',
			label: 'Development',
			intro: 'For people who work on NeoDesk or build on it: contributing, building from source, the tests and checks, how the code fits together, releases, and the APIs and protocols.',
			description: 'For people who work on NeoDesk or build on it: contributing, building, tests, how the code fits together, releases, APIs and protocols.'
		},
		{
			slug: 'project',
			label: 'The project',
			intro: 'The license and the Commercial Grant, what the project does with your data, and the sponsors and contributors behind it.'
		}
	]
};

export default config;
