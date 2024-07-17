<script lang="ts">
	import { theme } from 'sveltewind';
	import { abtlTheme } from './abtlTheme';
	import '../app.css';

	// props
	let { children } = $props();

	theme.set(abtlTheme);
</script>

{#if children}
	{@render children()}
{/if}
