<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button, Card, Div, Input, Table, Tbody, Td, Th, Thead, Tr } from '$lib/components';
	import * as format from '$lib/format';
	import { Plus, Trash } from 'lucide-svelte';
	import { twMerge } from 'tailwind-merge';

	// handlers
	const enhanceHandler = () => {
		return async ({ result }) => {
			data = result.data;
			await applyAction(result);
		};
	};
	const update = async ({
		id,
		...jobClassification
	}: {
		id: string;
		description: string;
		costCenter: number;
		code: number;
		facility: number;
		eeoClassification: number;
		title: string;
		workCompClass: number;
	}) => {
		const formData = format.object.to.formData({ id, ...jobClassification });
		await fetch('?/upsert', {
			method: 'POST',
			body: formData
		});
	};

	// props
	let { data } = $props();
	const jobClassificationTypeProps = new Map([
		['int', { class: 'text-right w-[12rem]', type: 'number' }],
		['text', { class: 'w-[20rem]', type: 'text' }]
	]);
	const jobClassificationTypes = new Map([
		['description', jobClassificationTypeProps.get('text')],
		['costCenter', jobClassificationTypeProps.get('int')],
		['code', jobClassificationTypeProps.get('int')],
		['eeoClassification', jobClassificationTypeProps.get('int')],
		['title', jobClassificationTypeProps.get('text')],
		['workCompClass', jobClassificationTypeProps.get('int')]
	]);
</script>

<Div class="flex flex-grow flex-col overflow-auto p-4">
	<Card class="overflow-auto p-0">
		<Card class="flex flex-row items-center justify-end rounded-none p-4">
			<form action="?/create" method="POST" use:enhance={enhanceHandler}>
				<Button class="p-2" type="submit" variant="icon">
					<Plus class="h-4 w-4" />
				</Button>
			</form>
		</Card>
		<Card class="flex-grow items-start overflow-auto rounded-none p-0">
			<Table>
				<Thead>
					<Th />
					<Th>Description</Th>
					<Th>Cost Center</Th>
					<Th>Code</Th>
					<Th>EEO Classification</Th>
					<Th>Title</Th>
					<Th>Work Comp Class</Th>
				</Thead>
				<Tbody>
					{#if data?.jobClassifications}
						{#each data.jobClassifications.sort( (a: { description: string }, b: { description: string }) => a.description.localeCompare(b.description) ) as jobClassification}
							<Tr>
								<Td class="px-2 py-0">
									<form action="?/delete" method="POST" use:enhance={enhanceHandler}>
										<Input bind:value={jobClassification.id} name="id" type="hidden" />
										<Button class="p-2" tabindex="-1" type="submit" variant={['icon', 'delete']}>
											<Trash class="h-4 w-4" />
										</Button>
									</form>
								</Td>
								{#each Object.keys(jobClassification).filter((key) => !['id', 'facility'].includes(key)) as key}
									<Td class="p-0">
										<Input
											bind:value={jobClassification[key]}
											class={twMerge('rounded-none', jobClassificationTypes.get(key)?.class)}
											onchange={() => update(jobClassification)}
											type={jobClassificationTypes.get(key)?.type}
										/>
									</Td>
								{/each}
							</Tr>
						{/each}
					{/if}
				</Tbody>
			</Table>
		</Card>
	</Card>
</Div>
