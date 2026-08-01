import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from './router.js';

gsap.registerPlugin(ScrollTrigger);

let globalLenis = null;

export const getLenis = () => globalLenis;

export function AnimationProvider({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || isAdminRoute) return undefined;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      autoRaf: false,
      anchors: true,
      allowNestedScroll: true,
    });

    globalLenis = lenis;

    const updateScrollTrigger = () => ScrollTrigger.update();
    const tick = (time) => lenis.raf(time * 1000);
    const refresh = () => ScrollTrigger.refresh();

    lenis.on('scroll', updateScrollTrigger);
    gsap.ticker.add(tick);

    if (document.readyState === 'complete') refresh();
    else window.addEventListener('load', refresh, { once: true });

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) refresh();
    });

    return () => {
      cancelled = true;
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(tick);
      lenis.off('scroll', updateScrollTrigger);
      lenis.destroy();
      if (globalLenis === lenis) globalLenis = null;
    };
  }, [isAdminRoute]);

  return children;
}

export { gsap };
