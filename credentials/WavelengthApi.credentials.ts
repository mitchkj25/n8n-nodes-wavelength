import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WavelengthApi implements ICredentialType {
	name = 'wavelengthApi';

	displayName = 'Wavelength API';

	icon: Icon = { light: 'file:../icons/wavelength.svg', dark: 'file:../icons/wavelength.dark.svg' };

	documentationUrl = 'https://wavelengthflow.com/developers.html#auth';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description:
				'A personal key from Wavelength Settings > API keys, or an organization key from Organization settings > Security. Keys start with wlk_.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'hidden',
			default: 'https://lnzcwfswvljbijqszxxn.supabase.co/functions/v1/api/v1',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/me',
		},
	};
}
