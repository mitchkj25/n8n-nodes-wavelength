import {
	type IDataObject,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

import {
	parseJsonField,
	wavelengthApiRequest,
	wavelengthApiRequestAllItems,
	wavelengthAuditAllItems,
} from './GenericFunctions';
import { accountOperations } from './descriptions/AccountDescription';
import { auditEventFields, auditEventOperations } from './descriptions/AuditEventDescription';
import { flowFields, flowOperations } from './descriptions/FlowDescription';

export class Wavelength implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wavelength',
		name: 'wavelength',
		icon: { light: 'file:wavelength.svg', dark: 'file:wavelength.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Turn call notes and transcripts into process flow diagrams with the Wavelength API',
		defaults: { name: 'Wavelength' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: 'wavelengthApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				default: 'flow',
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Audit Event', value: 'auditEvent' },
					{ name: 'Flow', value: 'flow' },
				],
			},
			...accountOperations,
			...auditEventOperations,
			...auditEventFields,
			...flowOperations,
			...flowFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let result: IDataObject | IDataObject[] = {};

				if (resource === 'account' && operation === 'get') {
					result = await wavelengthApiRequest.call(this, 'GET', '/me');
				} else if (resource === 'auditEvent' && operation === 'getAll') {
					const returnAll = this.getNodeParameter('returnAll', i) as boolean;
					const filters = this.getNodeParameter('filters', i) as IDataObject;
					const qs: IDataObject = {};
					for (const k of ['action', 'actor', 'from', 'to']) if (filters[k]) qs[k] = filters[k];
					const max = returnAll ? undefined : (this.getNodeParameter('limit', i) as number);
					result = await wavelengthAuditAllItems.call(this, qs, max);
				} else if (resource === 'flow') {
					result = await executeFlow.call(this, operation, i);
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${resource} ${operation}`,
						{
							itemIndex: i,
						},
					);
				}

				returnData.push(
					...this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(result), {
						itemData: { item: i },
					}),
				);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
					description: (error as NodeApiError).description ?? undefined,
				});
			}
		}

		return [returnData];
	}
}

async function executeFlow(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	const flowPath = () =>
		`/flows/${encodeURIComponent(this.getNodeParameter('flowId', i) as string)}`;
	const unwrap = (r: IDataObject) => (r.flow as IDataObject) ?? r;
	const json = (name: string, value: unknown) =>
		parseJsonField.call(this, value, name, i) as IDataObject[] | undefined;

	switch (operation) {
		case 'generate': {
			const extra = this.getNodeParameter('additionalFields', i) as IDataObject;
			const body: IDataObject = { text: this.getNodeParameter('text', i) as string };
			if (extra.title) body.title = extra.title;
			if (extra.direction) body.direction = extra.direction;
			if (extra.teamId) body.team_id = extra.teamId;
			return unwrap(await wavelengthApiRequest.call(this, 'POST', '/flows/generate', body));
		}
		case 'create': {
			const extra = this.getNodeParameter('additionalFields', i) as IDataObject;
			const body: IDataObject = {
				title: this.getNodeParameter('title', i) as string,
				graph_nodes: json('Nodes (JSON)', this.getNodeParameter('graphNodes', i)) ?? [],
				graph_edges: json('Edges (JSON)', this.getNodeParameter('graphEdges', i)) ?? [],
			};
			if (extra.transcript) body.transcript = extra.transcript;
			if (extra.teamId) body.team_id = extra.teamId;
			return unwrap(await wavelengthApiRequest.call(this, 'POST', '/flows', body));
		}
		case 'get':
			return unwrap(await wavelengthApiRequest.call(this, 'GET', flowPath()));
		case 'getAll': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;
			const qs: IDataObject = {};
			if (filters.updatedSince) qs.updated_since = filters.updatedSince;
			if (filters.teamId) qs.team_id = filters.teamId;
			const max = returnAll ? undefined : (this.getNodeParameter('limit', i) as number);
			return await wavelengthApiRequestAllItems.call(this, 'flows', '/flows', qs, max);
		}
		case 'search': {
			const r = await wavelengthApiRequest.call(
				this,
				'GET',
				'/flows/search',
				{},
				{
					q: this.getNodeParameter('query', i) as string,
					limit: this.getNodeParameter('limit', i) as number,
				},
			);
			return (r.matches as IDataObject[]) ?? [];
		}
		case 'update': {
			const fields = this.getNodeParameter('updateFields', i) as IDataObject;
			const body: IDataObject = {};
			if (fields.title !== undefined) body.title = fields.title;
			if (fields.transcript !== undefined) body.transcript = fields.transcript;
			if (fields.graphNodes !== undefined)
				body.graph_nodes = json('Nodes (JSON)', fields.graphNodes);
			if (fields.graphEdges !== undefined)
				body.graph_edges = json('Edges (JSON)', fields.graphEdges);
			if (fields.snapshot) body.snapshot = true;
			if (fields.versionLabel) body.version_label = fields.versionLabel;
			if (!Object.keys(body).length) {
				throw new NodeOperationError(this.getNode(), 'Add at least one field to update', {
					itemIndex: i,
				});
			}
			return unwrap(await wavelengthApiRequest.call(this, 'PATCH', flowPath(), body));
		}
		case 'delete':
			return await wavelengthApiRequest.call(this, 'DELETE', flowPath());
		case 'duplicate': {
			const options = this.getNodeParameter('options', i) as IDataObject;
			const body: IDataObject = options.title ? { title: options.title } : {};
			return unwrap(await wavelengthApiRequest.call(this, 'POST', `${flowPath()}/duplicate`, body));
		}
		case 'editWithAi':
			return unwrap(
				await wavelengthApiRequest.call(this, 'POST', `${flowPath()}/edit`, {
					instruction: this.getNodeParameter('instruction', i) as string,
				}),
			);
		case 'addNotes':
			return unwrap(
				await wavelengthApiRequest.call(this, 'POST', `${flowPath()}/notes`, {
					text: this.getNodeParameter('notes', i) as string,
				}),
			);
		case 'export':
			return await wavelengthApiRequest.call(
				this,
				'GET',
				`${flowPath()}/export`,
				{},
				{
					format: this.getNodeParameter('format', i) as string,
				},
			);
		case 'review':
			return await wavelengthApiRequest.call(this, 'GET', `${flowPath()}/review`);
		case 'summarize':
			return await wavelengthApiRequest.call(this, 'POST', `${flowPath()}/summaries`, {
				type: this.getNodeParameter('summaryType', i) as string,
			});
		case 'publish': {
			const options = this.getNodeParameter('options', i) as IDataObject;
			const body: IDataObject = options.summary ? { summary: options.summary } : {};
			return await wavelengthApiRequest.call(this, 'POST', `${flowPath()}/publish`, body);
		}
		case 'unpublish':
			return await wavelengthApiRequest.call(this, 'DELETE', `${flowPath()}/publish`);
		default:
			throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
				itemIndex: i,
			});
	}
}
