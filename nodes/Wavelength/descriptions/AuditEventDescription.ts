import type { INodeProperties } from 'n8n-workflow';

export const auditEventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['auditEvent'] } },
		default: 'getAll',
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many audit events',
				description: 'Get organization audit events. Needs an organization API key.',
			},
		],
	},
];

export const auditEventFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: { show: { resource: ['auditEvent'], operation: ['getAll'] } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: { resource: ['auditEvent'], operation: ['getAll'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['auditEvent'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Action',
				name: 'action',
				type: 'string',
				default: '',
				placeholder: 'e.g. flow_viewed',
				description: 'Only events with this action',
			},
			{
				displayName: 'Actor',
				name: 'actor',
				type: 'string',
				default: '',
				description: 'Only events by a person whose email contains this text',
			},
			{
				displayName: 'From',
				name: 'from',
				type: 'dateTime',
				default: '',
				description: 'Only events at or after this time',
			},
			{
				displayName: 'To',
				name: 'to',
				type: 'dateTime',
				default: '',
				description: 'Only events at or before this time',
			},
		],
	},
];
