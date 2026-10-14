import type { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['account'] } },
		default: 'get',
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get the account',
				description: 'Get the account or organization and the scopes of the API key',
			},
		],
	},
];
