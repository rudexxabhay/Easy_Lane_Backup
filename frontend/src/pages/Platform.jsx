import {
  BadgeDollarSign,
  Clock3,
  Cog,
  Eye,
  FileCheck,
  Target,
} from 'lucide-react';
import platRight from '../assets/whatiseasylane.webp';

const modules = [
  {
    title: 'Transportation Management',
    features: ['Order booking', 'Load planning', 'Freight execution', 'Proof of POD', 'Exception handling'],
    icon: 'truck',
    tone: 'bg-[#eef4ff] text-[#1260ff]',
  },
  {
    title: 'Fleet Management',
    features: ['Fleet overview', 'Vehicle tracking', 'Driver management', 'Maintenance', 'Fuel & expenses'],
    icon: 'fleet',
    tone: 'bg-[#eff8ea] text-[#57b33e]',
  },
  {
    title: 'Procurement (AMS)',
    features: ['PO / RFQ / PV / e-Proc', 'Rate management', 'Vendor onboarding', 'Contract management', 'Performance score'],
    icon: 'procurement',
    tone: 'bg-[#f0eaff] text-[#7a49d9]',
  },
  {
    title: 'Finance & Invoicing',
    features: ['Auto invoicing', 'Payment tracking', 'Reconciliation', 'TDS / E-Invoicing', 'MIS & reports'],
    icon: 'document',
    tone: 'bg-[#f0edff] text-[#6f52f7]',
  },
  {
    title: 'Control Tower',
    features: ['Real-time tracking', 'Exception center', 'Alerts & notifications', 'SLA monitoring', 'Exception handling'],
    icon: 'tower',
    tone: 'bg-[#fff2e3] text-[#f28a20]',
  },
  {
    title: 'Bill Discounting',
    features: ['Approved invoice financing', 'Faster cash flow', 'Flexible disbursement', 'Payment tracking'],
    icon: 'finance',
    tone: 'bg-[#e7f7f6] text-[#1aa39c]',
  },
];

