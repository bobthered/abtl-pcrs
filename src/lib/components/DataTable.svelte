<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import {
		Button,
		Card,
		Checkbox,
		Div,
		Input,
		Select,
		Table,
		Tbody,
		Td,
		Th,
		Thead,
		Tr
	} from '$lib/components';
	import * as format from '$lib/format';
	import { ChevronDown, Plus, Trash } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	// types
	type Props = {
		columnFilterKeys?: string[];
		columnTypes?: Map<string, any>;
		header?: Snippet;
		isSortable?: boolean;
		row?: Snippet;
		rows: any[];
		sortDirection?: -1 | 1;
		sortKey?: string;
	};

	// handlers
	const enhanceHandler = () => {
		return async ({ result }: { result: any }) => {
			rows = result.data;
			await applyAction(result);
		};
	};
	const update = async ({ id, ...row }: { [key: string]: string }) => {
		const formData = format.object.to.formData({ id, ...row });
		await fetch('?/upsert', {
			method: 'POST',
			body: formData
		});
	};

	// props
	const defaultColumnTypesMap = new Map([
		['boolean', { component: Checkbox, props: {} }],
		['int', { component: Input, props: { class: 'text-right w-[12rem]', type: 'number' } }],
		['select', { component: Select, props: { options: [] } }],
		['text', { component: Input, props: { class: 'w-[20rem]', type: 'text' } }]
	]);
	let {
		columnFilterKeys = $bindable(),
		columnTypes = $bindable(),
		header,
		isSortable = $bindable(),
		row,
		rows = $bindable(),
		sortDirection = $bindable(),
		sortKey = $bindable()
	}: Props = $props();

	// effects
	$effect(() => {
		if (rows === undefined) rows = [];
		if (columnFilterKeys === undefined) columnFilterKeys = ['id'];
		if (columnTypes === undefined) columnTypes = new Map();
		Object.keys(rows[0]).map((key) => {
			if (!columnTypes?.has(key)) columnTypes?.set(key, 'text');
			if (typeof columnTypes?.get(key) === 'string')
				columnTypes.set(key, defaultColumnTypesMap.get(columnTypes.get(key)));
		});
		if (isSortable === undefined) isSortable = true;
		if (sortDirection === undefined) sortDirection = 1;
		if (sortKey === undefined)
			sortKey = Object.keys(rows[0]).filter((key) => !columnFilterKeys?.includes(key))[0];
	});
</script>

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
				{#if header}
					{@render header()}
				{:else}
					<Th />
					{#each Object.keys(rows[0]).filter((key) => !columnFilterKeys.includes(key)) as key}
						<Th class=" p-0">
							{#if isSortable}
								<Button
									class="w-full justify-between rounded-none text-base"
									onclick={() => {
										sortDirection = sortKey === key ? sortDirection * -1 : 1;
										sortKey = key;
									}}
									variant={['ghost']}
								>
									{key}
									<Div
										class={twMerge(
											'transition duration-200',
											sortKey === key ? 'scale-100' : 'scale-0'
										)}
									>
										<ChevronDown
											class={twMerge(
												'h-4 w-4 transition duration-200',
												sortDirection === -1 ? 'rotate-180' : 'rotate-0'
											)}
										/>
									</Div>
								</Button>
							{:else}
								<Div class="px-6 py-3">
									{key}
								</Div>
							{/if}
						</Th>
					{/each}
				{/if}
			</Thead>
			<Tbody>
				{#if rows}
					{#each rows.sort((a: { [sortKey: string]: any }, b: { [sortKey: string]: any }) => (typeof a[sortKey] === 'string' ? a[sortKey].localeCompare(b[sortKey]) : a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0) * sortDirection) as rowData}
						<Tr>
							{#if row}
								{@render row(rowData)}
							{:else}
								<Td class="px-2 py-0">
									<form action="?/delete" method="POST" use:enhance={enhanceHandler}>
										<Input bind:value={rowData.id} name="id" type="hidden" />
										<Button class="p-2" tabindex="-1" type="submit" variant={['icon', 'delete']}>
											<Trash class="h-4 w-4" />
										</Button>
									</form>
								</Td>
								{#each Object.keys(rowData).filter((key) => !columnFilterKeys.includes(key)) as key}
									<Td class="p-0">
										{#if columnTypes.get(key)?.component === Checkbox}
											<Checkbox
												bind:checked={rowData[key]}
												onchange={(e) => {
													rowData[key] === e.target.checked;
													update(rowData);
												}}
											/>
										{:else if columnTypes.get(key)?.component === Input}
											<Input
												bind:value={rowData[key]}
												class={twMerge('rounded-none', columnTypes.get(key)?.props.class)}
												onchange={() => update(rowData)}
												type={columnTypes.get(key)?.props.type}
											/>
										{:else if columnTypes?.get(key)?.component === Select}
											<Select
												bind:value={rowData[key]}
												class={twMerge('rounded-none', columnTypes.get(key)?.props?.class)}
												onchange={() => update(rowData)}
												options={[{ label: '', value: '' }, ...columnTypes.get(key)?.props.options]}
											/>
										{/if}
									</Td>
								{/each}
							{/if}
						</Tr>
					{/each}
				{/if}
			</Tbody>
		</Table>
	</Card>
</Card>
