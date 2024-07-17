import format from '$lib/format';
import { prisma } from '$lib/prisma';
import type { Actions } from '@sveltejs/kit';

const _getJobClassifications = async () => await prisma.jobClassification.findMany();

export const actions: Actions = {
	create: async () => {
		const rows = await prisma.jobClassification.findMany();
		await prisma.jobClassification.create({
			data: {
				description: `* Description ${rows.length}`,
				costCenter: 0,
				code: 0,
				eeoClassification: 0,
				title: '',
				workCompClass: 0
			}
		});

		const jobClassifications = await _getJobClassifications();

		return { jobClassifications, success: true };
	},
	delete: async ({ request }) => {
		const { id } = format.formData.to.object(await request.formData());

		await prisma.jobClassification.delete({ where: { id } });

		const jobClassifications = await _getJobClassifications();

		return { jobClassifications, success: true };
	},
	upsert: async ({ request }) => {
		const { id, ...data } = format.formData.to.object(await request.formData());
		const update = {
			description: data.description,
			costCenter: +data.costCenter,
			code: +data.code,
			facility: +data.facility,
			eeoClassification: +data.eeoClassification,
			title: data.title,
			workCompClass: +data.workCompClass
		};
		await prisma.jobClassification.upsert({
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
	const jobClassifications = await prisma.jobClassification.findMany();

	return { jobClassifications };
};
