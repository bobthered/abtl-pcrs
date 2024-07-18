<script lang="ts">
	import { DataTable, Div, Select, Td } from '$lib/components';

	// props
	let { data } = $props();
	let columnFilterKeys = $state(['id', 'passwordHash']);
	let columnTypes = $state(
		new Map([
			['isActive', 'boolean'],
			['isOnboarded', 'boolean'],
			[
				'jobClassificationId',
				{
					component: Select,
					props: {
						options: data.jobClassifications
							.map(({ id, description }) => ({ label: description, value: id }))
							.sort((a: any, b: any) => a.label.localeCompare(b.label))
					}
				}
			],
			[
				'profileId',
				{
					component: Select,
					props: {
						options: data.userProfiles
							.map(({ id, firstName, lastName }) => ({
								label: `${firstName} ${lastName}`,
								value: id
							}))
							.sort((a: any, b: any) => a.label.localeCompare(b.label))
					}
				}
			]
		])
	);
	let sortKey = $state('username');
</script>

<Div class="flex flex-grow flex-col overflow-auto p-4">
	<DataTable bind:columnFilterKeys bind:columnTypes bind:rows={data.users} bind:sortKey></DataTable>
</Div>
