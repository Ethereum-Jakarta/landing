import { SOCIAL_LINKS } from '$lib/constants';
import principleGlobal from './assets/about/principle-global.webp';
import principleInnovation from './assets/about/principle-innovation.webp';
import principleLearn from './assets/about/principle-learn.webp';
import principleNetworking from './assets/about/principle-networking.webp';
import activityMeetups from './assets/roadmap/activity-meetups.webp';
import activityWorkshops from './assets/roadmap/activity-workshops.webp';
import activityStudyGroups from './assets/roadmap/activity-study-groups.webp';
import activityHackathon from './assets/roadmap/activity-hackathon.webp';

export type Breakpoint = 's' | 'm' | 'l';

export const breakpointOf = (w: number): Breakpoint => (w < 768 ? 's' : w < 1100 ? 'm' : 'l');

export const SECTION_IDS = ['top', 'about', 'events', 'programs', 'team', 'faq', 'join'] as const;

/**
 * `bg`/`fg` are theme color names (resolved from CSS vars at animation time) used when a
 * principle card is "lit" on the pinned About board; `rot` is its resting tilt in degrees.
 */
export const PRINCIPLES = [
	{
		num: '01',
		title: 'Global Exposures',
		body: 'We co-host events with partners like MetaMask, Celo and Lisk, so builders in Jakarta meet the wider Ethereum ecosystem without leaving the city.',
		art: principleGlobal,
		bg: 'secondary',
		fg: 'foreground',
		rot: -3,
		col: 1,
		row: 1
	},
	{
		num: '02',
		title: 'Innovation & Building',
		body: 'Ship on Ethereum and its testnets. Members claim free testnet gas from our faucet, so you can deploy, test and break things without buying ETH.',
		art: principleInnovation,
		bg: 'tertiary',
		fg: 'tertiary-foreground',
		rot: 2.5,
		col: 3,
		row: 1
	},
	{
		num: '03',
		title: 'Learn From Industry Experts',
		body: 'Talks run from beginner Solidity to advanced protocol and infrastructure topics, given by people who build on Ethereum every day.',
		art: principleLearn,
		bg: 'background',
		fg: 'foreground',
		rot: -2,
		col: 3,
		row: 2
	},
	{
		num: '04',
		title: 'Networking Opportunities',
		body: 'ETHJKT will gather the brightest minds in blockchain, offering you a chance to connect with developers, entrepreneurs, and Web3 enthusiasts.',
		art: principleNetworking,
		bg: 'primary',
		fg: 'foreground',
		rot: 3,
		col: 1,
		row: 2
	}
];

// Only real people: placeholder cards ("Member 5 / Role Title") read as unfinished.
// Add members here as photos (in /static/team) and roles are confirmed.
export const TEAM = [
	{ name: 'Revo', role: 'Contributor', image: '/team/revo.png' },
	{ name: 'Faisal', role: 'Contributor', image: '/team/faisal.png' },
	{ name: 'Wildan', role: 'Contributor', image: '/team/wildan.png' },
	{ name: 'Rusty', role: 'Contributor', image: '/team/rusty.png' }
];

export const ROADMAP = [
	{
		num: '01',
		title: 'Meetups',
		img: activityMeetups,
		alt: 'Ink illustration of ETHJKT members gathered around a speaker with a microphone',
		desc: 'We regularly organise meetups that feature engaging discussions, presentations, and workshops on Ethereum and related topics, both in-person and online.'
	},
	{
		num: '02',
		title: 'Workshops',
		img: activityWorkshops,
		alt: 'Ink illustration of a mentor explaining a diagram to two builders at laptops',
		desc: 'We offer workshops for Ethereum development, smart contracts, and DApps. Suitable for all skill levels.'
	},
	{
		num: '03',
		title: 'Study Groups',
		img: activityStudyGroups,
		alt: 'Ink illustration of four friends studying around a low table with a cat',
		desc: 'We facilitate small study groups for individuals interested in Ethereum development, smart contracts, and decentralized applications (DApps).'
	},
	{
		num: '04',
		title: 'Hackathon',
		img: activityHackathon,
		alt: 'Ink illustration of a team and a robot celebrating a hackathon win',
		desc: 'We organize hackathons centered around Ethereum development, smart contracts, and decentralized applications (DApps) for builders.'
	}
];

export const FAQS = [
	{
		title: 'What is ETHJKT?',
		content:
			'ETHJKT (Ethereum Jakarta) is a community for people learning and building on Ethereum in Indonesia. We run meetups, workshops, study groups and hackathons, often with partners like MetaMask, Celo and Lisk.'
	},
	{
		title: 'Who is ETHJKT for? Can beginners join?',
		content:
			'ETHJKT is for everyone! Whether you are a seasoned developer, a curious beginner, or simply interested in blockchain technology, you are welcome to join and learn.'
	},
	{
		title: 'How do I join?',
		content:
			'Join our Discord to meet the community, then register for an upcoming event on Lu.ma. Members can also sign in with a wallet to link their accounts and claim free testnet gas.'
	},
	{
		title: 'Do events cost anything?',
		content:
			"Most ETHJKT events are free. Each event's Lu.ma page lists the price, location and how many spots are left, so check there before you go."
	},
	{
		title: 'What happens at a hackathon?',
		content:
			'Teams spend building days shipping a project on Ethereum, then present it on demo day. Hackathons usually come with prizes and a chance to meet partners. Each hackathon page lists its prize pool and rules.'
	}
];

// Discord is the community's home, so it's the one primary action; the rest are follow links.
export const SOCIALS = [
	{ l1: 'Join the', l2: 'Discord', href: SOCIAL_LINKS.discord, icon: '#ic-discord', primary: true },
	{
		l1: 'Follow on',
		l2: 'Instagram',
		href: SOCIAL_LINKS.instagram,
		icon: '#ic-instagram',
		primary: false
	},
	{ l1: 'Follow on', l2: 'X', href: SOCIAL_LINKS.x, icon: '#ic-x', primary: false }
];
