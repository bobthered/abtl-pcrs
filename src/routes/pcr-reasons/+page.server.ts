import { server } from '$lib/dataTable';

const { actions, load } = await server('PCRReason');

export { actions, load };
