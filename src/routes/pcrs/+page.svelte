<script lang="ts">
	import { DataTable, Div } from '$lib/components';

	// props
	let { data } = $props();
	let columnsToHide = $state([
		'id',
		'facility',
		'jobClassification',
		'previousPCRIds',
		'previousPCRs',
		'newPCR',
		'reason',
		'user'
	]);
	let sortDirection: -1 | 1 = $state(-1);
	let sortKey = $state('date');
</script>

<Div class="flex flex-grow flex-col overflow-auto p-4">
	<DataTable
		bind:columnsToHide
		bind:fields={data.fields}
		bind:relationOptions={data.relationOptions}
		bind:rows={data.rows}
		bind:sortDirection
		bind:sortKey
	/>
</Div>
