import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

/** Calls the Wavelength REST API (v1) with the Wavelength API credential. */
export async function wavelengthApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('wavelengthApi');
	const options: IHttpRequestOptions = {
		method,
		url: `${credentials.baseUrl as string}${endpoint}`,
		qs,
		json: true,
	};
	if (Object.keys(body).length) options.body = body;
	try {
		return (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'wavelengthApi',
			options,
		)) as IDataObject;
	} catch (error) {
		const data = (error as { response?: { body?: { error?: { message?: string } } } }).response
			?.body;
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: data?.error?.message,
		});
	}
}

/**
 * Gets every page of a list endpoint that pages with offset and next_offset.
 * Stops at `max` items when it is set.
 */
export async function wavelengthApiRequestAllItems(
	this: IExecuteFunctions,
	propertyName: string,
	endpoint: string,
	qs: IDataObject = {},
	max?: number,
): Promise<IDataObject[]> {
	const items: IDataObject[] = [];
	const query: IDataObject = { ...qs, limit: 200, offset: 0 };
	do {
		if (max !== undefined) query.limit = Math.min(200, max - items.length);
		const response = await wavelengthApiRequest.call(this, 'GET', endpoint, {}, query);
		items.push(...((response[propertyName] as IDataObject[]) ?? []));
		query.offset = response.next_offset as number | null;
	} while (
		query.offset !== null &&
		query.offset !== undefined &&
		(max === undefined || items.length < max)
	);
	return items;
}

/** Gets every page of the audit log, which pages with before_id and next_before_id. */
export async function wavelengthAuditAllItems(
	this: IExecuteFunctions,
	qs: IDataObject,
	max?: number,
): Promise<IDataObject[]> {
	const items: IDataObject[] = [];
	const query: IDataObject = { ...qs };
	let next: number | null = null;
	do {
		query.limit = max === undefined ? 500 : Math.min(500, max - items.length);
		if (next !== null) query.before_id = next;
		const response = await wavelengthApiRequest.call(this, 'GET', '/audit', {}, query);
		items.push(...((response.events as IDataObject[]) ?? []));
		next = (response.next_before_id as number | null) ?? null;
	} while (next !== null && (max === undefined || items.length < max));
	return items;
}

/** Reads a JSON field that can arrive as a string or as an object. */
export function parseJsonField(
	this: IExecuteFunctions,
	value: unknown,
	field: string,
	itemIndex: number,
): unknown {
	if (typeof value !== 'string') return value;
	if (!value.trim()) return undefined;
	try {
		return JSON.parse(value);
	} catch {
		throw new NodeOperationError(this.getNode(), `${field} is not valid JSON`, { itemIndex });
	}
}
