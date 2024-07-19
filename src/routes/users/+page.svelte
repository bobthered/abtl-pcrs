<script lang="ts">
	import { DataTable, Div } from '$lib/components';

	// props
	let { data } = $props();
	let columnsToHide = $state([
		'id',
		'jobClassification',
		'passwordHash',
		'pcrIds',
		'pcrs',
		'profile'
	]);
	let sortKey = $state('profileId');
</script>

<Div class="flex flex-grow flex-col overflow-auto p-4">
	<DataTable
		bind:columnsToHide
		bind:fields={data.fields}
		bind:relationOptions={data.relationOptions}
		bind:rows={data.rows}
		bind:sortKey
	/>
</Div>
