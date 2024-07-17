<script lang="ts">
	import type { Snippet } from 'svelte';
	import { theme } from 'sveltewind';
	import { Button } from 'sveltewind/components';
	import { twMerge } from 'tailwind-merge';

	// types
	type Props = {
		children?: Snippet;
		class?: string;
		variant: string | string[];
	};

	// props
	let classes: string = $state('');
	let { children, class: className, variant = $bindable(), ...props }: Props = $props();

	// effects
	$effect(() => {
		let variants =
			typeof variant === 'string'
				? [theme.get(`button-${variant}`)]
				: Array.isArray(variant)
					? variant.map((variant) => theme.get(`button-${variant}`))
					: [];
		classes = twMerge(...variants, className);
	});
</script>

<Button {...props} class={classes}>
	{#if children}
		{@render children()}
	{/if}
</Button>
