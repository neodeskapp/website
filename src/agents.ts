// What llms.txt tells AI agents first. This is build-time data: the build publishes an
// entry only when it is true of NeoDesk today.

// The one-line installs come from src/install.ts, the same list the home page uses.

export interface AgentTool {
	id: string;
	/** The name as llms.txt will show it */
	name: string;
	/** One sentence on what it does, for llms.txt */
	summary: string;
	/**
	 * false until the tool ships. The build leaves an unavailable tool out of every
	 * published file, and refuses an available one without a docs page.
	 */
	available: boolean;
	/** The docs page that documents the tool, without .md; required once available */
	docs?: string;
}

/**
 * Places for agent tools that do not exist yet. Nothing here is published while
 * `available` is false. Fill in `summary` and `docs` from the shipped tool, then set
 * `available` to true; the "For AI agents" section of llms.txt then lists it.
 */
export const AGENT_TOOLS: AgentTool[] = [
	{
		id: 'scoped-token',
		name: 'Scoped API token for agents',
		summary:
			'An admin makes it in the console under the account menu, API tokens: read only or read and write, with only the permissions picked for it and never more than its account, for at most a year, and optionally only from some addresses.',
		available: true,
		docs: '/docs/command-line/api-tokens'
	},
	{
		id: 'describe-json',
		name: '`neodesk describe --json`',
		summary:
			'Prints every command of the neodesk command line as JSON: its arguments and flags, the permission it needs, whether it only reads, deletes something, runs something or answers with secrets, and the console route it calls.',
		available: true,
		docs: '/docs/command-line/neodesk'
	},
	{
		id: 'mcp',
		name: '`neodesk mcp`',
		summary:
			'Serves the commands of the neodesk command line as MCP tools over standard input and output, with an API token: only the commands that read, unless `--allow-writes`, `--allow-exec` and `--allow-secrets` add more.',
		available: true,
		docs: '/docs/command-line/reference'
	}
];
