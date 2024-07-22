import { server } from '$lib/dataTable';

const { actions, load } = await server('PCR', {
	customFieldTypes: {
		after: 'Currency',
		previous: 'Currency'
	},
	relations: {
		jobClassificationId: {
			modelName: 'JobClassification',
			label: 'description'
		},
		reasonId: {
			modelName: 'PCRReason',
			label: 'description'
		},
		userId: {
			modelName: 'User',
			label: 'username'
		}
	}
});

export { actions, load };
