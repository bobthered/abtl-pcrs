<script lang="ts">
	import { A, Div, Header, Nav } from '$lib/components';
	import { abtlTheme } from './abtlTheme';
	import '../app.css';

	// props
	let { children } = $props();
	const navMap = new Map([
		['/job-classifications', 'Job Classifications'],
		['/pcrs', 'PCRs'],
		['/pcr-reasons', 'PCR Reasons'],
		['/users', 'Users'],
		['/user-profiles', 'User Profiles']
	]);
</script>

<Div class="flex max-h-screen min-h-screen flex-grow flex-col overflow-auto">
	<Header class="bg-primary-500 text-white">
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
