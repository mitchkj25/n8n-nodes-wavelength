import type { INodeProperties } from 'n8n-workflow';

const showFor = (operation: string[]) => ({ show: { resource: ['flow'], operation } });

export const flowOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['flow'] } },
		default: 'generate',
		options: [
			{
				name: 'Add Notes',
				value: 'addNotes',
				action: 'Add notes to a flow',
				description: 'Add new notes or transcript text to a flow with AI',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a flow',
				description: 'Create a flow from your own nodes and edges',
			},
			{ name: 'Delete', value: 'delete', action: 'Delete a flow' },
			{ name: 'Duplicate', value: 'duplicate', action: 'Duplicate a flow' },
			{
				name: 'Edit With AI',
				value: 'editWithAi',
				action: 'Edit a flow with AI',
				description: 'Change a flow from a plain instruction',
			},
			{
				name: 'Export',
				value: 'export',
				action: 'Export a flow',
				description: 'Export a flow as Mermaid, SVG, draw.io, or JSON',
			},
			{
				name: 'Generate From Text',
				value: 'generate',
				action: 'Generate a flow from text',
				description: 'Turn a transcript, call notes, or a description into a new flow with AI',
			},
			{ name: 'Get', value: 'get', action: 'Get a flow' },
			{ name: 'Get Many', value: 'getAll', action: 'Get many flows' },
			{
				name: 'Publish',
				value: 'publish',
				action: 'Publish a flow',
				description: 'Turn on the public read-only link',
			},
			{
				name: 'Review',
				value: 'review',
				action: 'Review a flow',
				description: 'Find dead ends, missing branches, missing owners, and guessed links',
			},
			{ name: 'Search', value: 'search', action: 'Search flows' },
			{
				name: 'Summarize',
				value: 'summarize',
				action: 'Summarize a flow',
				description: 'Write an overview, recaps, or a list of systems in scope',
			},
			{
				name: 'Unpublish',
				value: 'unpublish',
				action: 'Unpublish a flow',
				description: 'Turn off the public link',
			},
			{ name: 'Update', value: 'update', action: 'Update a flow' },
		],
	},
];

export const flowFields: INodeProperties[] = [
	{
		displayName: 'Flow ID',
		name: 'flowId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the flow. Use Get Many or Search to find it.',
		displayOptions: showFor([
			'addNotes',
			'delete',
			'duplicate',
			'editWithAi',
			'export',
			'get',
			'publish',
			'review',
			'summarize',
			'unpublish',
			'update',
		]),
	},

	// ---- generate ----
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		default: '',
		description: 'A transcript, call notes, or a plain description of the process',
		displayOptions: showFor(['generate']),
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: showFor(['generate']),
		options: [
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				default: 'vertical',
				options: [
					{ name: 'Horizontal', value: 'horizontal' },
					{ name: 'Vertical', value: 'vertical' },
				],
			},
			{
				displayName: 'Team ID',
				name: 'teamId',
				type: 'string',
				default: '',
				description: 'Save the flow in this team',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Leave empty to let Wavelength choose a title',
			},
		],
	},

	// ---- create ----
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: showFor(['create']),
	},
	{
		displayName: 'Nodes (JSON)',
		name: 'graphNodes',
		type: 'json',
		default: '[]',
		description:
			'List of nodes: {"ID","type","label","owner"}. Type is start, step, decision, data, system, actor, end, or screen. Nodes without x and y are laid out for you.',
		displayOptions: showFor(['create']),
	},
	{
		displayName: 'Edges (JSON)',
		name: 'graphEdges',
		type: 'json',
		default: '[]',
		description: 'List of edges: {"source","target","label"}. Source and target are node IDs.',
		displayOptions: showFor(['create']),
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: showFor(['create']),
		options: [
			{
				displayName: 'Team ID',
				name: 'teamId',
				type: 'string',
				default: '',
				description: 'Save the flow in this team',
			},
			{
				displayName: 'Transcript',
				name: 'transcript',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
		],
	},

	// ---- update ----
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: showFor(['update']),
		options: [
			{
				displayName: 'Edges (JSON)',
				name: 'graphEdges',
				type: 'json',
				default: '[]',
				description: 'Replaces all edges. Send Nodes (JSON) with it.',
			},
			{
				displayName: 'Nodes (JSON)',
				name: 'graphNodes',
				type: 'json',
				default: '[]',
				description: 'Replaces all nodes',
			},
			{
				displayName: 'Save Version',
				name: 'snapshot',
				type: 'boolean',
				default: false,
				description: 'Whether to save a version in the flow history',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Transcript',
				name: 'transcript',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Version Label',
				name: 'versionLabel',
				type: 'string',
				default: '',
				description: 'Name of the saved version, when Save Version is on',
			},
		],
	},

	// ---- edit with AI ----
	{
		displayName: 'Instruction',
		name: 'instruction',
		type: 'string',
		typeOptions: { rows: 3 },
		required: true,
		default: '',
		placeholder: 'e.g. Add a manager approval step before the refund',
		displayOptions: showFor(['editWithAi']),
	},

	// ---- add notes ----
	{
		displayName: 'Notes',
		name: 'notes',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		default: '',
		description: 'New notes or transcript text. Steps that are already on the flow are reused.',
		displayOptions: showFor(['addNotes']),
	},

	// ---- duplicate ----
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: showFor(['duplicate']),
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Title of the copy. Default is the old title plus "(copy)".',
			},
		],
	},

	// ---- export ----
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		default: 'mermaid',
		options: [
			{ name: 'Draw.io', value: 'drawio' },
			{ name: 'JSON', value: 'json' },
			{ name: 'Mermaid', value: 'mermaid' },
			{ name: 'SVG', value: 'svg' },
		],
		displayOptions: showFor(['export']),
	},

	// ---- summarize ----
	{
		displayName: 'Summary Type',
		name: 'summaryType',
		type: 'options',
		default: 'overview',
		options: [
			{
				name: 'Overview',
				value: 'overview',
				description: 'A short summary and the open gaps',
			},
			{
				name: 'Recaps',
				value: 'recaps',
				description: 'A customer recap email, handoff notes, and leadership notes',
			},
			{
				name: 'Systems in Scope',
				value: 'systems_in_scope',
				description: 'Each system and data store with its inputs and outputs',
			},
		],
		displayOptions: showFor(['summarize']),
	},

	// ---- publish ----
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: showFor(['publish']),
		options: [
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'string',
				default: '',
				description: 'Short text shown on the public page',
			},
		],
	},

	// ---- get many ----
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: showFor(['getAll']),
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of results to return',
		displayOptions: { show: { resource: ['flow'], operation: ['getAll'], returnAll: [false] } },
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: showFor(['getAll']),
		options: [
			{
				displayName: 'Team ID',
				name: 'teamId',
				type: 'string',
				default: '',
				description: 'Only flows of this team',
			},
			{
				displayName: 'Updated Since',
				name: 'updatedSince',
				type: 'dateTime',
				default: '',
				description: 'Only flows changed at or after this time',
			},
		],
	},

	// ---- search ----
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		description: 'Text to find in flow titles, steps, and transcripts',
		displayOptions: showFor(['search']),
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		description: 'Max number of results to return',
		displayOptions: showFor(['search']),
	},
];
