<script lang="ts">
	import { DataTable, Div } from '$lib/components';

	// props
	let { data } = $props();
	let columnFilterKeys = $state(['id', 'facility', 'userIds']);
	let columnTypes: Map<string, 'int' | 'text'> = $state(
		new Map([
			['description', 'text'],
			['costCenter', 'int'],
			['code', 'int'],
			['eeoClassification', 'int'],
			['title', 'text'],
			['workCompClass', 'int']
		])
	);
</script>

<Div class="flex flex-grow flex-col overflow-auto p-4">
	<DataTable
		bind:columnFilterKeys
		bind:columnTypes
		bind:rows={data.jobClassifications}
		sortKey="costCenter"
	/>
</Div>
