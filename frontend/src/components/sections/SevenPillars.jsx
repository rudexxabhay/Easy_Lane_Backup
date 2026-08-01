import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  BadgeIndianRupee,
  ChartNoAxesCombined,
  CircleCheckBig,
  Network,
  Radar,
  Route,
  UsersRound,
} from 'lucide-react';
import { getLenis, gsap } from '../../lib/animationRuntime.jsx';
import './SevenPillars.css';

const pillars = [
  {
    number: '01',
    label: 'Transportation',
    eyebrow: 'Transportation Management',
    title: 'Transportation Management',
    text: 'Plan bookings, loads, routes and freight execution with complete real-time trip control.',
    points: ['Plan bookings', 'Manage loads and routes', 'Control trip execution'],
    outcome: 'Real-time trip control',
    icon: Route,
  },
  {
    number: '02',
    label: 'Fleet',
    eyebrow: 'Fleet Operations',
    title: 'Fleet Management',
    text: 'Manage vehicles, drivers, maintenance, fuel usage and overall fleet performance.',
    points: ['Manage vehicles', 'Support drivers', 'Track maintenance and fuel'],
    outcome: 'Stronger fleet performance',
    icon: Network,
  },
  {
    number: '03',
    label: 'Procurement',
    eyebrow: 'Procurement Automation',
    title: 'Procurement (AMS)',
    text: 'Streamline sourcing, vendor onboarding, freight rates, contracts and approval workflows.',
    points: ['Streamline sourcing', 'Onboard vendors', 'Control rates and contracts'],
    outcome: 'Smarter procurement',
    icon: UsersRound,
  },
  {
    number: '04',
    label: 'Finance',
    eyebrow: 'Connected Finance',
    title: 'Finance & Invoicing',
    text: 'Automate invoicing, payment tracking, reconciliation and financial reporting.',
    points: ['Automate invoicing', 'Track payments', 'Simplify reconciliation'],
    outcome: 'Connected financial control',
    icon: ChartNoAxesCombined,
  },
  {
    number: '05',
    label: 'Control Tower',
    eyebrow: 'Real-Time Visibility',
    title: 'Control Tower',
    text: 'Monitor trips, alerts, exceptions, SLA performance and operational activity in real time.',
    points: ['Monitor trips', 'Manage alerts and exceptions', 'Track SLA performance'],
    outcome: 'Real-time decisions',
    icon: Radar,
  },
  {
    number: '06',
    label: 'Discounting',
    eyebrow: 'Flexible Funding',
    title: 'Bill Discounting',
    text: 'Unlock faster cash flow against approved invoices with quick and flexible funding.',
    points: ['Use approved invoices', 'Access quick funding', 'Improve cash flow'],
    outcome: 'Faster working capital',
    icon: BadgeIndianRupee,
  },
];

