<script lang="ts">
	import { Div, Select } from 'sveltewind/components';
	import { ChevronDown } from 'lucide-svelte';
	import { twMerge } from 'tailwind-merge';

	// types
	type Props = {
		class?: string;
		children?: any;
		isVisible?: boolean;
		options?: { label: string; value: any }[];
		this?: any;
		transition?: any[];
		use?: any[];
		value: any;
	};

	// props
	let classes = $state('');
	let {
		class: className = undefined,
		children,
		isVisible = $bindable(),
		options = $bindable(),
		transition = $bindable(),
		use = [],
		value = $bindable(),
		...props
	}: Props = $props();

	// effects
	$effect(() => {
		classes = twMerge('pr-16', className);
	});

	$effect(() => {
		if (isVisible === undefined) isVisible = true;
	});
</script>

<Div bind:isVisible class="relative">
	<Select {...props} bind:value class={classes} {options} {transition} {use}>
		{#if children}
			{@render children()}
		{/if}
	</Select>
	<ChevronDown class="pointer-events-none absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2" />
</Div>
