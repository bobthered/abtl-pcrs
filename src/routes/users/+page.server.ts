import bcrypt from 'bcryptjs';
import { DEFAULT_USER_PASSWORD } from '$env/static/private';
import { server } from '$lib/dataTable';

const { actions, load } = await server('User', {
	beforeCreate: async (data) => {
		const passwordHash: string = await new Promise((res) => {
			bcrypt.hash(DEFAULT_USER_PASSWORD, 10, (err, hash) => {
				return res(hash);
			});
		});
		data.passwordHash = passwordHash;
		return data;
	},
	relations: {
		jobClassificationId: { modelName: 'JobClassification', label: 'description' },
		profileId: { modelName: 'UserProfile', label: (row) => `${row.firstName} ${row.lastName}` }
	}
});

export { actions, load };
