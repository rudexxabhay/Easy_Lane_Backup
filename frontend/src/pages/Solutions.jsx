import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  CircuitBoard,
  Container,
  Eye,
  FileCheck2,
  Handshake,
  LayoutDashboard,
  LineChart,
  MapPinned,
  Package,
  Route,
  Settings2,
  ShieldCheck,
  ShieldPlus,
  Truck,
  WalletCards,
  Warehouse,
  Zap,
  Scale,
  Users2,
  ClipboardCheck,
  Building,
} from 'lucide-react';
import Button from '../components/Button.jsx';

const businessTypes = [
  {
    title: 'For Shippers',
    description: 'Gain visibility, control and efficiency across your entire supply chain.',
    bullets: ['End-to-end shipment visibility', 'Freight cost optimization', 'On-time delivery assurance'],
    accent: 'blue',
    Icon: Package,
  },
  {
    title: 'For Transporters',
    description: 'Move more, manage better and grow your transportation business.',
    bullets: ['Load discovery & management', 'Fleet & driver performance', 'Higher vehicle utilization'],
    accent: 'green',
    Icon: Truck,
  },
  {
    title: 'For 3PL / Logistics',
    description: 'Streamline operations and deliver exceptional service to clients.',
    bullets: ['Multi-client management', 'SLA monitoring & compliance', 'Automation & scalability'],
    accent: 'purple',
    Icon: Warehouse,
  },
  {
    title: 'For Enterprises',
    description: 'Unified platform to manage complex logistics operations at scale.',
    bullets: ['Role-based access control', 'Advanced analytics & reports', 'Secure & scalable platform'],
    accent: 'orange',
    Icon: Building2,
  },
];

const benefitItems = [
  { title: 'Lower Logistics Cost', text: 'Reduce cost with better planning and execution.', Icon: WalletCards },
  { title: 'Real-Time Visibility', text: 'Track shipments, vehicles and exceptions live.', Icon: Eye },
  { title: 'Operational Efficiency', text: 'Automate workflows and eliminate manual tasks.', Icon: Zap },
  { title: 'Data-Driven Decisions', text: 'Actionable insights to improve performance.', Icon: BarChart3 },
];

const useCases = [
  { title: 'Freight Procurement', description: 'Smart bidding and rate management to get the best freight rates.', Icon: Scale },
  { title: 'Fleet Visibility', description: 'Track your fleet in real time and improve asset utilization.', Icon: MapPinned },
  { title: 'Digital Invoicing', description: 'Automate invoicing and reconciliation. Get paid faster.', Icon: FileCheck2 },
  { title: 'Vendor Management', description: 'Onboard, evaluate and manage vendors seamlessly.', Icon: Users2 },
  { title: 'Freight Audit', description: 'Detect discrepancies and ensure accurate freight billing.', Icon: ClipboardCheck },
  { title: 'Last Mile Delivery', description: 'Optimize last-mile operations and improve delivery experience.', Icon: Route },
];

const accentStyles = {
  blue: 'bg-[#edf4ff] text-[#1260ff] border-[#d7e6ff]',
  green: 'bg-[#ecfbf2] text-[#179c57] border-[#d7f4e1]',
  purple: 'bg-[#f1edff] text-[#6f54ff] border-[#e2d8ff]',
  orange: 'bg-[#fff3e8] text-[#d97706] border-[#fde0c3]',
};

const benefitAccentStyles = {
  blue: 'bg-[#edf4ff] text-[#1260ff]',
  green: 'bg-[#ecfbf2] text-[#179c57]',
  purple: 'bg-[#f1edff] text-[#6f54ff]',
  orange: 'bg-[#fff3e8] text-[#d97706]',
};

const useCaseAccentStyles = {
  blue: 'bg-[#edf4ff] text-[#1260ff]',
  green: 'bg-[#ecfbf2] text-[#179c57]',
  purple: 'bg-[#f1edff] text-[#6f54ff]',
  orange: 'bg-[#fff3e8] text-[#d97706]',
  teal: 'bg-[#ecfbfb] text-[#0f9aa7]',
};

