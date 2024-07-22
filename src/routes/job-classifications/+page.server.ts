import { server } from '$lib/dataTable';

const { actions, load } = await server('JobClassification', {
	customFieldTypes: {
		eeoClassification: {
			sanitizeDataForClient: (value: number) => value.toString().padStart(3, '0'),
			sanitizeDataForDB: (value: string) => +value
		}
	}
});

export { actions, load };
