<script lang="ts">
	import { A, Div, Header, Nav } from '$lib/components';
	import { abtlTheme } from './abtlTheme';
	import '../app.css';

	// props
	let { children } = $props();
	const navMap = new Map([
		['/job-classifications', 'Job Classifications'],
		['/pcrs', 'PCRs'],
		['/users', 'Users']
	]);
</script>

<Div class="flex max-h-screen min-h-screen flex-grow flex-col overflow-auto">
	<Header class="bg-primary-500">
		<Nav>
			{#each [...navMap] as [href, label]}
				<A class="px-6 py-3" {href}>{label}</A>
			{/each}
		</Nav>
	</Header>
	{#if children}
		{@render children()}
	{/if}
</Div>
