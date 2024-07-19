import { theme } from 'sveltewind';
import { sveltewind } from 'sveltewind/themes';

const abtlThemeReplacementMap = new Map([
	['bg-violet-500 ', 'bg-primary-500 '],
	['dark:bg-violet-500', 'dark:bg-primary-500'],
	['group-hover:ring-offset-violet-500', 'group-hover:ring-offset-primary-500'],
	['hover:bg-violet-500/10', 'hover:bg-primary-500/10'],
	['hover:bg-violet-600', 'hover:bg-primary-600'],
	['hover:even:bg-violet-500/10', 'hover:even:bg-primary-500/10'],
	['hover:ring-offset-violet-500', 'hover:ring-offset-primary-500'],
	['focus:bg-violet-500/10', 'focus:bg-primary-500/10'],
	['focus:bg-violet-500/30', 'focus:bg-primary-500/30'],
	['focus:bg-violet-600', 'focus:bg-primary-600'],
	['focus:ring-offset-violet-500', 'focus:ring-offset-primary-500'],
	['focus:ring-violet-500/30', 'focus:ring-primary-500/30'],
	['ring-offset-violet-500', 'ring-offset-primary-500'],
	['text-violet-500', 'text-primary-500'],
	['shadow-violet-500', 'shadow-primary-500']
]);

const abtlTheme = Object.keys(sveltewind).reduce((obj: { [key: string]: string }, key: string) => {
	obj[key] = sveltewind[key].replace(
		new RegExp([...abtlThemeReplacementMap].map(([search]) => search).join('|'), 'g'),
		(match: string) => abtlThemeReplacementMap.get(match)
	);
	return obj;
}, {});

theme.set(abtlTheme);
theme.update({
	'button-delete': 'bg-red-500 hover:bg-red-600 focus:bg-red-600 focus:ring-red-500/30',
	'button-icon': 'px-3',
	'button-ghost':
		'text-current bg-transparent hover:bg-slate-950/10 focus:bg-slate-950/10 focus:ring-slate-950/30 hover:bg-slate-50/10 focus:bg-slate-50/10 focus:ring-slate-50/30',
	modal: 'z-[1]',
	nav: 'flex-row',
	overlay: 'z-[1]',
	th: 'z-[1]',
	tr: 'dark:even:bg-white/5'
});

export { abtlTheme };