export default function SevenPillars() {
  const sectionRef = useRef(null);
  const wheelRef = useRef(null);
  const progressRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  const updateActive = useCallback((index) => {
    const next = Math.max(0, Math.min(index, pillars.length - 1));
    if (next === activeRef.current) return;
    activeRef.current = next;
    setActive(next);
  }, []);

  const goTo = useCallback((index) => {
    const trigger = scrollTriggerRef.current;
    if (!trigger) return;

    const progress = index / (pillars.length - 1);
    const target = trigger.start + (trigger.end - trigger.start) * progress;
    const lenis = getLenis();

    if (lenis) lenis.scrollTo(target);
    else window.scrollTo({ top: target, behavior: 'smooth' });
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const wheel = wheelRef.current;
    const progressBar = progressRef.current;
    const pin = section?.querySelector('.seven-pillars__pin');
    if (!section || !wheel || !progressBar || !pin) return undefined;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const anglePerPillar = 360 / pillars.length;
        const wheelRotation = -anglePerPillar * (pillars.length - 1);

        gsap.set(pin, { position: 'relative' });

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.max(section.offsetHeight - window.innerHeight, 1)}`,
            pin,
            pinSpacing: false,
            scrub: true,
            snap: {
              snapTo: 1 / (pillars.length - 1),
              duration: { min: 0.14, max: 0.38 },
              delay: 0.06,
              ease: 'power1.inOut',
            },
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              updateActive(Math.round(progress * (pillars.length - 1)));
            },
          },
        });

        timeline
          .to(wheel, {
            '--wheel-rotation': `${wheelRotation}deg`,
            '--counter': `${-wheelRotation}deg`,
          }, 0)
          .to(progressBar, { scaleY: 1 }, 0);

        scrollTriggerRef.current = timeline.scrollTrigger;

        return () => {
          if (scrollTriggerRef.current === timeline.scrollTrigger) scrollTriggerRef.current = null;
        };
      });
    }, section);

    return () => {
      scrollTriggerRef.current = null;
      media.revert();
      context.revert();
    };
  }, [updateActive]);

  return (
    <section ref={sectionRef} className="seven-pillars" aria-labelledby="seven-pillars-title">
      <div className="seven-pillars__desktop">
        <div className="seven-pillars__pin">
          <div className="seven-pillars__blob seven-pillars__blob--left" aria-hidden="true" />
          <div className="seven-pillars__blob seven-pillars__blob--right" aria-hidden="true" />

          <div className="seven-pillars__shell">
            <div className="seven-pillars__grid">
              <div className="seven-pillars__left">
                <div className="seven-pillars__left-content">
                  <header className="seven-pillars__intro-block">
                    <p className="seven-pillars__kicker"><span /> EASY LANE SIX PILLARS</p>
                    <h2 id="seven-pillars-title">One Connected Platform<br /><span>Six Powerful Pillars</span></h2>
                  </header>

                  <div className="seven-pillars__copy-stack" aria-live="polite">
                    {pillars.map((pillar, index) => {
                      const state = index === active ? 'is-active' : index < active ? 'is-previous' : 'is-next';
                      return (
                        <article
                          key={pillar.number}
                          className={`seven-pillars__copy ${state}`}
                          aria-hidden={active !== index}
                        >
                          <div className="seven-pillars__eyebrow-row">
                            <span>{pillar.number}</span>
                            <small>{pillar.eyebrow}</small>
                          </div>
                          <h3>{pillar.title}</h3>
                          <p>{pillar.text}</p>
                          <ul>
                            {pillar.points.map((point) => (
                              <li key={point}><CircleCheckBig />{point}</li>
                            ))}
                          </ul>
                          <div className="seven-pillars__outcome">
                            <pillar.icon />
                            <span><small>Business outcome</small><strong>{pillar.outcome}</strong></span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>

                <div className="seven-pillars__progress" aria-hidden="true">
                  <div><b>{String(active + 1).padStart(2, '0')}</b><span>/</span><span>06</span></div>
                  <i><span ref={progressRef} /></i>
                  <small>Keep scrolling</small>
                </div>
              </div>

              <div className="seven-pillars__visual">
                <div className="seven-pillars__halo" aria-hidden="true" />
                <div ref={wheelRef} className="seven-pillars__wheel">
                  <div className="seven-pillars__orbit seven-pillars__orbit--one" />
                  <div className="seven-pillars__orbit seven-pillars__orbit--two" />
                  <div className="seven-pillars__orbit seven-pillars__orbit--three" />

                  {pillars.map((pillar, index) => {
                    const Icon = pillar.icon;
                    const angle = (360 / pillars.length) * index;
                    return (
                      <div
                        key={pillar.number}
                        className={`seven-pillars__node-wrap ${active === index ? 'is-active' : ''}`}
                        style={{ '--angle': `${angle}deg` }}
                      >
                        <button type="button" onClick={() => goTo(index)} aria-label={`Open ${pillar.label} pillar`}>
                          <Icon /><span>{pillar.label}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="seven-pillars__core">
                  {pillars.map((pillar, index) => {
                    const Icon = pillar.icon;
                    const state = index === active ? 'is-active' : index < active ? 'is-previous' : 'is-next';
                    return (
                      <div
                        key={pillar.number}
                        className={`seven-pillars__core-content ${state}`}
                        aria-hidden={active !== index}
                      >
                        <i><Icon /></i>
                        <small>Pillar {pillar.number}</small>
                        <strong>{pillar.label}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="seven-pillars__mobile">
        <p className="seven-pillars__kicker"><span /> EASY LANE SIX PILLARS</p>
        <h2>One Connected Platform<br /><span>Six Powerful Pillars</span></h2>

        <div className="seven-pillars__mobile-list">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.number}>
                <div><i><Icon /></i><span>{pillar.number}</span></div>
                <small>{pillar.eyebrow}</small>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
                <b><CircleCheckBig />{pillar.outcome}</b>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
