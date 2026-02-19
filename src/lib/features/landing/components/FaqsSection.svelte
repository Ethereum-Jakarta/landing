<script lang="ts">
	import faqImage from '../assets/faq.png';
	import EthArt from '../assets/EthArt.svelte';
	import Accordion from '$lib/components/molecules/Accordion.svelte';

	const faqs = [
		{
			id: '1',
			title: 'What is ETHJKT all about?',
			content:
				'ETHJKT will gather the brightest minds in blockchain, offering you a chance to connect with developers, entrepreneurs, and Web3 enthusiasts.'
		},
		{
			id: '2',
			title: 'Who is ETHJKT for? Can beginners join?',
			content:
				'ETHJKT is for everyone! Whether you are a seasoned developer, a curious beginner, or simply interested in blockchain technology, you are welcome to join and learn.'
		},
		{
			id: '3',
			title: 'What happens during the ETHJKT event?',
			content:
				'The event features workshops, hackathons, networking sessions, and talks from industry leaders. You will have the opportunity to build projects, learn new skills, and connect with the community.'
		},
		{
			id: '4',
			title: 'How do I join or register for ETHJKT?',
			content:
				'You can register through our official website. Simply click on the registration button and fill out the form. Early registration is recommended as spots are limited.'
		},
		{
			id: '5',
			title: 'Are there prizes or rewards for participants?',
			content:
				'Yes! There are exciting prizes for hackathon winners, including cash prizes, tokens, and opportunities to connect with potential investors and partners.'
		}
	];
</script>

<section class="relative overflow-hidden bg-background py-16 md:py-24">
	<!-- Decorative Ethereum art -->
	<div class="pointer-events-none absolute inset-0">
		<EthArt class="absolute top-1/2 -left-16 h-auto w-32 -translate-y-1/2 md:-left-10 md:w-40" />
		<EthArt
			class="absolute top-1/2 -right-16 h-auto w-32 -translate-y-1/2 -scale-x-100 md:-right-10 md:w-40"
		/>
	</div>

	<div class="relative container mx-auto px-4">
		<!-- Header -->
		<div class="mb-12 text-center">
			<h2 class="font-montserrat text-3xl font-bold text-foreground md:text-4xl">ETHJKT — FAQs</h2>
			<p class="mt-3 font-inter text-muted">Answers to the most common questions about ETHJKT.</p>
		</div>

		<!-- Content Grid -->
		<div class="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
			<!-- FAQ Accordion -->
			<div class="order-2 lg:order-1">
				<Accordion items={faqs} />
			</div>

			<!-- Image -->
			<div class="order-1 flex justify-center lg:order-2">
				<img src={faqImage} alt="FAQ Illustration" class="max-w-sm md:max-w-md" />
			</div>
		</div>
	</div>
</section>