function Icon({ name, className = '' }) {
  switch (name) {
    case 'truck':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M3.5 7.5h10v7h-10z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M13.5 10.5h4l2.5 2.5v2h-6.5z" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="7" cy="17" r="1.7" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17" cy="17" r="1.7" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case 'fleet':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <rect x="4" y="7" width="11" height="8" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
          <path d="M15 10h2.7l1.8 2v3H15z" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="7.2" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="16.8" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case 'procurement':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M5 6h2l1.1 7.2a1.6 1.6 0 0 0 1.6 1.3h6.8a1.6 1.6 0 0 0 1.6-1.2l1.4-5.3H8.1" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="10.1" cy="18" r="1.4" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="16.2" cy="18" r="1.4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case 'document':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M7 3.8h7l3 3V20.2H7z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M14 3.8v3h3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 10h6M9 13h6M9 16h4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case 'tower':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M5 19V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M9 15V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M13 19V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M17 19v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'finance':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <path d="M5 19V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 15.5l3-3 2.5 2 4.2-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="15.5" r="1.1" fill="currentColor" />
          <circle cx="11" cy="12.5" r="1.1" fill="currentColor" />
          <circle cx="13.5" cy="14.5" r="1.1" fill="currentColor" />
          <circle cx="17.7" cy="9.5" r="1.1" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

function ModuleCard({ module }) {
  return (
    <article className="flex h-full flex-col rounded-[12px] border border-[#dbe6fb] bg-white p-[16px] shadow-[0_10px_24px_rgba(15,23,42,.045)] transition-all duration-200 hover:-translate-y-1 hover:border-[#c3d8ff] hover:shadow-[0_16px_34px_rgba(15,23,42,.08)]">
      <div className="flex items-start gap-2.5">
        <div className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full ${module.tone}`}>
          <Icon name={module.icon} className="h-[18px] w-[18px]" />
        </div>
        <h3 className="min-h-[36px] text-[14px] font-bold leading-[1.14] tracking-[-.03em] text-[#081837]">
          {module.title}
        </h3>
      </div>
      <ul className="mt-3.5 space-y-1.5 text-[12px] leading-[1.45] text-[#5b677f]">
        {module.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1260ff]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href="#"
        className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold text-[#1260ff] transition-all duration-200 hover:text-[#0f56e8]"
      >
        <span>Learn more</span>
        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </a>
    </article>
  );
}

function SectionDivider() {
  return <div className="mx-auto my-0 h-px w-full max-w-[1280px] bg-[linear-gradient(90deg,transparent,rgba(18,96,255,.16),transparent)]" />;
}

function WorkflowIcon({ type, className = '' }) {
  const base = `h-[24px] w-[24px] stroke-[2.1] ${className}`;

  switch (type) {
    case 'plan':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={base}>
          <rect x="4" y="5" width="16" height="15" rx="3" stroke="currentColor" />
          <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
    case 'execute':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={base}>
          <path d="M3 16h2l3-8h8l2 5h3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="17" r="2" stroke="currentColor" />
          <circle cx="17" cy="17" r="2" stroke="currentColor" />
        </svg>
      );
    case 'deliver':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={base}>
          <path d="M5 4h10l4 4v10H5z" stroke="currentColor" strokeLinejoin="round" />
          <path d="m9 12 2 2 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'invoice':
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={base}>
          <path d="M7 3h7l4 4v14H7z" stroke="currentColor" strokeLinejoin="round" />
          <path d="M14 3v5h5" stroke="currentColor" strokeLinejoin="round" />
          <path d="M9 12h6M9 16h4" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={base}>
          <path d="M7 5h10l2 3v9H5V8z" stroke="currentColor" strokeLinejoin="round" />
          <path d="M8 14h8M8 17h5" stroke="currentColor" strokeLinecap="round" />
          <path d="M12 8v4" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function Platform() {
  return (
    <main className="w-full overflow-x-hidden bg-white text-[#071837]">
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_46%,rgba(18,96,255,.08),transparent_20%)]" />
        <div className="relative mx-auto min-h-[520px] w-[calc(100%-24px)] max-w-[1280px] px-[18px] py-8 sm:w-[calc(100%-32px)] sm:px-6 max-md:pt-[80px] max-md:pb-8 lg:flex lg:items-center lg:min-h-[580px] lg:px-8 lg:py-9">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[44%_56%] lg:gap-7 xl:gap-9">
            <header className="relative z-10 max-w-[620px] max-md:max-w-full lg:mx-0">
              <p className="inline-flex items-center rounded-full border border-[#cfe0ff] bg-[#eef6ff] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1260ff] shadow-[0_8px_20px_rgba(18,96,255,.06)] sm:text-[11px]">
                PLATFORM
              </p>
              <h1 className="mt-4 max-w-[540px] text-[clamp(30px,8vw,52px)] font-extrabold leading-[1.03] tracking-[-0.055em] text-[#081837] sm:text-[clamp(32px,4vw,52px)] sm:leading-[1.02]">
                <span className="block">One Platform.</span>
                <span className="block">
                  Complete <span className="text-[#1260ff]">Logistics Control.</span>
                </span>
              </h1>
              <p className="mt-4 max-w-[480px] text-[14px] leading-[1.68] text-[#5b677f] sm:text-[clamp(13px,1.05vw,15px)]">
                Easy Lane unifies transportation, fleet, procurement and finance in one AI-powered platform to help you run a smarter, faster and more profitable logistics operation.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2.5">
                <a
                  href="#platform-ecosystem"
                  className="inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-[10px] border border-[#cfe0ff] bg-white px-[18px] text-[12px] font-bold text-[#1260ff] transition-colors hover:bg-[#f8fbff] sm:h-[46px] sm:w-auto"
                >
                  <span>Explore Modules</span>
                  <span aria-hidden="true">→</span>
                </a>
                <a
                  href="/book-demo"
                  className="inline-flex h-[42px] w-full items-center justify-center rounded-[10px] border border-[#f4c84b] bg-[#f7d64f] px-[18px] text-[12px] font-bold text-[#081B4B] shadow-[0_10px_20px_rgba(247,214,79,.22)] transition-colors hover:bg-[#f5cf2f] hover:border-[#f5cf2f] sm:h-[46px] sm:w-auto"
                >
                  Book a Demo
                </a>
              </div>
            </header>

            <div className="relative flex justify-center lg:justify-end">
              <div className="w-full max-w-[480px] sm:max-w-[560px] lg:max-w-[620px]" id="platform-ecosystem">
                <img
                  src={platRight}
                  alt="Platform ecosystem"
                  loading="lazy"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="bg-white px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="mx-auto max-w-[640px] text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">
              OUR PLATFORM MODULES
            </p>
            <h2 className="mt-2 text-[22px] font-extrabold leading-[1.1] tracking-[-.05em] text-[#081837] sm:text-[26px] lg:text-[clamp(22px,3.5vw,30px)]">
              Everything you need Connected
            </h2>
            <p className="mx-auto mt-2 max-w-[520px] text-[14px] leading-[1.6] text-[#5b677f]">
              Six powerful modules working together to streamline your logistics end-to-end
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {modules.map((module) => (
              <ModuleCard key={module.title} module={module} />
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="bg-white px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8 lg:pb-16 lg:pt-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid items-start gap-8 lg:grid-cols-[.44fr_.56fr] lg:items-center lg:gap-10">
            <div className="w-full lg:max-w-[440px]">
              <p className="inline-flex rounded-full border border-[#b9dcff] bg-[#eaf6ff] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#2563EB]">
                WHY EASY LANE
              </p>
              <h2 className="mt-2 text-[22px] font-extrabold leading-[1.1] tracking-[-.05em] text-[#081B4B] sm:text-[26px] lg:text-[clamp(22px,2.8vw,34px)]">
                <span className="block">Built for modern logistics</span>
                <span className="block">teams.</span>
              </h2>
              <p className="mt-3 text-[14px] leading-[1.65] text-[#64748B] sm:max-w-[400px]">
                Easy Lane helps logistics teams of all sizes run smarter, faster and more efficiently with a unified experience that delivers.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
              {[
                { icon: BadgeDollarSign, metric: '20%+', label: 'Freight cost savings' },
                { icon: Clock3, metric: '90%', label: 'On-time shipment performance' },
                { icon: FileCheck, metric: '80%', label: 'Faster invoicing & settlements' },
                { icon: Eye, metric: '100%', label: 'Real-time visibility' },
                { icon: Target, metric: '99.9%', label: 'Data accuracy' },
                { icon: Cog, metric: '4X', label: 'Productivity boost' },
              ].map(({ icon: IconComp, metric, label }) => (
                <article
                  key={label}
                  className="flex flex-col rounded-[16px] border border-[#E5E7EB] bg-white p-3.5 shadow-[0_10px_35px_rgba(15,23,42,.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#cfe0ff] hover:shadow-[0_14px_40px_rgba(15,23,42,.09)] sm:p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2563EB] sm:h-[42px] sm:w-[42px]">
                      <IconComp size={17} strokeWidth={2.1} />
                    </span>
                    <div className="min-w-0 text-right">
                      <p className="text-[20px] font-extrabold leading-none tracking-[-.06em] text-[#081837] sm:text-[24px]">
                        {metric}
                      </p>
                      <p className="mt-1 text-[10px] font-medium leading-[1.3] text-slate-500 sm:text-[11px]">
                        {label}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="bg-white px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8 lg:pt-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="mx-auto max-w-[640px] text-center">
            <p className="mx-auto inline-flex rounded-full border border-[#b9dcff] bg-[#eaf6ff] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#2563EB]">
              HOW IT WORKS
            </p>
            <h2 className="mx-auto mt-2 text-[22px] font-extrabold leading-[1.1] tracking-[-.05em] text-[#081B4B] sm:text-[26px] lg:text-[clamp(22px,3vw,30px)]">
              <span className="block lg:inline">One connected flow.</span>
              <span className="block lg:inline lg:ml-2">End-to-end control.</span>
            </h2>
          </div>

          {/* Workflow steps: 2-col on mobile, 3-col on sm, 5-col on lg */}
          <div className="mx-auto mt-8 max-w-[1120px]">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
              {[
                { title: 'Plan', description: 'Create orders, plan routes and assign resources.', type: 'plan', iconTone: 'border-[#cfe0ff] bg-[#eef4ff] text-[#1260ff]' },
                { title: 'Execute', description: 'Dispatch loads, track movements and update every step.', type: 'execute', iconTone: 'border-[#ccefd8] bg-[#eff8ea] text-[#16a34a]' },
                { title: 'Deliver', description: 'Confirm delivery with POD and capture instant insights.', type: 'deliver', iconTone: 'border-[#ded4ff] bg-[#f0eaff] text-[#7a49d9]' },
                { title: 'Invoice', description: 'Auto-generate invoices and capture all documents.', type: 'invoice', iconTone: 'border-[#ffe0ba] bg-[#fff2e3] text-[#f28a20]' },
                { title: 'Reconcile', description: 'Track payments, reconcile and close the books.', type: 'reconcile', iconTone: 'border-[#c9f2ed] bg-[#e7f7f6] text-[#1aa39c]' },
              ].map((step, index) => (
                <div key={step.title} className="relative flex justify-center">
                  {index < 4 ? (
                    <div
                      className="pointer-events-none absolute left-[56%] top-[30px] hidden h-px w-[calc(100%+1.25rem)] -translate-y-1/2 bg-[linear-gradient(90deg,rgba(18,96,255,.0)_0,rgba(18,96,255,.22)_15%,rgba(18,96,255,.45)_50%,rgba(18,96,255,.22)_85%,rgba(18,96,255,.0)_100%)] bg-[length:14px_1px] bg-repeat-x lg:block"
                      aria-hidden="true"
                    />
                  ) : null}
                  {index < 4 ? (
                    <span
                      className="pointer-events-none absolute right-[-9px] top-[24px] hidden h-2.5 w-2.5 rounded-full bg-[#1260ff] shadow-[0_0_0_5px_rgba(18,96,255,.09)] lg:block"
                      aria-hidden="true"
                    />
                  ) : null}
                  <article className="relative z-10 flex w-full max-w-[180px] flex-col items-center text-center sm:max-w-[200px]">
                    <div className={`flex h-[52px] w-[52px] items-center justify-center rounded-full border shadow-[0_10px_24px_rgba(15,23,42,.06)] ${step.iconTone} sm:h-[56px] sm:w-[56px] lg:h-[60px] lg:w-[60px]`}>
                      <WorkflowIcon type={step.type} />
                    </div>
                    <h3 className="mt-3 text-[13px] font-bold leading-[1.2] text-[#081837] sm:text-[15px] lg:text-[16px]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[11px] leading-[1.5] text-[#64748B] sm:text-[12px] lg:text-[13px]">
                      {step.description}
                    </p>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="relative mt-10 overflow-hidden rounded-[18px] bg-[linear-gradient(105deg,#06163d_0%,#08265c_55%,#0b2349_100%)] px-4 py-6 text-white shadow-[0_20px_50px_rgba(8,22,61,.18)] sm:px-6 sm:py-8 lg:px-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-90"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(circle at 82% 50%, rgba(37,99,235,.22), transparent 32%), radial-gradient(circle at 86% 55%, rgba(255,255,255,.10), transparent 22%)',
              }}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] lg:block" aria-hidden="true">
              <div className="absolute right-[9%] top-1/2 h-[76px] w-[128px] -translate-y-1/2 rounded-[28px] border border-white/10 bg-white/5" />
              <div className="absolute right-[25%] top-[42%] h-[44px] w-[72px] rounded-[20px] border border-white/10 bg-white/5" />
              <div className="absolute right-[15%] top-[51%] h-[2px] w-[150px] rounded-full bg-white/15" />
              <div className="absolute right-[19%] top-[59%] h-[2px] w-[132px] rounded-full bg-white/10" />
              <div className="absolute right-[7%] top-[24%] h-[220px] w-[220px] rounded-full border border-white/10" />
              <div className="absolute right-[11%] top-[30%] h-[160px] w-[160px] rounded-full border border-white/10" />
              <div className="absolute right-[15%] top-[36%] h-[100px] w-[100px] rounded-full border border-white/10" />
            </div>
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-[580px]">
                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#9ec5ff]">Ready to move faster?</p>
                <h3 className="mt-1 text-[15px] font-semibold leading-[1.3] tracking-[-.01em] text-white sm:text-[17px]">
                  One platform for every shipment, every mile, every invoice.
                </h3>
              </div>
              <div className="flex flex-col gap-2 sm:shrink-0 sm:flex-row sm:items-center">
                <a
                  href="#platform-ecosystem"
                  className="inline-flex h-[40px] w-full items-center justify-center rounded-full bg-white px-5 text-[12px] font-semibold text-[#081B4B] shadow-[0_10px_25px_rgba(0,0,0,.16)] transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
                >
                  Explore Modules →
                </a>
                <a
                  href="/book-demo"
                  className="inline-flex h-[40px] w-full items-center justify-center rounded-full border border-[#f4c84b] bg-[#f7d64f] px-5 text-[12px] font-semibold text-[#081B4B] shadow-[0_10px_20px_rgba(247,214,79,.22)] transition-all duration-200 hover:bg-[#f5cf2f] hover:border-[#f5cf2f] sm:w-auto"
                >
                  Book a Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
