import { server } from '$lib/dataTable';

const { actions, load } = await server('JobClassification');

export { actions, load };
