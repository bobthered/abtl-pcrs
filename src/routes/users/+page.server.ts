import format from '$lib/format';
import { prisma } from '$lib/prisma';
import type { Actions } from '@sveltejs/kit';

const _getData = async () => {
	const data = await Promise.all([
		prisma.jobClassification.findMany(),
		prisma.user.findMany(),
		prisma.userProfile.findMany()
	]);
	return data;
};
export const actions: Actions = {
	create: async () => {
		const rows = await prisma.user.findMany();
		await prisma.user.create({
			data: {
				username: `* user${rows.length}`,
				isActive: false,
				isOnboarded: false,
				passwordHash: ''
			}
		});

		const [jobClassifications, users, userProfiles] = await _getData();

		return { jobClassifications, success: true, users, userProfiles };
	},
	delete: async ({ request }) => {
		const { id } = format.formData.to.object(await request.formData());

		await prisma.user.delete({ where: { id } });

		const [jobClassifications, users, userProfiles] = await _getData();

		return { jobClassifications, success: true, users, userProfiles };
	},
	upsert: async ({ request }) => {
		const { id, ...data } = format.formData.to.object(await request.formData());
		const update = {
			isActive: data.isActive === 'true',
			isOnboarded: data.isOnboarded === 'true',
			jobClassificationId:
				data.jobClassificationId === 'null' ? undefined : data.jobClassificationId,
			passwordHash: data.passwordHash,
			profileId: data.profileId === 'null' ? undefined : data.profileId,
			username: data.username
		};
		await prisma.user.upsert({
			where: {
				id
			},
			update,
			create: update
		});

		return { success: true };
	}
};

export const load = async () => {
	const [jobClassifications, users, userProfiles] = await _getData();

	return { jobClassifications, userProfiles, users };
};
