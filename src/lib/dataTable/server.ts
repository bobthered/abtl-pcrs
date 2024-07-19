import { Prisma } from '@prisma/client';
import { fail, type Actions } from '@sveltejs/kit';
import { DateTime } from 'luxon';
import format from '$lib/format';
import { prisma } from '$lib/prisma';

export type Fields = {
	name: string;
	kind: 'scalar';
	isList: boolean;
	isRequired: boolean;
	isUnique: boolean;
	isId: boolean;
	isReadOnly: boolean;
	hasDefaultValue: boolean;
	type: string;
	relationName?: string;
	relationFromFields?: string[];
	relationToFields?: string[];
	isGenerated: boolean;
	isUpdatedAt: boolean;
}[];

export type Options = {
	beforeCreate?: (data: Record<string, any>) => Record<string, any>;
	relations?: Record<
		string,
		{
			modelName: string;
			label: string | ((data: any) => string);
		}
	>;
};

const server = async (modelName: string, options?: Options) => {
	options = Object.assign(
		{ beforeCreate: async (data: Record<string, any>) => data, relations: {} },
		options
	);

	const fields = <Fields>(
		Prisma.dmmf.datamodel.models.find(({ name }) => name === modelName)?.fields
	);

	const actions = {
		create: async ({ request }) => {
			try {
				const rawData = format.formData.to.object(await request.formData());
				const data = await options.beforeCreate(await sanitizeDataForDB(rawData));

				await prisma[modelName].create({
					data
				});

				return {};
			} catch (error) {
				console.log(error);

				return fail(400, {});
			}
		},
		delete: async ({ request }) => {
			try {
				const { id } = format.formData.to.object(await request.formData());

				await prisma[modelName].delete({ where: { id } });

				return {};
			} catch (error) {
				console.log(error);
			}
		},
		update: async ({ request }) => {
			try {
				const { id, ...rawData } = format.formData.to.object(await request.formData());
				const data = await sanitizeDataForDB(rawData);

				await prisma[modelName].update({
					where: {
						id
					},
					data
				});

				return {};
			} catch (error) {
				console.log(error);
				return fail(400, {});
			}
		}
	} satisfies Actions;

	const getData = async () => {
		const [relationOptions, rows] = await Promise.all([
			getRelationOptions(options),
			getRows(modelName)
		]);

		return { relationOptions, rows };
	};

	const getRelationOptions = async (options: Options) => {
		if (options?.relations === undefined) return {};
		const relationOptionArray = await Promise.all(
			Object.keys(options.relations).map(async (fieldName) => {
				if (options?.relations === undefined) return [];
				const { modelName, label } = options.relations[fieldName];
				const rows = await getRows(modelName);
				let relationOptions;
				if (typeof label === 'string')
					relationOptions = rows.map(({ id, ...row }) => ({ label: row[label], value: id }));
				if (typeof label !== 'string')
					relationOptions = rows.map((row: any) => ({ label: label(row), value: row.id }));
				return {
					fieldName,
					options: relationOptions.sort(
						(a: { label: any; value: string }, b: { label: any; value: string }) => {
							if (typeof a.label === 'boolean') return a.label === b.label ? 0 : a.label ? -1 : 1;
							if (typeof a.label === 'number') return a.label - b.label;
							if (typeof a.label === 'string') return a.label.localeCompare(b.label);
							return 0;
						}
					)
				};
			})
		);
		const relationOptions = relationOptionArray.reduce(
			(
				obj,
				{ fieldName, options }: { fieldName: string; options: { label: string; value: string }[] }
			) => {
				obj[fieldName] = options;
				return obj;
			},
			{}
		);
		return relationOptions;
	};

	const getRows = async (modelName: string) => {
		const rows = await sanitizeDataForClient(await prisma[modelName].findMany());

		return rows;
	};

	const load = async () => {
		const { relationOptions, rows } = await getData();

		return { fields, relationOptions, rows };
	};

	const sanitizeDataForClient = async (rows: Record<string, any>[]) => {
		rows = rows.map((row: Record<string, any>) => {
			row = Object.keys(row).reduce((obj: Record<string, any>, key: string) => {
				obj[key] = row[key];
				const field = fields.find(({ name }) => name === key);

				if (field?.type === 'DateTime')
					obj[key] = DateTime.fromJSDate(obj[key]).toFormat('yyyy-MM-dd');

				return obj;
			}, {});
			return row;
		});

		return rows;
	};

	const sanitizeDataForDB = async (rawData: Record<string, any>[]) => {
		const data = Object.keys(rawData).reduce((obj: Record<string, any>, key: string) => {
			obj[key] = rawData[key];
			const field = fields.find(({ name }) => name === key);

			if (field?.type === 'Boolean') obj[key] = obj[key] === 'true';
			if (field?.type === 'DateTime')
				obj[key] = DateTime.fromFormat(obj[key], 'yyyy-MM-dd').toJSDate();
			if (field?.type === 'Int') obj[key] = +obj[key];

			return obj;
		}, {});

		return data;
	};

	return { actions, load };
};

export { server };
