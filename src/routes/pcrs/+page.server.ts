import { server } from '$lib/dataTable';

const { actions, load } = await server('PCR', {
	relations: {
		jobClassificationId: {
			modelName: 'JobClassification',
			label: 'description'
		},
		reasonId: {
			modelName: 'PCRReason',
			label: (data) => `${data.code} - ${data.description}`
		},
		userId: {
			modelName: 'User',
			label: 'username'
		}
	}
});

export { actions, load };