const metrics = [
  { value: '20%+', label: 'Freight cost savings', icon: WalletCards, x: '7%', y: '20%' },
  { value: '90%', label: 'On-time delivery improvement', icon: Route, x: '68%', y: '8%' },
  { value: '100%', label: 'Real-time visibility', icon: Eye, x: '79%', y: '44%' },
  { value: '99.9%', label: 'Data accuracy', icon: ShieldCheck, x: '16%', y: '60%' },
  { value: '4X', label: 'Productivity boost', icon: LineChart, x: '41%', y: '76%' },
  { value: '80%', label: 'Faster invoicing & reconciliation', icon: FileCheck2, x: '66%', y: '72%' },
];

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_70%_30%,rgba(18,96,255,.16),transparent_26%),radial-gradient(circle_at_14%_18%,rgba(34,197,94,.08),transparent_20%),radial-gradient(circle_at_84%_76%,rgba(111,84,255,.08),transparent_18%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(18, 96, 255, .12) 1px, transparent 0)',
          backgroundSize: '26px 26px',
          maskImage: 'linear-gradient(180deg, rgba(0, 0, 0, .92), transparent 90%)',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0, 0, 0, .92), transparent 90%)',
        }}
      />

      <div className="relative rounded-[22px] border border-[#dbe7fb] bg-white/85 p-3 shadow-[0_18px_44px_rgba(15,23,42,.08)] backdrop-blur-[2px] sm:p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr] sm:gap-3">
          <div className="flex min-h-[150px] flex-col rounded-[16px] border border-[#dbe7fb] bg-white p-3.5 shadow-[0_10px_24px_rgba(15,23,42,.05)]">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#edf4ff] text-[#1260ff]">
                <Eye size={15} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] font-bold text-[#071837]">Real-time Visibility</p>
                <p className="text-[9px] leading-[1.35] text-slate-500">Track every shipment in real time</p>
              </div>
            </div>
            <div className="mt-auto rounded-[12px] bg-[linear-gradient(180deg,#f9fcff_0%,#eef5ff_100%)] p-2.5">
              <div className="flex items-end gap-2">
                <div className="h-7 w-7 rounded-[8px] bg-[#edf4ff]" />
                <div className="h-9 w-9 rounded-[8px] bg-[#1260ff]" />
                <div className="h-5 w-7 rounded-[8px] bg-[#b7d2ff]" />
              </div>
              <div className="mt-2.5 h-1.5 rounded-full bg-[#dbe7fb]" />
            </div>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[16px] border border-[#dbe7fb] bg-white p-3.5 shadow-[0_10px_24px_rgba(15,23,42,.05)]">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ecfbf2] text-[#179c57]">
                    <LineChart size={14} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold text-[#071837]">Cost Efficiency</p>
                    <p className="text-[8px] leading-[1.35] text-slate-500">Optimize routes and reduce logistics cost</p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-end gap-1">
                  <span className="h-8 w-2 rounded-full bg-[#cfe0fb]" />
                  <span className="h-10 w-2 rounded-full bg-[#1260ff]" />
                  <span className="h-6 w-2 rounded-full bg-[#1f9d5a]" />
                  <span className="h-12 w-2 rounded-full bg-[#6f54ff]" />
                </div>
              </div>

              <div className="rounded-[16px] border border-[#dbe7fb] bg-white p-3.5 shadow-[0_10px_24px_rgba(15,23,42,.05)]">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f1edff] text-[#6f54ff]">
                    <CircuitBoard size={14} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold text-[#071837]">Performance Insights</p>
                    <p className="text-[8px] leading-[1.35] text-slate-500">Data-driven insights for smarter decisions</p>
                  </div>
                </div>
                <div className="mt-2.5 grid grid-cols-3 gap-2">
                  <div className="h-10 rounded-[10px] bg-[#edf4ff]" />
                  <div className="h-12 rounded-[10px] bg-[#1260ff]" />
                  <div className="h-8 rounded-[10px] bg-[#ecfbf2]" />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1.05fr_.95fr]">
              <div className="rounded-[16px] border border-[#dbe7fb] bg-white p-3.5 shadow-[0_10px_24px_rgba(15,23,42,.05)]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#edf4ff] text-[#1260ff]">
                      <Truck size={14} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-[#071837]">Truck Network</p>
                      <p className="text-[8px] leading-[1.35] text-slate-500">Route connections and live updates</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#edf4ff] px-2 py-1 text-[8px] font-bold text-[#1260ff]">
                    Live
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="h-8 w-12 rounded-[10px] bg-[#f5f8fd] shadow-inner" />
                  <div className="h-6 w-9 rounded-[10px] bg-[#edf4ff]" />
                  <div className="h-9 w-12 rounded-[10px] bg-[#1260ff]" />
                </div>
              </div>

              <div className="rounded-[16px] border border-[#dbe7fb] bg-white p-3.5 shadow-[0_10px_24px_rgba(15,23,42,.05)]">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#fff3e8] text-[#d97706]">
                    <MapPinned size={14} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold text-[#071837]">Port & Delivery</p>
                    <p className="text-[8px] leading-[1.35] text-slate-500">Container flow and dock activity</p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-end gap-2">
                  <div className="h-5 w-8 rounded-[8px] bg-[#dfeaff]" />
                  <div className="h-8 w-8 rounded-[8px] bg-[#1260ff]" />
                  <div className="h-6 w-8 rounded-[8px] bg-[#1f9d5a]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <svg aria-hidden="true" viewBox="0 0 600 420" className="pointer-events-none absolute inset-0 h-full w-full">
          <path d="M115 116 C190 88, 242 86, 286 98 S384 128, 454 100" fill="none" stroke="#c5dbff" strokeDasharray="4 8" strokeWidth="1.3" />
          <path d="M150 292 C220 244, 300 242, 360 252 S482 282, 528 214" fill="none" stroke="#c5dbff" strokeDasharray="4 8" strokeWidth="1.3" />
          <circle cx="115" cy="116" r="4" fill="#1260ff" />
          <circle cx="286" cy="98" r="4" fill="#1f9d5a" />
          <circle cx="454" cy="100" r="4" fill="#6f54ff" />
          <circle cx="150" cy="292" r="4" fill="#1260ff" />
          <circle cx="360" cy="252" r="4" fill="#1f9d5a" />
          <circle cx="528" cy="214" r="4" fill="#1260ff" />
        </svg>

        <svg aria-hidden="true" viewBox="0 0 600 420" className="pointer-events-none absolute inset-0 h-full w-full">
          <path
            d="M120 160 C150 146, 182 140, 220 136 S304 130, 338 146"
            fill="none"
            stroke="#1260ff"
            strokeWidth="2"
            strokeDasharray="8 8"
            className="solution-route-pulse"
          />
        </svg>
      </div>
    </div>
  );
}

function BusinessCard({ item }) {
  const Icon = item.Icon;

  return (
    <article className="group flex h-full min-h-[310px] flex-col rounded-[16px] border border-[#dbe7fb] bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,.04)] transition duration-[250ms] hover:-translate-y-1 hover:border-[#1260ff] hover:shadow-[0_14px_34px_rgba(18,96,255,.09)] sm:p-6">
      <span className={`grid h-12 w-12 place-items-center rounded-full border ${accentStyles[item.accent]} shadow-[0_8px_18px_rgba(15,23,42,.04)]`}>
        <Icon size={20} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-[19px] font-bold leading-[1.18] text-[#071837]">{item.title}</h3>
      <p className="mt-3 text-[13px] leading-[1.7] text-slate-500">{item.description}</p>
      <ul className="mt-4 space-y-3">
        {item.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2 text-[12px] leading-[1.45] text-slate-600">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#1260ff]" aria-hidden="true" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <a href="#use-cases" className="mt-auto inline-flex items-center gap-1 pt-6 text-[12px] font-bold text-[#1260ff]">
        Learn more <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
      </a>
    </article>
  );
}

function BenefitItem({ item }) {
  const Icon = item.Icon;

  return (
    <div className="flex items-start gap-3 rounded-[14px] border border-[#e8eef8] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,.03)]">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${benefitAccentStyles[item.title === 'Lower Logistics Cost' ? 'blue' : item.title === 'Real-Time Visibility' ? 'green' : item.title === 'Operational Efficiency' ? 'purple' : 'orange']}`}>
        <Icon size={18} aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-[14px] font-bold text-[#071837]">{item.title}</h3>
        <p className="mt-1 text-[12px] leading-[1.55] text-slate-500">{item.text}</p>
      </div>
    </div>
  );
}

function MetricsPanel() {
  return (
    <div className="relative overflow-hidden rounded-[18px] border border-[#dbe7fb] bg-[radial-gradient(circle_at_20%_20%,rgba(18,96,255,.08),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)] p-3 shadow-[0_16px_40px_rgba(15,23,42,.06)] sm:p-3.5">
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-[1fr_1fr]">
        {metrics.slice(0, 2).map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-[14px] border border-white bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,.08)]">
              <div className="flex items-center gap-2">
                <span className="grid h-6.5 w-6.5 place-items-center rounded-full bg-[#edf4ff] text-[#1260ff]">
                  <Icon size={13} aria-hidden="true" />
                </span>
                <div>
                  <div className="text-[14px] font-[800] leading-none text-[#071837]">{metric.value}</div>
                  <div className="mt-0.5 text-[8px] leading-[1.3] text-slate-500">{metric.label}</div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="row-span-2 flex min-h-[120px] items-center justify-center rounded-[16px] border border-[#d6e4fb] bg-white shadow-[0_18px_38px_rgba(18,96,255,.12)]">
          <div className="relative grid h-[84px] w-[84px] place-items-center rounded-full bg-[linear-gradient(180deg,#0a2c73_0%,#1260ff_100%)] text-white shadow-[0_16px_26px_rgba(18,96,255,.24)]">
            <span className="text-[30px] font-[800] leading-none tracking-[-0.08em]">E</span>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold text-slate-500">
              Easy Lane
            </span>
          </div>
        </div>

        {metrics.slice(2, 4).map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-[14px] border border-white bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,.08)]">
              <div className="flex items-center gap-2">
                <span className="grid h-6.5 w-6.5 place-items-center rounded-full bg-[#edf4ff] text-[#1260ff]">
                  <Icon size={13} aria-hidden="true" />
                </span>
                <div>
                  <div className="text-[14px] font-[800] leading-none text-[#071837]">{metric.value}</div>
                  <div className="mt-0.5 text-[8px] leading-[1.3] text-slate-500">{metric.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-2">
        {metrics.slice(4).map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-[14px] border border-white bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,.08)]">
              <div className="flex items-center gap-2">
                <span className="grid h-6.5 w-6.5 place-items-center rounded-full bg-[#edf4ff] text-[#1260ff]">
                  <Icon size={13} aria-hidden="true" />
                </span>
                <div>
                  <div className="text-[14px] font-[800] leading-none text-[#071837]">{metric.value}</div>
                  <div className="mt-0.5 text-[8px] leading-[1.3] text-slate-500">{metric.label}</div>
                </div>
              </div>
            </div>
          );
        })}
        <div className="rounded-[14px] border border-[#dbe7fb] bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,.08)] md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">Why choose Easy Lane</p>
              <p className="mt-0.5 text-[10px] leading-[1.35] text-slate-600">Compact logistics metrics and a central platform hub.</p>
            </div>
            <div className="h-7 w-7 rounded-full bg-[#edf4ff] text-[#1260ff]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function UseCaseCard({ item }) {
  const Icon = item.Icon;

  return (
    <article className="group flex h-full min-h-[206px] flex-col rounded-[14px] border border-[#dbe7fb] bg-white p-3.5 text-center shadow-[0_8px_20px_rgba(15,23,42,.04)] transition duration-[240ms] hover:-translate-y-1 hover:border-[#1260ff] hover:shadow-[0_14px_30px_rgba(18,96,255,.08)] sm:p-4">
      <span className={`mx-auto grid h-10 w-10 place-items-center rounded-full border border-transparent ${useCaseAccentStyles[item.title === 'Freight Procurement' ? 'blue' : item.title === 'Fleet Visibility' ? 'green' : item.title === 'Digital Invoicing' ? 'purple' : item.title === 'Vendor Management' ? 'orange' : item.title === 'Freight Audit' ? 'teal' : 'blue']}`}>
        <Icon size={17} aria-hidden="true" />
      </span>
      <h3 className="mt-3 text-[16px] font-bold leading-[1.22] text-[#071837]">{item.title}</h3>
      <p className="mt-2.5 text-[11px] leading-[1.55] text-slate-500">{item.description}</p>
      <a href="#top" className="mt-auto inline-flex items-center justify-center gap-1 pt-4 text-[11px] font-bold text-[#1260ff]">
        Learn more <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
      </a>
    </article>
  );
}

export default function Solutions() {
  const [motionAllowed, setMotionAllowed] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotionAllowed(!media.matches);
    sync();
    media.addEventListener?.('change', sync);
    return () => media.removeEventListener?.('change', sync);
  }, []);

  return (
    <main id="top" className="bg-white pt-[64px] text-[#071837] sm:pt-[72px]">
      <style>{`
        @keyframes solution-route-pulse {
          0%, 100% { stroke-dashoffset: 0; opacity: .55; }
          50% { stroke-dashoffset: -18; opacity: .95; }
        }
        .solution-route-pulse {
          animation: ${motionAllowed ? 'solution-route-pulse 7s ease-in-out infinite' : 'none'};
        }
      `}</style>

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 75% 22%, rgba(18, 96, 255, .1), transparent 30%), radial-gradient(circle at 16% 18%, rgba(18, 96, 255, .04), transparent 22%)',
          }}
        />
        <div className="mx-auto w-[min(calc(100%-2rem),1280px)] sm:w-[min(calc(100%-3rem),1280px)] lg:w-[min(calc(100%-6rem),1280px)]">
        <div className="grid min-h-[400px] items-center gap-6 py-1.5 lg:grid-cols-[.92fr_1.08fr] lg:gap-5">
            <div className="relative z-10 max-w-[440px]">
              <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">Solutions</p>
              <h1 className="max-w-[430px] text-[40px] font-[800] leading-[1.04] tracking-[-0.06em] text-[#071837] sm:text-[46px] lg:text-[50px]">
                <span className="block">Smarter Logistics</span>
                <span className="block">Solutions for Every</span>
                <span className="block">
                  Business<span className="text-[#1260ff]">.</span>
                </span>
              </h1>
              <p className="mt-4 max-w-[420px] text-[14px] leading-[1.6] text-slate-600">
                From shippers to 3PLs, Easy Lane delivers industry-specific solutions to simplify logistics, improve visibility and maximize business performance.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-3.5">
                <a
                  href="#business-types"
                  className="inline-flex h-[44px] items-center justify-center rounded-[9px] border border-[#1260ff] bg-white px-4 text-[12px] font-bold text-[#1260ff] transition-colors hover:bg-[#f4f8ff]"
                >
                  Explore Solutions <span className="ml-1" aria-hidden="true">→</span>
                </a>
                <Button href="/book-demo" variant="primary" className="h-[44px] px-4 text-[12px]">
                  Book a Demo
                </Button>
              </div>
            </div>

            <div className="relative z-10 justify-self-center lg:mr-10 lg:justify-self-end xl:mr-12">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      <section id="business-types" className="pt-16 sm:pt-20">
        <div className="mx-auto w-[min(calc(100%-2rem),1280px)] sm:w-[min(calc(100%-3rem),1280px)] lg:w-[min(calc(100%-6rem),1280px)]">
          <div className="mx-auto max-w-[820px] text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">Solutions by business type</p>
            <h2 className="mt-4 text-[29px] font-[800] leading-[1.12] tracking-[-0.045em] text-[#071837] sm:text-[33px]">
              Tailored for Your Business. Built for Results.
            </h2>
          </div>
          <div className="mt-7 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
            {businessTypes.map((item) => (
              <BusinessCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="mb-7 pt-16 sm:mb-9 sm:pt-20 lg:mb-12">
        <div className="mx-auto w-[min(calc(100%-2rem),1280px)] sm:w-[min(calc(100%-3rem),1280px)] lg:w-[min(calc(100%-6rem),1280px)]">
          <div className="grid gap-8 lg:grid-cols-[.95fr_1.05fr] lg:gap-10">
            <div className="max-w-[520px]">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">Why choose Easy Lane</p>
              <h2 className="mt-4 text-[32px] font-[800] leading-[1.05] tracking-[-0.055em] text-[#071837] sm:text-[38px]">
                Solutions that drive
                <span className="block">real business impact.</span>
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {benefitItems.map((item) => {
                  const Icon = item.Icon;
                  const accent = item.title === 'Lower Logistics Cost' ? 'blue' : item.title === 'Real-Time Visibility' ? 'green' : item.title === 'Operational Efficiency' ? 'purple' : 'orange';
                  return (
                    <div key={item.title} className="flex items-start gap-3 rounded-[14px] border border-[#e8eef8] bg-white p-3.5 shadow-[0_8px_20px_rgba(15,23,42,.03)]">
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${benefitAccentStyles[accent]}`}>
                        <Icon size={17} aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="text-[13px] font-bold text-[#071837]">{item.title}</h3>
                        <p className="mt-1 text-[11px] leading-[1.5] text-slate-500">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <MetricsPanel />
          </div>
        </div>
      </section>

      <section id="use-cases" className="pt-16 sm:pt-20">
        <div className="mx-auto w-[min(calc(100%-2rem),1280px)] sm:w-[min(calc(100%-3rem),1280px)] lg:w-[min(calc(100%-6rem),1280px)]">
          <div className="mx-auto max-w-[820px] text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">Solutions by use case</p>
            <h2 className="mt-4 text-[29px] font-[800] leading-[1.12] tracking-[-0.045em] text-[#071837] sm:text-[33px]">
              Solve specific challenges with
              <span className="block">targeted solutions</span>
            </h2>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {useCases.map((item) => (
              <UseCaseCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="pt-16 sm:pt-20">
        <div className="mx-auto w-[min(calc(100%-2rem),1280px)] sm:w-[min(calc(100%-3rem),1280px)] lg:w-[min(calc(100%-6rem),1280px)]">
          <div className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#041533_0%,#0b3eaa_100%)] px-4 py-4 text-white shadow-[0_18px_38px_rgba(15,23,42,.16)] sm:px-6 sm:py-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,.18) 1px, transparent 0)',
                backgroundSize: '22px 22px',
              }}
            />
            <svg aria-hidden="true" viewBox="0 0 1200 180" className="pointer-events-none absolute inset-0 h-full w-full opacity-22">
              <path d="M70 120 C180 86, 278 92, 382 130 S608 160, 742 100 S956 50, 1128 92" fill="none" stroke="#9cc2ff" strokeDasharray="6 10" strokeWidth="2" />
              <circle cx="70" cy="120" r="5" fill="#ffe800" />
              <circle cx="382" cy="130" r="5" fill="#fff" />
              <circle cx="742" cy="100" r="5" fill="#ffe800" />
              <circle cx="1128" cy="92" r="5" fill="#fff" />
            </svg>
            <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-[680px]">
                <h2 className="text-[18px] font-[800] leading-[1.16] text-white sm:text-[22px]">
                  Not sure which solution is right for you?
                </h2>
                <p className="mt-1.5 max-w-[520px] text-[11px] leading-[1.55] text-white/75">
                  Talk to our experts and find the perfect fit for your business.
                </p>
              </div>
              <Button href="/book-demo" variant="light" className="h-[40px] px-4 text-[11px]">
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
