import { server } from '$lib/dataTable';
import { DateTime } from 'luxon';

const { actions, load } = await server('UserProfile', {
	// beforeCreate: () => {},
	customFieldTypes: {
		service: 'Int'
	},
	formulas: {
		service: {
			value: ({ row }) => {
				const hireDate = DateTime.fromJSDate(row.dateHired);
				const today = DateTime.now();
				const { years } = today.diff(hireDate, ['years']).toObject();
				return Math.floor(years);
			}
		}
	},
	relations: {
		userId: {
			modelName: 'User',
			label: 'username'
		}
	}
});

export { actions, load };
