import type {
	IDataObject,
	JsonObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const MCP_URL = 'https://wavelengthflow.com/api/mcp';

const flowId: INodeProperties = {
	displayName: 'Flow ID',
	name: 'flowId',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID of the flow. Use the Get Many or Search operation to find it.',
	displayOptions: {
		show: {
			operation: ['get', 'edit', 'addTo', 'export', 'summarize', 'review', 'rename', 'duplicate', 'delete', 'share'],
		},
	},
};

export class Wavelength implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wavelength',
		name: 'wavelength',
		icon: { light: 'file:wavelength.svg', dark: 'file:wavelength.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Turn call notes and transcripts into editable process flow diagrams',
		defaults: { name: 'Wavelength' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: 'wavelengthOAuth2Api', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				default: 'flow',
				options: [{ name: 'Flow', value: 'flow' }],
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'createFromText',
				displayOptions: { show: { resource: ['flow'] } },
				options: [
					{ name: 'Add to Flow', value: 'addTo', action: 'Add steps to a flow', description: 'Add new steps to a flow from text' },
					{ name: 'Create From Text', value: 'createFromText', action: 'Create a flow from text', description: 'Turn a transcript or notes into a new flow' },
					{ name: 'Delete', value: 'delete', action: 'Delete a flow' },
					{ name: 'Duplicate', value: 'duplicate', action: 'Duplicate a flow' },
					{ name: 'Edit', value: 'edit', action: 'Edit a flow with an instruction', description: 'Change a flow from a plain instruction' },
					{ name: 'Export', value: 'export', action: 'Export a flow', description: 'Export as Mermaid, SVG, draw.io, or JSON' },
					{ name: 'Get', value: 'get', action: 'Get a flow' },
					{ name: 'Get Many', value: 'getAll', action: 'Get many flows' },
					{ name: 'Rename', value: 'rename', action: 'Rename a flow' },
					{ name: 'Review', value: 'review', action: 'Review a flow for gaps', description: 'Find missing branches, owners, and handoffs' },
					{ name: 'Search', value: 'search', action: 'Search flows' },
					{ name: 'Share', value: 'share', action: 'Share a flow', description: 'Turn on the public read-only link' },
					{ name: 'Summarize', value: 'summarize', action: 'Summarize a flow', description: 'Write a recap email, SOW outline, or systems list' },
				],
			},
			flowId,
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: { rows: 6 },
				required: true,
				default: '',
				description: 'A transcript, call notes, or a plain description of the process',
				displayOptions: { show: { operation: ['createFromText', 'addTo'] } },
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Title of the flow. Leave empty to let Wavelength choose one.',
				displayOptions: { show: { operation: ['createFromText', 'duplicate'] } },
			},
			{
				displayName: 'New Title',
				name: 'newTitle',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['rename'] } },
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				default: 'vertical',
				options: [
					{ name: 'Vertical', value: 'vertical' },
					{ name: 'Horizontal', value: 'horizontal' },
				],
				displayOptions: { show: { operation: ['createFromText'] } },
			},
			{
				displayName: 'Instruction',
				name: 'instruction',
				type: 'string',
				typeOptions: { rows: 3 },
				required: true,
				default: '',
				placeholder: 'Add a manager approval step before the refund',
				displayOptions: { show: { operation: ['edit'] } },
			},
			{
				displayName: 'Format',
				name: 'exportFormat',
				type: 'options',
				default: 'mermaid',
				options: [
					{ name: 'Mermaid', value: 'mermaid' },
					{ name: 'SVG', value: 'svg' },
					{ name: 'Draw.io', value: 'drawio' },
					{ name: 'JSON', value: 'json' },
				],
				displayOptions: { show: { operation: ['export'] } },
			},
			{
				displayName: 'Summary Type',
				name: 'summaryFormat',
				type: 'options',
				default: 'recap_email',
				options: [
					{ name: 'Recap Email', value: 'recap_email' },
					{ name: 'SOW Outline', value: 'sow_outline' },
					{ name: 'Systems in Scope', value: 'systems_in_scope' },
				],
				displayOptions: { show: { operation: ['summarize'] } },
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['search'] } },
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 50,
				description: 'Max number of results to return',
				displayOptions: { show: { operation: ['getAll', 'search'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const p = (name: string) => this.getNodeParameter(name, i) as string;
				let tool = '';
				const args: IDataObject = {};

				switch (operation) {
					case 'createFromText': {
						tool = 'create_flow_from_text';
						args.text = p('text');
						const title = p('title');
						if (title) args.title = title;
						args.direction = p('direction');
						break;
					}
					case 'addTo':
						tool = 'add_to_flow';
						args.flow_id = p('flowId');
						args.text = p('text');
						break;
					case 'get':
						tool = 'get_flow';
						args.flow_id = p('flowId');
						break;
					case 'getAll':
						tool = 'list_flows';
						args.limit = this.getNodeParameter('limit', i) as number;
						break;
					case 'search':
						tool = 'search_flows';
						args.query = p('query');
						args.limit = this.getNodeParameter('limit', i) as number;
						break;
					case 'edit':
						tool = 'edit_flow';
						args.flow_id = p('flowId');
						args.instruction = p('instruction');
						break;
					case 'export':
						tool = 'export_flow';
						args.flow_id = p('flowId');
						args.format = p('exportFormat');
						break;
					case 'summarize':
						tool = 'summarize_flow';
						args.flow_id = p('flowId');
						args.format = p('summaryFormat');
						break;
					case 'review':
						tool = 'review_flow';
						args.flow_id = p('flowId');
						break;
					case 'rename':
						tool = 'rename_flow';
						args.flow_id = p('flowId');
						args.title = p('newTitle');
						break;
					case 'duplicate': {
						tool = 'duplicate_flow';
						args.flow_id = p('flowId');
						const title = p('title');
						if (title) args.title = title;
						break;
					}
					case 'delete':
						tool = 'delete_flow';
						args.flow_id = p('flowId');
						break;
					case 'share':
						tool = 'share_flow';
						args.flow_id = p('flowId');
						break;
					default:
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
				}

				const options: IHttpRequestOptions = {
					method: 'POST',
					url: MCP_URL,
					headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
					body: { jsonrpc: '2.0', id: i + 1, method: 'tools/call', params: { name: tool, arguments: args } },
					json: true,
				};
				const response = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					'wavelengthOAuth2Api',
					options,
				)) as IDataObject;

				if (response.error) {
					throw new NodeApiError(this.getNode(), response.error as JsonObject, { itemIndex: i });
				}
				const result = (response.result || {}) as IDataObject;
				const content = (result.content as IDataObject[] | undefined) || [];
				const text = content
					.filter((c) => c.type === 'text')
					.map((c) => c.text as string)
					.join('\n');
				if (result.isError) {
					throw new NodeOperationError(this.getNode(), text || 'Wavelength returned an error', { itemIndex: i });
				}

				let json: IDataObject;
				if (result.structuredContent && typeof result.structuredContent === 'object') {
					json = result.structuredContent as IDataObject;
				} else {
					try {
						const parsed = JSON.parse(text);
						json = Array.isArray(parsed) ? { data: parsed } : (parsed as IDataObject);
					} catch {
						json = { text };
					}
				}
				returnData.push({ json, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				if (error instanceof NodeApiError) {
					throw new NodeApiError(this.getNode(), { message: error.message } as JsonObject, { itemIndex: i });
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
