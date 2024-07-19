<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import {
		Button,
		Card,
		Checkbox,
		Div,
		Input,
		Modal,
		P,
		Select,
		Table,
		Tbody,
		Td,
		Th,
		Thead,
		Tr
	} from '$lib/components';
	import type { Fields } from '$lib/dataTable/server';
	import * as format from '$lib/format';
	import { ChevronDown, Plus, RefreshCcw, Trash, TriangleAlert } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	// types
	type Props = {
		columns?: string[];
		columnsToHide?: string[];
		createModalClose?: () => void;
		createModalData?: { [key: string]: any };
		createModalErrorMessage?: string;
		createModalIsVisible?: boolean;
		createModalOpen?: () => void;
		createModalToggle?: () => void;
		deleteModalClose?: () => void;
		deleteModalData?: { [key: string]: any };
		deleteModalIsVisible?: boolean;
		deleteModalOpen?: () => void;
		deleteModalToggle?: () => void;
		fields: Fields;
		header?: Snippet;
		isSortable?: boolean;
		relationOptions?: { [key: string]: { label: any; value: string }[] };
		row?: Snippet;
		rows: any[];
		sortDirection?: -1 | 1;
		sortFn?: (a: any, b: any) => number;
		sortKey?: string;
	};

	// handlers
	const createModalEnhanceHandler = () => {
		return async ({ result }: { result: any }) => {
			if (result.type === 'failure') {
				createModalErrorMessage = 'There was an error.  Please review the info and try again.';
			}
			if (result.type === 'success') {
				createModalData = {};
				createModalClose();
			}
			await invalidateAll();
		};
	};
	const deleteModalEnhanceHandler = () => {
		return async ({ result }: { result: any }) => {
			if (result.type === 'success') {
				deleteModalClose();
			}
			await invalidateAll();
		};
	};
	const update = async ({ id, ...row }: { [key: string]: string }, key: string) => {
		const data: { [key: string]: any } = { id };
		data[key] = row[key];
		const formData = format.object.to.formData(data);
		await fetch('?/update', {
			method: 'POST',
			body: formData
		});
	};

	// props
	let {
		columns = $bindable(),
		columnsToHide = $bindable(),
		createModalClose = $bindable(),
		createModalData = $bindable(),
		createModalErrorMessage = $bindable(),
		createModalIsVisible = $bindable(),
		createModalOpen = $bindable(),
		createModalToggle = $bindable(),
		deleteModalClose = $bindable(),
		deleteModalData = $bindable(),
		deleteModalIsVisible = $bindable(),
		deleteModalOpen = $bindable(),
		deleteModalToggle = $bindable(),
		fields = $bindable(),
		header,
		isSortable = $bindable(),
		relationOptions = $bindable(),
		row,
		rows = $bindable(),
		sortDirection = $bindable(),
		sortFn = $bindable(),
		sortKey = $bindable()
	}: Props = $props();

	// effects
	$effect(() => {
		if (columns === undefined) columns = fields.map(({ name }) => name);
		if (columnsToHide === undefined) columnsToHide = ['id'];
		if (createModalData === undefined) createModalData = {};
		if (isSortable === undefined) isSortable = true;
		if (relationOptions === undefined) relationOptions = {};
		if (rows === undefined) rows = [];
		if (sortDirection === undefined) sortDirection = 1;
		if (sortFn === undefined)
			sortFn = (a: any, b: any) => {
				if (sortDirection === undefined || sortKey === undefined) return 0;

				let value;

				if (typeof a[sortKey] === 'boolean')
					value = a[sortKey] === b[sortKey] ? 0 : a[sortKey] ? -1 : 1;
				if (typeof a[sortKey] === 'number') value = a[sortKey] - b[sortKey];
				if (typeof a[sortKey] === 'string') value = a[sortKey].localeCompare(b[sortKey]);
				if (relationOptions && relationOptions[sortKey]) {
					const aValue =
						relationOptions[sortKey].find((option) => option.value === a[sortKey])?.label || '';
					const bValue =
						relationOptions[sortKey].find((option) => option.value === b[sortKey])?.label || '';
					value = aValue.localeCompare(bValue);
				}

				return value * sortDirection;
			};
		if (sortKey === undefined)
			sortKey = columns.filter((columnKey) => !columnsToHide.includes(columnKey))[0];
	});
