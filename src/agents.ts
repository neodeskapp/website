// What llms.txt tells AI agents first. This is build-time data: the build publishes an
// entry only when it is true of NeoDesk today.

export interface InstallLine {
	/** What this install gives you, in a few words */
	label: string;
	command: string;
	/** The docs page that explains it, without .md */
	docs: string;
}

/** The one-line installs, as the docs pages they link to give them. */
export const ONE_LINE_INSTALLS: InstallLine[] = [
	{
		label: 'Docker: the server and the web console in one container, from the published image',
		command: 'curl -fsSL https://raw.githubusercontent.com/neodeskapp/neodesk/main/install.sh | sudo bash',
		docs: '/docs/getting-started/docker'
	},
	{
		label: 'Linux: one systemd service. Piped into bash like this, the script asks nothing and installs with the defaults',
		command: 'curl -fsSL https://raw.githubusercontent.com/neodeskapp/neodesk/main/neodesk.sh | sudo bash',
		docs: '/docs/getting-started/linux'
	}
];

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
		summary: 'TODO when it ships: what the token may do and how to make one.',
		available: false
	},
	{
		id: 'describe-json',
		name: '`neodesk describe --json`',
		summary: 'TODO when it ships: what the command prints.',
		available: false
	},
	{
		id: 'mcp',
		name: '`neodesk mcp`',
		summary: 'TODO when it ships: what the MCP server offers and how a client starts it.',
		available: false
	}
];
