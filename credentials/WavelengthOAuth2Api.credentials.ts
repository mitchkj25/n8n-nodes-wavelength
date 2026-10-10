import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class WavelengthOAuth2Api implements ICredentialType {
	name = 'wavelengthOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Wavelength OAuth2 API';

	icon: Icon = { light: 'file:../icons/wavelength.svg', dark: 'file:../icons/wavelength.dark.svg' };

	documentationUrl = 'https://github.com/mitchkj25/n8n-nodes-wavelength#credentials';

	properties: INodeProperties[] = [
		{ displayName: 'Grant Type', name: 'grantType', type: 'hidden', default: 'pkce' },
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://mcp.wavelengthflow.com/authorize',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://mcp.wavelengthflow.com/token',
			required: true,
		},
		{ displayName: 'Client ID', name: 'clientId', type: 'hidden', default: 'wavelength-n8n' },
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'hidden',
			typeOptions: { password: true },
			default: '',
		},
		{ displayName: 'Scope', name: 'scope', type: 'hidden', default: 'flows' },
		{ displayName: 'Auth URI Query Parameters', name: 'authQueryParameters', type: 'hidden', default: '' },
		{ displayName: 'Authentication', name: 'authentication', type: 'hidden', default: 'body' },
	];
}
