import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function usePageReveal(scopeRef) {
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!scopeRef.current || prefersReducedMotion) {
      return undefined;
    }

    let media;
    const context = gsap.context(() => {
      const introItems = gsap.utils.toArray('[data-animate="intro"]');
      const revealItems = gsap.utils.toArray('[data-animate="reveal"]');

      gsap.fromTo(
        introItems,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.07, ease: 'power2.out', clearProps: 'all' },
      );

      media = gsap.matchMedia();
      media.add('(min-width: 768px)', () => {
        gsap.fromTo(
          revealItems,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, delay: 0.12, ease: 'power2.out', clearProps: 'all' },
        );
      });

      media.add('(max-width: 767px)', () => {
        revealItems.forEach((item) => {
          gsap.fromTo(
            item,
            { autoAlpha: 0, y: 14 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.42,
              ease: 'power2.out',
              clearProps: 'all',
              scrollTrigger: { trigger: item, start: 'top 92%', once: true },
            },
          );
        });
      });

    }, scopeRef);

    return () => {
      media?.revert();
      context.revert();
    };
  }, [prefersReducedMotion, scopeRef]);
}