</script>

<Card class="overflow-auto p-0">
	<Card class="flex flex-row items-center justify-end space-x-2 rounded-none p-4">
		<Button
			class="p-2"
			onclick={() => {
				invalidateAll();
			}}
			variant="icon"
		>
			<RefreshCcw class="h-4 w-4" />
		</Button>
		<Button
			class="p-2"
			onclick={() => {
				createModalErrorMessage = undefined;
				createModalOpen();
			}}
			variant="icon"
		>
			<Plus class="h-4 w-4" />
		</Button>
	</Card>
	<Card class="flex-grow items-start overflow-auto rounded-none p-0">
		<Table>
			<Thead>
				{#if header}
					{@render header()}
				{:else}
					<Th />
					{#each columns?.filter((columnKey) => !columnsToHide.includes(columnKey)) as columnKey}
						{@const column = fields.find(({ name }) => name === columnKey)}
						<Th class="p-0">
							{#if isSortable}
								<Button
									class="w-full justify-between space-x-4 rounded-none text-base"
									onclick={() => {
										sortDirection = sortKey === columnKey ? sortDirection * -1 : 1;
										sortKey = columnKey;
									}}
									variant={['ghost']}
								>
									<span>
										{columnKey}
									</span>

									<Div
										class={twMerge(
											'transition duration-200',
											sortKey === columnKey ? 'scale-100' : 'scale-0'
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
									{columnKey}
								</Div>
							{/if}
						</Th>
					{/each}
				{/if}
			</Thead>
			<Tbody>
				{#each rows.sort(sortFn) as rowData}
					<Tr>
						{#if row}
							{@render row(rowData)}
						{:else}
							<Td class="px-2 py-0">
								<Button
									class="p-2"
									onclick={() => {
										deleteModalData = rowData;
										deleteModalOpen();
									}}
									tabindex="-1"
									type="submit"
									variant={['icon', 'delete']}
								>
									<Trash class="h-4 w-4" />
								</Button>
							</Td>
							{#each columns.filter((columnKey) => !columnsToHide.includes(columnKey)) as columnKey}
								{@const column = fields.find(({ name }) => name === columnKey)}
								<Td class="p-0">
									{#if relationOptions && relationOptions[columnKey]}
										<Select
											bind:value={rowData[columnKey]}
											class={twMerge('rounded-none')}
											onchange={() => update(rowData, columnKey)}
											options={relationOptions[columnKey]}
										/>
									{:else if column.isId}
										<Input
											bind:value={rowData[columnKey]}
											class={twMerge('w-[18rem] rounded-none')}
											onblur={() => update(rowData, columnKey)}
										/>
									{:else if column.type === 'Boolean'}
										<Checkbox
											bind:checked={rowData[columnKey]}
											onchange={() => update(rowData, columnKey)}
										/>
									{:else if column.type === 'DateTime'}
										<Input
											bind:value={rowData[columnKey]}
											class={twMerge('w-[10rem] rounded-none text-right')}
											onblur={() => update(rowData, columnKey)}
											type="date"
										/>
									{:else if column.type === 'Float'}
										<Input
											bind:value={rowData[columnKey]}
											class={twMerge('w-[10rem] rounded-none text-right')}
											onblur={() => update(rowData, columnKey)}
											type="number"
										/>
									{:else if column.type === 'Int'}
										<Input
											bind:value={rowData[columnKey]}
											class={twMerge('w-[10rem] rounded-none text-right')}
											onblur={() => update(rowData, columnKey)}
											type="number"
										/>
									{:else if column.type === 'String'}
										<Input
											bind:value={rowData[columnKey]}
											class={twMerge('rounded-none')}
											onblur={() => update(rowData, columnKey)}
										/>
									{/if}
								</Td>
							{/each}
						{/if}
					</Tr>
				{/each}
			</Tbody>
		</Table>
	</Card>
</Card>

<Modal
	bind:close={createModalClose}
	bind:isVisible={createModalIsVisible}
	bind:open={createModalOpen}
	bind:toggle={createModalToggle}
>
	<form
		action="?/create"
		class="flex flex-col space-y-6"
		method="POST"
		use:enhance={createModalEnhanceHandler}
	>
		<Div class="grid grid-cols-[fit-content(0px)_1fr] items-center gap-x-4 gap-y-2">
			{#each columns.filter((columnKey) => !columnsToHide.includes(columnKey)) as columnKey}
				{@const column = fields.find(({ name }) => name === columnKey)}
				<Div class="font-bold">{columnKey}</Div>
				{#if relationOptions && relationOptions[columnKey]}
					<Select
						bind:value={createModalData[columnKey]}
						class={twMerge('w-[18rem]')}
						name={columnKey}
						options={[{ label: '', value: '' }, ...relationOptions[columnKey]]}
					/>
				{:else if column.isId}
					<Input
						bind:value={createModalData[columnKey]}
						class={twMerge('w-[18rem]')}
						name={columnKey}
					/>
				{:else if column.type === 'Boolean'}
					<Checkbox bind:checked={createModalData[columnKey]} name={columnKey} />
				{:else if column.type === 'DateTime'}
					<Input
						bind:value={createModalData[columnKey]}
						class={twMerge('w-[18rem] text-right')}
						name={columnKey}
						type="date"
					/>
				{:else if column.type === 'Float'}
					<Input
						bind:value={createModalData[columnKey]}
						class={twMerge('w-[18rem] text-right')}
						name={columnKey}
						type="number"
					/>
				{:else if column.type === 'Int'}
					<Input
						bind:value={createModalData[columnKey]}
						class={twMerge('w-[18rem] text-right')}
						name={columnKey}
						type="number"
					/>
				{:else if column.type === 'String'}
					<Input
						bind:value={createModalData[columnKey]}
						class={twMerge('w-[18rem]')}
						name={columnKey}
					/>
				{/if}
			{/each}
		</Div>
		<P
			class="text-red-500"
			isVisible={createModalErrorMessage !== undefined && createModalErrorMessage !== ''}
			transition={[slide]}
		>
			{createModalErrorMessage}
		</P>
		<Div class="flex items-center justify-end space-x-2">
			<Button onclick={createModalClose} variant="ghost">Cancel</Button>
			<Button type="submit">Create</Button>
		</Div>
	</form>
</Modal>

<Modal
	bind:close={deleteModalClose}
	bind:isVisible={deleteModalIsVisible}
	bind:open={deleteModalOpen}
	bind:toggle={deleteModalToggle}
>
	<form
		action="?/delete"
		class="flex flex-col space-y-6"
		method="POST"
		use:enhance={deleteModalEnhanceHandler}
	>
		<TriangleAlert class="mx-auto h-[6rem] w-[6rem] text-red-500" />
		<P class="text-red-500">
			Are you sure you want to delete {sortKey}
			"{relationOptions && relationOptions[sortKey]
				? relationOptions[sortKey].find((option) => option.value === deleteModalData[sortKey])
						?.label || deleteModalData[sortKey]
				: deleteModalData[sortKey]}"?<br />
			<span class="font-bold uppercase">This is cannot be undone</span>
		</P>
		<Div class="flex items-center justify-end space-x-2">
			<Button onclick={deleteModalClose} variant="ghost">Cancel</Button>
			<Button variant="delete" type="submit">Delete</Button>
		</Div>
		<Input bind:value={deleteModalData.id} name="id" type="hidden" />
	</form>
</Modal>
