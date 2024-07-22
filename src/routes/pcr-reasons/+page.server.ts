import { server } from '$lib/dataTable';

const { actions, load } = await server('PCRReason', {
	customFieldTypes: {
		code: {
			sanitizeDataForClient: (value: number) => value.toString().padStart(3, '0'),
			sanitizeDataForDB: (value: string) => +value
		}
	}
});

export { actions, load };
