<script lang="ts">
	import { Div } from '$lib/components';
	import { theme } from 'sveltewind';
	import { abtlTheme } from './abtlTheme';
	import '../app.css';

	// props
	let { children } = $props();

	theme.set(abtlTheme);
</script>

<Div class="flex max-h-screen min-h-screen flex-grow flex-col overflow-auto">
	{#if children}
		{@render children()}
	{/if}
</Div>
