<script lang="ts">
	import { DataTable, Div } from '$lib/components';

	// props
	let { data } = $props();
	let columnsToHide = $state(['id', 'facility', 'userIds', 'users']);
	let sortKey = $state('description');
</script>

<Div class="flex flex-grow flex-col overflow-auto p-4">
	<DataTable bind:columnsToHide bind:fields={data.fields} bind:rows={data.rows} bind:sortKey />
</Div>
