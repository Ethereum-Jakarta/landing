import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Breakpoint } from './data';

/**
 * All landing-page motion (GSAP timelines, scroll scrubs, pointer parallax, and the
 * scroll-following paper plane). Elements opt in via `data-a="<name>"` hooks plus a few
 * generic attributes (`data-amb`, `data-depth`, `data-cloud`, `data-draw`, `data-sil`, ...).
 *
 * Call once the DOM for the current layout is rendered; the returned function reverts
 * every tween/listener so it can be re-run when the breakpoint layout changes.
 */
export interface MotionOptions {
	bp: Breakpoint;
	reduced: boolean;
	planeOn: boolean;
	/** Registers a callback the FAQ toggle can fire to spin the decorative star. */
	onFaqSpin?: (fn: (() => void) | null) => void;
}

export function initLandingMotion(root: HTMLElement, opts: MotionOptions): () => void {
	gsap.registerPlugin(ScrollTrigger);
	const ST = ScrollTrigger;
	const R = opts.reduced;
	const bp = opts.bp;
	const wide = bp !== 's';
	const fine = window.matchMedia('(pointer: fine)').matches;
	const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = root) =>
		Array.from(r.querySelectorAll<T>(s));
	const A = <T extends Element = HTMLElement>(n: string) =>
		root.querySelector<T>(`[data-a="${n}"]`);
	const offs: Array<() => void> = [];
	const on = <K extends keyof HTMLElementEventMap>(
		el: EventTarget | null,
		ev: K | string,
		fn: (e: PointerEvent) => void,
		o?: AddEventListenerOptions
	) => {
		if (!el) return;
		el.addEventListener(ev, fn as EventListener, o);
		offs.push(() => el.removeEventListener(ev, fn as EventListener, o));
	};
	const tokenColor = (name: string) =>
		getComputedStyle(root).getPropertyValue(`--color-${name}`).trim();
	let ptr: { x: number; y: number } | null = null;
	let raf = 0;
	let disposed = false;

	const ctx = gsap.context(() => {
		const hero = root.querySelector<HTMLElement>('#top');

		if (!R) {
			const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power4.out' } });
			tl.from(
				$$('[data-layer] [data-cloud]'),
				{ y: 50, opacity: 0, duration: 1.8, stagger: 0.07, ease: 'power2.out' },
				0
			)
				.from(A('w-build'), { yPercent: 110, duration: 1 }, 0.3)
				.fromTo(
					A('w-future'),
					{ clipPath: 'inset(0% 100% 0% 0%)', x: -14 },
					{ clipPath: 'inset(0% 0% 0% 0%)', x: 0, duration: 1.15, ease: 'power3.inOut' },
					0.55
				)
				.from(
					A('carrier1'),
					{
						x: () => -window.innerWidth * 0.45,
						y: () => -window.innerHeight * 0.28,
						rotation: -14,
						duration: 1.7,
						ease: 'power3.out'
					},
					0.45
				)
				.from(A('tag1'), { rotation: -70, duration: 1.4, ease: 'elastic.out(1, 0.4)' }, 1.7)
				.fromTo(
					A('w-web3'),
					{ opacity: 0, scale: 1.25, filter: 'blur(12px)' },
					{
						opacity: 1,
						scale: 1,
						filter: 'blur(0px)',
						duration: 1.3,
						ease: 'power3.out',
						clearProps: 'filter'
					},
					0.95
				)
				.from(
					A('carrier2'),
					{
						x: () => window.innerWidth * 0.5,
						y: () => -window.innerHeight * 0.2,
						rotation: 14,
						duration: 1.7,
						ease: 'power3.out'
					},
					0.8
				)
				.from(A('tag2'), { rotation: 60, duration: 1.4, ease: 'elastic.out(1, 0.4)' }, 2.05)
				.from(A('w-at'), { yPercent: 110, duration: 0.8 }, 1.25)
				.from(A('w-ethjkt'), { yPercent: 115, duration: 1.1, ease: 'expo.out' }, 1.4)
				.from(A('hero-sub'), { y: 20, opacity: 0, duration: 0.9 }, 1.85)
				.from(
					A('hero-cta'),
					{ y: 24, opacity: 0, scale: 0.94, duration: 0.9, ease: 'back.out(1.8)' },
					2.0
				)
				.from(A('hero-cue'), { opacity: 0, duration: 0.8 }, 2.5);

			$$('[data-a="wing"]').forEach((w, i) =>
				gsap.to(w, {
					scaleY: 0.25,
					transformOrigin: '50% 50%',
					duration: 0.15 + i * 0.03,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut'
				})
			);
			$$('[data-a="bob"]').forEach((b, i) =>
				gsap.to(b, {
					y: i ? -5 : -7,
					duration: 1.4 + i * 0.3,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut'
				})
			);
			gsap.to(A('tag1'), {
				rotation: -7,
				duration: 1.7,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
				delay: 3.2
			});
			gsap.to(A('tag2'), {
				rotation: 12,
				duration: 1.9,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
				delay: 3.4
			});
			gsap.fromTo(
				A('hero-cue-line'),
				{ scaleY: 1 },
				{
					scaleY: 0.35,
					transformOrigin: '50% 0%',
					duration: 1.1,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut'
				}
			);

			const st = () => ({
				trigger: hero,
				start: 'top top',
				end: 'bottom top',
				scrub: true
			});
			gsap.to(A('hero-content'), { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: st() });
			gsap.to(A('layer-bg'), { yPercent: -8, ease: 'none', scrollTrigger: st() });
			gsap.to(A('layer-mid'), { yPercent: -20, ease: 'none', scrollTrigger: st() });
			gsap.to(A('layer-fg'), { yPercent: -60, ease: 'none', scrollTrigger: st() });
			const sky = A('hero-skyline');
			if (sky) {
				gsap.from(sky.firstElementChild, {
					yPercent: 60,
					opacity: 0,
					duration: 2.4,
					delay: 0.25,
					ease: 'power3.out'
				});
				gsap.to(sky, { yPercent: -26, ease: 'none', scrollTrigger: st() });
			}
			const cT = A('crystal-travel');
			const cF = cT?.querySelector('[data-a="crystal-float"]');
			if (cT && cF) {
				gsap.from(cF, { scale: 0, opacity: 0, duration: 1.2, delay: 1.9, ease: 'back.out(1.7)' });
				gsap.to(cT, {
					y: () => window.innerHeight * 0.62,
					rotation: 38,
					scale: 0.55,
					opacity: 0,
					ease: 'none',
					scrollTrigger: {
						trigger: hero,
						start: 'top top',
						end: 'bottom top',
						scrub: 0.8,
						invalidateOnRefresh: true
					}
				});
			}
			$$('[data-a="crystal-float"]').forEach((c, i) =>
				gsap.to(c, {
					y: -12 - (i % 2) * 4,
					x: i % 2 ? 4 : -3,
					rotation: i % 2 ? 20 : -8,
					duration: 4.2 + i * 0.7,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut',
					delay: -i * 1.3
				})
			);
			gsap.to(A('hero-cue'), {
				opacity: 0,
				ease: 'none',
				scrollTrigger: { trigger: hero, start: 'top top', end: '12% top', scrub: true }
			});

			$$('[data-cloud]').forEach((c, i) => {
				const layer = c.closest('[data-layer]');
				const kind = layer ? layer.getAttribute('data-layer') : 'mid';
				const amp = kind === 'fg' ? 60 : kind === 'mid' ? 44 : 26;
				const dur = kind === 'fg' ? 14 : kind === 'mid' ? 20 : 30;
				gsap.to(c, {
					x: (i % 2 ? -1 : 1) * amp,
					duration: dur + (i % 3) * 4,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut',
					delay: -i * 2.3
				});
			});

			if (wide && fine && hero) {
				const qs = ['layer-bg', 'layer-mid', 'layer-fg'].map((n) =>
					gsap.quickTo(A(n), 'x', { duration: 1.2, ease: 'power3.out' })
				);
				const skyX = gsap.quickTo(A('hero-skyline'), 'x', { duration: 1.6, ease: 'power3.out' });
				on(hero, 'pointermove', (e) => {
					const nx = e.clientX / window.innerWidth - 0.5;
					qs[0](nx * -10);
					qs[1](nx * -24);
					qs[2](nx * -40);
					skyX(nx * -6);
					ptr = { x: e.clientX, y: e.clientY };
				});
				on(hero, 'pointerleave', () => {
					ptr = null;
				});
			}

			gsap.from($$('[data-a="about-w"]'), {
				yPercent: 110,
				duration: 1,
				stagger: 0.1,
				ease: 'power4.out',
				scrollTrigger: { trigger: '#about', start: 'top 85%' }
			});
			gsap.from(A('about-sub'), {
				y: 20,
				opacity: 0,
				duration: 0.9,
				ease: 'power3.out',
				scrollTrigger: { trigger: A('about-sub'), start: 'top 92%' }
			});
			$$('[data-a="sec-title"]').forEach((t) =>
				gsap.from(t, {
					y: 40,
					opacity: 0,
					duration: 1,
					ease: 'power4.out',
					scrollTrigger: { trigger: t, start: 'top 88%' }
				})
			);
			$$('[data-a="sec-sub"]').forEach((t) =>
				gsap.from(t, {
					y: 20,
					opacity: 0,
					duration: 0.9,
					delay: 0.1,
					ease: 'power3.out',
					scrollTrigger: { trigger: t, start: 'top 92%' }
				})
			);
			$$('[data-a="reveal"]').forEach((el) =>
				gsap.from(el, {
					y: 40,
					opacity: 0,
					duration: 0.9,
					ease: 'power3.out',
					scrollTrigger: { trigger: el, start: 'top 92%' }
				})
			);
		}

		// Deterministic per-element jitter so ambient motion isn't in lockstep.
		const rnd = (i: number) => {
			const v = Math.sin((i + 1) * 12.9898) * 43758.5453;
			return v - Math.floor(v);
		};
		$$<SVGPathElement>('[data-draw]').forEach((p) => {
			const L = p.getTotalLength();
			p.style.strokeDasharray = `${L} ${L}`;
			p.style.strokeDashoffset = R ? '0' : String(L);
			if (R) return;
			const dl = parseFloat(p.getAttribute('data-draw-delay') ?? '') || 0;
			const cfg = { strokeDashoffset: 0, duration: dl ? 0.35 : 1.1, ease: 'power2.inOut' };
			if (p.getAttribute('data-draw') === 'load') gsap.to(p, { ...cfg, delay: 2.4 + dl });
			else
				gsap.to(p, {
					...cfg,
					delay: dl,
					scrollTrigger: { trigger: p.closest('section') || p, start: 'top 70%' }
				});
		});

		if (!R) {
			const DEPTH: Record<string, [number, number]> = {
				far: [18, 3],
				mid: [44, 6],
				near: [80, 11]
			};
			const ptrQ: Array<[(v: number) => void, number]> = [];
			$$('[data-depth]').forEach((el) => {
				const d = DEPTH[el.getAttribute('data-depth') ?? ''] || DEPTH.mid;
				const sec = el.closest('section') || el.parentElement;
				gsap.fromTo(
					el,
					{ y: d[0] },
					{
						y: -d[0],
						ease: 'none',
						scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true }
					}
				);
				if (wide && fine)
					ptrQ.push([gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }), d[1]]);
			});
			if (ptrQ.length)
				on(window, 'pointermove', (e) => {
					const nx = e.clientX / window.innerWidth - 0.5;
					ptrQ.forEach(([q, a]) => q(nx * -2 * a));
				});

			$$('[data-amb]').forEach((el, i) => {
				const r = rnd(i);
				(el.getAttribute('data-amb') ?? '').split(' ').forEach((k) => {
					if (k === 'float-slow')
						gsap.to(el, {
							y: -(6 + r * 6),
							x: (r - 0.5) * 8,
							rotation: (r - 0.5) * 10,
							duration: 7 + r * 5,
							repeat: -1,
							yoyo: true,
							ease: 'sine.inOut',
							delay: -r * 6
						});
					else if (k === 'float-mid')
						gsap.to(el, {
							y: -(8 + r * 8),
							rotation: (r - 0.5) * 14,
							duration: 5 + r * 3,
							repeat: -1,
							yoyo: true,
							ease: 'sine.inOut',
							delay: -r * 5
						});
					else if (k === 'drift-left' || k === 'drift-right') {
						const amp = parseFloat(el.getAttribute('data-amp') ?? '') || 24;
						const s0 = k === 'drift-left' ? 1 : -1;
						gsap.fromTo(
							el,
							{ x: s0 * amp },
							{
								x: -s0 * amp,
								duration: 20 + r * 30,
								repeat: -1,
								yoyo: true,
								ease: 'sine.inOut',
								delay: -r * 20
							}
						);
					} else if (k === 'rotate-slow')
						gsap.to(el, {
							rotation: (r > 0.5 ? 1 : -1) * 360,
							duration: 15 + r * 25,
							repeat: -1,
							ease: 'none'
						});
					else if (k === 'twinkle')
						gsap.fromTo(
							el,
							{ scale: 1, opacity: 1 },
							{
								scale: 0.6 + r * 0.15,
								opacity: 0.35,
								duration: 1 + r * 2,
								repeat: -1,
								yoyo: true,
								ease: 'sine.inOut',
								delay: -r * 4,
								transformOrigin: '50% 50%'
							}
						);
					else if (k === 'bob')
						gsap.to(el, {
							y: -(4 + r * 5),
							duration: 1.6 + r * 1.4,
							repeat: -1,
							yoyo: true,
							ease: 'sine.inOut',
							delay: -r * 2
						});
					else if (k === 'cross') {
						const dur = parseFloat(el.getAttribute('data-dur') ?? '') || 48;
						const dir = el.getAttribute('data-dir') === 'left' ? -1 : 1;
						const w = () => el.parentElement?.clientWidth || window.innerWidth;
						gsap.fromTo(
							el,
							{ x: () => (dir > 0 ? -160 : w() + 160) },
							{
								x: () => (dir > 0 ? w() + 160 : -160),
								duration: dur,
								repeat: -1,
								ease: 'none',
								delay: -r * dur
							}
						);
					}
				});
			});
			$$('[data-wing]').forEach((w, i) =>
				gsap.to(w, {
					scaleY: 0.2,
					transformOrigin: '50% 50%',
					duration: 0.14 + rnd(i + 40) * 0.08,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut'
				})
			);
			$$('[data-reveal-x]').forEach((el) =>
				gsap.fromTo(
					el,
					{ clipPath: 'inset(0% 100% 0% 0%)' },
					{
						clipPath: 'inset(0% 0% 0% 0%)',
						duration: 1.6,
						ease: 'power2.inOut',
						scrollTrigger: { trigger: el.closest('section') || el, start: 'top 55%' }
					}
				)
			);
			const shards = $$('[data-a="rm-shard"]');
			if (shards.length)
				gsap.from(shards, {
					x: (i) => (i % 2 ? -1 : 1) * 90,
					y: 50,
					scale: 0.3,
					opacity: 0,
					duration: 1.2,
					stagger: 0.12,
					ease: 'back.out(1.6)',
					scrollTrigger: { trigger: A('rm-track') || '#programs', start: 'top 60%' }
				});
			const fsp = A('faq-spark');
			if (fsp)
				opts.onFaqSpin?.(() =>
					gsap.to(fsp, { rotation: '+=72', duration: 0.6, ease: 'back.out(2.4)' })
				);
			if (fine) {
				$$('[data-spark-host]').forEach((h) => {
					const sp = h.querySelector('[data-spark]');
					if (!sp) return;
					on(h, 'pointerenter', () =>
						gsap.fromTo(
							sp,
							{ scale: 0, rotation: -70 },
							{ scale: 1, rotation: 0, duration: 0.55, ease: 'back.out(3)', overwrite: true }
						)
					);
					on(h, 'pointerleave', () =>
						gsap.to(sp, { scale: 0, duration: 0.25, ease: 'power2.in', overwrite: true })
					);
				});
				const ca = A('cta-arrow');
				const cl = A('hero-cta')?.querySelector('a');
				if (ca && cl) {
					on(cl, 'pointerenter', () =>
						gsap.to(ca, { x: 7, y: 3, rotation: 5, duration: 0.45, ease: 'back.out(2.4)' })
					);
					on(cl, 'pointerleave', () =>
						gsap.to(ca, { x: 0, y: 0, rotation: 0, duration: 0.6, ease: 'power3.out' })
					);
				}
			}
		}

		// About: pinned principle board with a dashed path that draws card-to-card.
		const prT = A('pr-track');
		if (!R)
			$$('[data-a="about-people"]').forEach((p) =>
				gsap.to(p, { y: -10, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
			);
		const board = A('pr-board');
		const pPath = A<SVGPathElement>('pr-path');
		const mPath = A<SVGPathElement>('pr-mpath');
		const ghost = A<SVGPathElement>('pr-ghost');
		if (prT && board && pPath && mPath && ghost) {
			const cards = $$('[data-a="pc"]');
			const arts = $$('[data-a="pc-art"]');
			const cstars = cards.map((c) => c.querySelector('[data-a="pc-spark"]'));
			let segs = [1, 1, 1, 1];
			let cum = [0, 1, 2, 3, 4];
			let total = 4;
			let prog = 0;
			const draw = (p: number) => {
				prog = p;
				const q = Math.max(0, Math.min(1, p)) * 4;
				const i = Math.min(3, Math.floor(q));
				const fr = q - i;
				mPath.setAttribute('stroke-dashoffset', (total - (cum[i] + segs[i] * fr)).toFixed(1));
			};
			const build = () => {
				const br = board.getBoundingClientRect();
				if (!br.width) return;
				const pts = cards.map((c) => {
					const r = c.getBoundingClientRect();
					return [r.left - br.left + r.width / 2, r.top - br.top + r.height / 2];
				});
				const cx = br.width / 2;
				const cy = br.height / 2;
				const f = (p: number[]) => p[0].toFixed(1) + ' ' + p[1].toFixed(1);
				let d = 'M' + f(pts[0]);
				segs = [];
				cum = [0];
				for (let i = 0; i < 4; i++) {
					const a = pts[i];
					const b = pts[(i + 1) % 4];
					let nx = (a[0] + b[0]) / 2 - cx;
					let ny = (a[1] + b[1]) / 2 - cy;
					const nl = Math.hypot(nx, ny) || 1;
					nx /= nl;
					ny /= nl;
					const k = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.3;
					const c1 = [a[0] + (b[0] - a[0]) * 0.2 + nx * k, a[1] + (b[1] - a[1]) * 0.2 + ny * k];
					const c2 = [a[0] + (b[0] - a[0]) * 0.8 + nx * k, a[1] + (b[1] - a[1]) * 0.8 + ny * k];
					const seg = 'C' + f(c1) + ' ' + f(c2) + ' ' + f(b);
					const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
					tmp.setAttribute('d', 'M' + f(a) + seg);
					pPath.ownerSVGElement?.appendChild(tmp);
					const L = tmp.getTotalLength();
					tmp.remove();
					segs.push(L);
					cum.push(cum[i] + L);
					d += seg;
				}
				total = cum[4];
				[pPath, mPath, ghost].forEach((p) => p.setAttribute('d', d));
				mPath.setAttribute('stroke-dasharray', total.toFixed(1) + ' ' + total.toFixed(1));
				draw(prog);
			};
			let cur = -1;
			const setIdx = (i: number) => {
				if (i === cur) return;
				cur = i;
				cards.forEach((c, j) => {
					const rot = parseFloat(c.dataset.rot ?? '') || 0;
					const lit = j <= i;
					const act = j === i;
					c.style.zIndex = act ? '4' : '2';
					gsap.to(c, {
						backgroundColor: tokenColor(lit ? (c.dataset.bg ?? 'background') : 'background'),
						color: tokenColor(lit ? (c.dataset.fg ?? 'foreground') : 'foreground'),
						scale: act ? 1.05 : j > i ? 0.96 : 1,
						rotation: act ? 0 : rot,
						y: act ? -6 : 0,
						duration: 0.7,
						ease: 'power3.out',
						overwrite: 'auto'
					});
					if (cstars[j])
						gsap.to(cstars[j], {
							scale: act ? 1 : 0,
							rotation: act ? 0 : -90,
							duration: act ? 0.7 : 0.3,
							delay: act ? 0.15 : 0,
							ease: act ? 'back.out(3)' : 'power2.in',
							overwrite: 'auto'
						});
					gsap.to(arts[j], {
						scale: j > i ? 0.82 : 1,
						opacity: j > i ? 0.4 : 1,
						y: act ? -10 : 0,
						rotation: act ? -5 : 0,
						duration: act ? 0.9 : 0.6,
						ease: act ? 'back.out(2.2)' : 'power3.out',
						overwrite: 'auto'
					});
				});
			};
			build();
			setIdx(0);
			const onRf = () => build();
			ST.addEventListener('refresh', onRf);
			offs.push(() => ST.removeEventListener('refresh', onRf));
			ST.create({
				trigger: prT,
				start: 'top top',
				end: 'bottom bottom',
				onUpdate: (st) => {
					draw(st.progress);
					setIdx(Math.min(3, Math.floor(st.progress * 4.0001)));
				}
			});
			gsap.from(board, {
				y: 60,
				opacity: 0,
				duration: 1.1,
				ease: 'power3.out',
				scrollTrigger: { trigger: prT, start: 'top 75%' }
			});
			if (fine)
				cards.forEach((c, j) => {
					on(c, 'pointerenter', () =>
						gsap.to(arts[j], {
							rotation: 6,
							y: -14,
							duration: 0.5,
							ease: 'back.out(2.4)',
							overwrite: 'auto'
						})
					);
					on(c, 'pointerleave', () => {
						const a = j === cur;
						gsap.to(arts[j], {
							rotation: a ? -5 : 0,
							y: a ? -10 : 0,
							duration: 0.6,
							ease: 'power3.out',
							overwrite: 'auto'
						});
					});
				});
		}

		// Team: horizontal scroll-scrub, staggered card flip-in, and pointer tilt.
		const vp = A('team-viewport');
		const tt = A('team-track');
		const tms = $$('[data-a="tm"]');
		const inners = $$('[data-a="tm-inner"]');
		if (vp && tt && !R && wide) {
			const dist = () => Math.max(0, tt.scrollWidth - vp.clientWidth);
			gsap.fromTo(
				tt,
				{ x: () => vp.clientWidth * 0.12 },
				{
					x: () => -dist(),
					ease: 'none',
					scrollTrigger: {
						trigger: '#team',
						start: 'top bottom',
						end: 'bottom top',
						scrub: 0.6,
						invalidateOnRefresh: true
					}
				}
			);
		}
		if (!R && inners.length) {
			gsap.set(inners, { rotationY: 180 });
			gsap.to(inners, {
				rotationY: 0,
				duration: 1.1,
				stagger: 0.07,
				ease: 'power3.inOut',
				scrollTrigger: { trigger: vp, start: 'top 78%' }
			});
		}
		if (!R && fine) {
			tms.forEach((el, i) => {
				const tilt = el.querySelector<HTMLElement>('[data-a="tm-tilt"]');
				const shine = el.querySelector<HTMLElement>('[data-a="tm-shine"]');
				if (!tilt) return;
				const enter = () => {
					gsap.to(tilt, { y: -12, scale: 1.05, duration: 0.5, ease: 'power3.out' });
					if (shine) shine.style.opacity = '1';
					tms.forEach((o, j) => {
						const d = j - i;
						if (d && Math.abs(d) <= 2)
							gsap.to(o, {
								x: Math.sign(d) * (3 - Math.abs(d)) * 8,
								duration: 0.6,
								ease: 'power3.out'
							});
					});
				};
				const move = (e: PointerEvent) => {
					const r = tilt.getBoundingClientRect();
					const px = (e.clientX - r.left) / r.width;
					const py = (e.clientY - r.top) / r.height;
					gsap.to(tilt, {
						rotationX: -(py - 0.5) * 16,
						rotationY: (px - 0.5) * 18,
						duration: 0.5,
						ease: 'power2.out'
					});
					if (shine)
						shine.style.background = `radial-gradient(circle at ${(px * 100).toFixed(0)}% ${(py * 100).toFixed(0)}%, rgb(255 255 255 / 0.35), rgb(255 255 255 / 0) 55%)`;
				};
				const leave = () => {
					gsap.to(tilt, {
						rotationX: 0,
						rotationY: 0,
						y: 0,
						scale: 1,
						duration: 0.9,
						ease: 'elastic.out(1, 0.5)'
					});
					if (shine) shine.style.opacity = '0';
					tms.forEach((o) => gsap.to(o, { x: 0, duration: 0.7, ease: 'power3.out' }));
				};
				on(tilt, 'pointerenter', enter);
				on(tilt, 'pointermove', move);
				on(tilt, 'pointerleave', leave);
				on(tilt, 'focus', enter);
				on(tilt, 'blur', leave);
			});
		}

		// Roadmap: pinned row that splits into four cards which flip one after another.
		const rTrack = A('rm-track');
		const rInners = $$('[data-a="rm-inner"]');
		const row = A('rm-row');
		if (rTrack && row) {
			const fronts = $$('[data-a="rm-front"]');
			const n = fronts.length;
			fronts.forEach((f, i) =>
				gsap.set(f, {
					borderRadius:
						i === 0 ? '24px 0px 0px 24px' : i === n - 1 ? '0px 24px 24px 0px' : '0px 0px 0px 0px'
				})
			);
			gsap.from([A('rm-head'), row], {
				y: 50,
				opacity: 0,
				duration: 1.1,
				stagger: 0.12,
				ease: 'power3.out',
				scrollTrigger: { trigger: rTrack, start: 'top 75%' }
			});
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: rTrack,
					start: 'top top',
					end: 'bottom bottom',
					scrub: 0.8,
					invalidateOnRefresh: true
				}
			});
			tl.to(
				row,
				{
					gap: () => Math.round(Math.min(28, window.innerWidth * 0.018)) + 'px',
					duration: 1,
					ease: 'power2.inOut'
				},
				0.1
			).to(fronts, { borderRadius: '24px 24px 24px 24px', duration: 1, ease: 'power2.inOut' }, 0.1);
			rInners.forEach((el, i) =>
				tl.to(el, { rotationY: 180, duration: 1, ease: 'power2.inOut' }, 1.2 + i * 0.6)
			);
			tl.to({}, { duration: 0.5 });
		} else if (rInners.length) {
			if (R) gsap.set(rInners, { rotationY: 180 });
			else
				rInners.forEach((el) =>
					gsap.to(el, {
						rotationY: 180,
						duration: 1.2,
						ease: 'power3.inOut',
						scrollTrigger: { trigger: el.parentElement, start: 'top 62%' }
					})
				);
		}

		if (!R) {
			$$('[data-a="ethart"]').forEach((el) =>
				gsap.fromTo(
					el,
					{ y: 70 },
					{
						y: -70,
						ease: 'none',
						scrollTrigger: {
							trigger: el.parentElement,
							start: 'top bottom',
							end: 'bottom top',
							scrub: true
						}
					}
				)
			);
			if (rTrack)
				$$('[data-a="rm-crystal"]').forEach((c, i) =>
					gsap.fromTo(
						c,
						{ y: i ? 60 : -40, rotation: 0 },
						{
							y: i ? -60 : 50,
							rotation: i ? -30 : 40,
							ease: 'none',
							scrollTrigger: {
								trigger: rTrack,
								start: 'top bottom',
								end: 'bottom top',
								scrub: true
							}
						}
					)
				);
			$$('[data-a="rm-art"]').forEach((a, i) =>
				gsap.to(a, {
					y: -5,
					duration: 2.8 + i * 0.3,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut',
					delay: -i
				})
			);
			const fa = A('faq-art');
			if (fa) {
				gsap.from(fa, {
					y: 50,
					opacity: 0,
					rotation: -4,
					duration: 1.1,
					ease: 'power3.out',
					scrollTrigger: { trigger: fa, start: 'top 85%' }
				});
				gsap.to(fa, {
					y: -12,
					rotation: 1.5,
					duration: 3,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut',
					delay: 1
				});
			}

			const join = root.querySelector('#join');
			gsap.from(A('join-title'), {
				y: 50,
				opacity: 0,
				duration: 1.1,
				ease: 'power4.out',
				scrollTrigger: { trigger: join, start: 'top 60%' }
			});
			gsap.from($$('[data-a="join-btn"]'), {
				y: 30,
				opacity: 0,
				scale: 0.92,
				duration: 0.8,
				stagger: 0.1,
				ease: 'back.out(1.8)',
				scrollTrigger: { trigger: join, start: 'top 45%' }
			});
			$$('[data-a="sil"]').forEach((el) => {
				const s = parseFloat(el.dataset.speed ?? '') || 1;
				gsap.fromTo(
					el,
					{ yPercent: 45 * s },
					{
						yPercent: 0,
						ease: 'none',
						scrollTrigger: { trigger: join, start: 'top bottom', end: 'bottom bottom', scrub: true }
					}
				);
			});
			$$('[data-a="runner"]').forEach((r, i) =>
				gsap.to(r, {
					y: -10,
					rotation: i % 2 ? 1.5 : -1.5,
					transformOrigin: '50% 100%',
					duration: 0.42 + i * 0.05,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut'
				})
			);
			const fly = A('fly');
			if (fly)
				gsap.to(fly, {
					y: -16,
					rotation: 4,
					duration: 2.6,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut'
				});
			$$('#join [data-cloud]').forEach((c, i) =>
				gsap.to(c, {
					x: (i % 2 ? -1 : 1) * 30,
					duration: 16 + i * 3,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut'
				})
			);

			const dw = A('dawaey');
			if (dw) {
				gsap.from(dw, {
					yPercent: 35,
					opacity: 0,
					duration: 1.1,
					ease: 'back.out(1.4)',
					scrollTrigger: { trigger: dw.parentElement, start: 'top 90%' }
				});
				gsap.to(dw, {
					rotation: 1.6,
					duration: 2.4,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut',
					delay: 1.2
				});
			}

			if (wide && fine) {
				$$('[data-magnetic]').forEach((el) => {
					const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
					const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
					on(el, 'pointermove', (e) => {
						const r = el.getBoundingClientRect();
						xTo((e.clientX - r.left - r.width / 2) * 0.2);
						yTo((e.clientY - r.top - r.height / 2) * 0.3);
					});
					on(el, 'pointerleave', () => {
						xTo(0);
						yTo(0);
					});
				});
				const logo = A('logo');
				on(logo, 'pointerenter', () =>
					gsap.fromTo(
						logo,
						{ rotation: 0 },
						{
							keyframes: [
								{ rotation: -6, duration: 0.12 },
								{ rotation: 5, duration: 0.14 },
								{ rotation: 0, duration: 0.3, ease: 'elastic.out(1,0.4)' }
							]
						}
					)
				);
			}
		}
	}, root);

	// Paper plane: eases between per-section waypoints as you scroll, leaving a dashed trail.
	const plane = A<SVGSVGElement>('plane');
	const trail = A<SVGPathElement>('trail');
	if (plane && trail && opts.planeOn) {
		const sec = (id: string) => root.querySelector<HTMLElement>('#' + id);
		const top = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
		type Pose = [scrollY: number, x: number, y: number];
		let P: Pose[] = [];
		let heroEnd = 0;
		let joinTop = 0;
		const aboutPoses = (H: number, ab: HTMLElement): Pose[] => {
			const prT = A('pr-track');
			const stg = A('pr-stage');
			if (!prT || !stg)
				return [
					[top(ab), 0.08, 0.5],
					[top(ab) + ab.offsetHeight * 0.55, 0.93, 0.16]
				];
			const sr = stg.getBoundingClientRect();
			const span = prT.offsetHeight - H;
			const t0 = top(prT);
			const W = window.innerWidth;
			const pc = $$('[data-a="pc"]').map((c) => {
				const r = c.getBoundingClientRect();
				return [(r.left - sr.left + 36) / W, (r.top - sr.top - 20) / H];
			});
			return [
				[t0, pc[0][0], pc[0][1]],
				[t0 + span * 0.25, pc[1][0], pc[1][1]],
				[t0 + span * 0.5, pc[2][0], pc[2][1]],
				[t0 + span * 0.75, pc[3][0], pc[3][1]],
				[t0 + span, pc[0][0], pc[0][1]]
			];
		};
		const poses = () => {
			const H = window.innerHeight;
			const ab = sec('about');
			const ev = sec('events');
			const rm = sec('programs');
			const tm = sec('team');
			const fq = sec('faq');
			const jn = sec('join');
			if (!ab || !ev || !rm || !tm || !fq || !jn) return;
			heroEnd = top(ab);
			joinTop = top(jn);
			// Waypoints follow page order (about → events → programs → team → faq → join);
			// sorted defensively so a reorder can never send the plane backwards.
			P = (
				[
					[0, 0.86, 0.3],
					...aboutPoses(H, ab),
					[top(ev), 0.9, 0.2],
					[top(rm), 0.88, 0.14],
					[top(rm) + rm.offsetHeight - H, 0.08, 0.86],
					[top(tm), 0.1, 0.22],
					[top(tm) + tm.offsetHeight * 0.5, 0.9, 0.85],
					[top(fq), 0.92, 0.18],
					[joinTop - H * 0.35, 0.22, 0.3],
					[joinTop, 0.8, 0.42]
				] as Pose[]
			).sort((a, b) => a[0] - b[0]);
		};
		poses();
		const onRefresh = () => poses();
		ST.addEventListener('refresh', onRefresh);
		offs.push(() => ST.removeEventListener('refresh', onRefresh));
		const small = bp === 's';
		const maxPts = small ? 36 : 72;
		const lightTrail = 'var(--color-background)';
		const darkTrail = 'color-mix(in srgb, var(--color-foreground) 28%, transparent)';
		let px = window.innerWidth * 1.15;
		let py = window.innerHeight * 0.12;
		let ang = Math.PI * 0.95;
		let stroke = '';
		const pts: Array<[number, number]> = [];
		const loop = () => {
			const W = window.innerWidth;
			const H = window.innerHeight;
			const y = window.scrollY;
			let a: Pose | undefined = P[0];
			let b: Pose | undefined = P[0];
			if (P.length) {
				if (y >= P[P.length - 1][0]) a = b = P[P.length - 1];
				else
					for (let i = 0; i < P.length - 1; i++) {
						if (y >= P[i][0] && y < P[i + 1][0]) {
							a = P[i];
							b = P[i + 1];
							break;
						}
					}
			}
			if (a && b) {
				const t = a === b ? 0 : (y - a[0]) / (b[0] - a[0]);
				const e = t * t * (3 - 2 * t);
				const now = performance.now() / 1000;
				let tx = (a[1] + (b[1] - a[1]) * e) * W + Math.cos(now * 0.9) * 10;
				let ty = (a[2] + (b[2] - a[2]) * e) * H + Math.sin(now * 1.3) * 12;
				if (ptr && y < H * 0.6) {
					tx += (ptr.x - tx) * 0.22;
					ty += (ptr.y - ty) * 0.22;
				}
				const nx = px + (tx - px) * 0.05;
				const ny = py + (ty - py) * 0.05;
				const dx = nx - px;
				const dy = ny - py;
				if (Math.abs(dx) + Math.abs(dy) > 0.25) {
					let d = Math.atan2(dy, dx) - ang;
					d = Math.atan2(Math.sin(d), Math.cos(d));
					ang += d * 0.1;
				}
				px = nx;
				py = ny;
				plane.style.transform =
					`translate3d(${(px - 24).toFixed(1)}px,${(py - 24).toFixed(1)}px,0) rotate(${ang.toFixed(3)}rad)` +
					(small ? ' scale(0.72)' : '');
				pts.unshift([px, py]);
				if (pts.length > maxPts) pts.pop();
				let dStr = '';
				for (let i = 0; i < pts.length; i += 3)
					dStr += (i ? 'L' : 'M') + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1);
				trail.setAttribute('d', dStr);
				const docY = y + py;
				const want = docY < heroEnd || docY > joinTop + H * 0.25 ? lightTrail : darkTrail;
				if (want !== stroke) {
					stroke = want;
					trail.style.stroke = want;
				}
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
	}

	document.fonts?.ready.then(() => {
		if (!disposed) ST.refresh();
	});
	on(window, 'load', () => ST.refresh());
	const refreshRaf = requestAnimationFrame(() => ST.refresh());

	return () => {
		disposed = true;
		cancelAnimationFrame(raf);
		cancelAnimationFrame(refreshRaf);
		opts.onFaqSpin?.(null);
		offs.forEach((f) => f());
		ctx.revert();
	};
}
