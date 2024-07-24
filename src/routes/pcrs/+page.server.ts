import { server } from '$lib/dataTable';

const { actions, load } = await server('PCR', {
	customFieldTypes: {
		after: 'Currency',
		percent: 'Percent',
		previous: 'Currency'
	},
	formulas: {
		percent: {
			value: ({ row }) => row.after / row.previous - 1
		}
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
