import { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Fuel,
  Gauge,
  LayoutDashboard,
  MessageSquareMore,
  Network,
  Route,
  ShieldCheck,
  Smartphone,
  Truck,
  UsersRound,
  Workflow,
} from 'lucide-react';
import Button from '../components/Button.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import ecoOperational from '../assets/eco_operational.png';

const capabilities = [
  {
    icon: LayoutDashboard,
    title: 'Live Dispatch',
    description: 'Assign and monitor trips from a single operational workspace.',
  },
  {
    icon: Route,
    title: 'Trip Monitoring',
    description: 'Track trip movement, ETA shifts and route progress in real time.',
  },
  {
    icon: Bell,
    title: 'Alert Management',
    description: 'See delays, exceptions and urgent updates as they happen.',
  },
  {
    icon: UsersRound,
    title: 'Team Coordination',
    description: 'Keep drivers, vendors and support teams aligned on every trip.',
  },
  {
    icon: Fuel,
    title: 'Cost Control',
    description: 'Watch fuel, trip and exception costs without switching screens.',
  },
  {
    icon: BarChart3,
    title: 'Operational Reporting',
    description: 'Review performance trends, utilization and service quality.',
  },
];

const steps = [
  {
    icon: Truck,
    number: '01',
    title: 'Assign Trip',
    description: 'Trips and load details appear in the operations dashboard instantly.',
  },
  {
    icon: Smartphone,
    number: '02',
    title: 'Track Movement',
    description: 'Monitor vehicle movement, milestones and live ETA updates.',
  },
  {
    icon: AlertTriangle,
    number: '03',
    title: 'Resolve Exceptions',
    description: 'Handle delays, approvals and exceptions before they affect service.',
  },
  {
    icon: CheckCircle2,
    number: '04',
    title: 'Close The Trip',
    description: 'Review completion, reports and action items from one place.',
  },
];

const benefitCards = [
  {
    icon: Workflow,
    title: 'Faster Control',
    description: 'Operations teams can react quickly because every trip is visible in one place.',
  },
  {
    icon: MessageSquareMore,
    title: 'Clearer Communication',
    description: 'Reduce calls and manual follow-ups with a shared operational view.',
  },
  {
    icon: Gauge,
    title: 'Better Utilization',
    description: 'Keep fleets, routes and schedules aligned for stronger throughput.',
  },
  {
    icon: Network,
    title: 'Connected Workflow',
    description: 'Dispatch, vendor, driver and management teams stay connected end to end.',
  },
];

const checklist = [
  'Smart Dispatch',
  'Live ETA',
  'Trip Exceptions',
  'Driver Coordination',
  'Load History',
  'Delay Alerts',
  'Performance Reports',
  'Role-based Access',
];

const securityPoints = [
  'Encrypted Data',
  'Controlled Permissions',
  'Audit Logs',
  'Secure Login',
  'Protected Trip Records',
  'Document Access Control',
];

const faqs = [
  {
    question: 'How do operations teams use the dashboard?',
    answer: 'They use it to manage trips, monitor movement, handle alerts and keep teams aligned.',
  },
  {
    question: 'Can multiple team members access the same workspace?',
    answer: 'Yes. Access can be shared with controlled permissions based on team roles.',
  },
  {
    question: 'Does it show live trip updates?',
    answer: 'Yes. The dashboard is built to surface trip movement, milestones and status updates in real time.',
  },
  {
    question: 'Can the team track exceptions and delays?',
    answer: 'Yes. Alerts and exceptions are visible so the team can act quickly.',
  },
  {
    question: 'Is the dashboard useful for reporting?',
    answer: 'Yes. It helps teams review performance, trip activity and operational trends.',
  },
  {
    question: 'Does it work on mobile devices?',
    answer: 'Yes. The page and dashboard previews are responsive across desktop, tablet and mobile.',
  },
];

function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-[620px]">
      <div className="absolute inset-x-[12%] top-[8%] h-44 rounded-full bg-[radial-gradient(circle,rgba(18,96,255,.24),transparent_68%)] blur-3xl" />
      <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white p-4 shadow-[0_24px_72px_rgba(18,96,255,.16)]">
        <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_20px_44px_rgba(15,23,42,.1)]">
          <img
            src={ecoOperational}
            alt="Operations Dashboard preview"
            className="block h-full w-full object-contain object-center"
          />
        </div>
      </div>
    </div>
  );
}

function StepCard({ step }) {
  const Icon = step.icon;

  return (
    <article className="group relative rounded-[18px] border border-slate-100 bg-white px-4 pb-4 pt-5 text-center shadow-[0_12px_34px_rgba(15,23,42,.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,.1)]">
      <span className="absolute left-1/2 top-0 flex h-[28px] w-[28px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-[#1260ff] text-[12px] font-bold text-white shadow-[0_10px_22px_rgba(18,96,255,.22)]">
        {step.number}
      </span>
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#edf4ff] text-[#1260ff] transition group-hover:scale-105">
        <Icon size={22} />
      </span>
      <h3 className="mt-4 text-[14px] font-bold leading-[1.2] tracking-[-0.03em] text-slate-900">
        {step.title}
      </h3>
      <p className="mt-2 text-[11px] leading-5 text-slate-500">
        {step.description}
      </p>
    </article>
  );
}

export default function OperationsDashboard() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-white pt-[70px] text-[#071837]">
      <section className="bg-[radial-gradient(circle_at_80%_25%,rgba(18,96,255,.09),transparent_28%),#f8fbff] px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
        <div className="site-container grid items-center gap-10 lg:grid-cols-[.98fr_1.02fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#eaf2ff] px-3.5 py-1.5 text-[11px] font-bold tracking-[.02em] text-[#1260ff]">
              <Network size={14} /> OPERATIONS DASHBOARD
            </p>
            <h1 className="mt-4 max-w-3xl text-[26px] font-extrabold leading-[1.08] tracking-[-.05em] sm:text-[32px] lg:text-[38px]">
              Operations Dashboard
              <br />
              One Control Center
              <br />
              Complete Visibility
            </h1>
            <p className="mt-4 max-w-2xl text-[13px] leading-6 text-slate-600 sm:text-sm sm:leading-7">
              Easy Lane&apos;s Operations Dashboard gives teams a clear view of live dispatch, trip progress, exceptions, alerts and performance. Keep every shipment moving with less manual follow-up and faster operational decisions.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/book-demo" className="w-full sm:w-auto">Book Demo</Button>
              <Button href="/contact-us" variant="outline" className="w-full sm:w-auto">Contact Sales</Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-2 top-8 h-14 w-14 rounded-2xl bg-[#1260ff]/10 blur-[2px]" />
            <div className="absolute -right-2 bottom-8 h-20 w-20 rounded-full bg-[#1260ff]/12 blur-[2px]" />
            <HeroVisual />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-8 sm:py-18">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#1260ff] sm:text-[11px]">WHY OPERATIONS TEAMS USE EASY LANE</p>
            <h2 className="mt-3 text-[23px] font-extrabold leading-[1.12] tracking-[-.045em] text-[#071837] sm:text-[28px]">
              Everything Operations Teams Need
              <br />
              In One Dashboard
            </h2>
            <p className="mt-3 text-[12px] leading-6 text-slate-500 sm:text-[13px]">
              A central operations view reduces calls, speeds up decisions and gives teams a single place to manage trips, alerts and service quality.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-[18px] border border-slate-100 bg-white p-3.5 shadow-[0_14px_35px_rgba(15,23,42,.06)] transition hover:-translate-y-1">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#edf4ff] text-[#1260ff]">
                  <Icon size={16} />
                </span>
                <h3 className="mt-3 text-[14px] font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-[10.5px] leading-5 text-slate-500">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fbff] px-5 py-14 sm:px-8 sm:py-18">
        <div className="site-container">
          <SectionTitle
            eyebrow="HOW IT WORKS"
            title="A Simple Workflow For Every Operation"
            description="The dashboard keeps each stage of the trip visible so teams can move from assignment to closure without losing context."
          />
          <div className="relative mt-8">
            <div className="absolute left-6 right-6 top-10 hidden h-px bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 lg:block" />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <StepCard key={step.title} step={step} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-8 sm:py-18">
        <div className="site-container">
          <SectionTitle
            eyebrow="OPERATIONAL CAPABILITIES"
            title="Built For Faster Trip Control"
            description="Easy Lane helps operations teams digitize dispatch, monitor movement and keep daily logistics work organized in one secure portal."
          />
          <div className="mt-8 grid gap-3">
            {checklist.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[18px] border border-slate-100 bg-[#f8fbff] px-4 py-3.5 shadow-[0_8px_22px_rgba(15,23,42,.04)]">
                <CheckCircle2 className="shrink-0 text-[#1260ff]" size={18} />
                <span className="text-[13px] font-semibold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fbff] px-5 py-14 sm:px-8 sm:py-18">
        <div className="site-container">
          <SectionTitle
            eyebrow="BUSINESS VALUE"
            title="Operational Benefits That Show Up Every Day"
            description="A shared operations workspace improves responsiveness, reduces friction and gives leadership better visibility into service execution."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {benefitCards.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-[22px] border border-slate-100 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,.06)] transition hover:-translate-y-1">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#edf4ff] text-[#1260ff]">
                  <Icon size={19} />
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-[12px] leading-6 text-slate-500">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-8 sm:py-18">
        <div className="site-container">
          <SectionTitle
            eyebrow="SECURITY & COMPLIANCE"
            title="Secure Operations Every Day"
            description="Role-based access, encrypted communication, audit history and controlled permissions help protect operational data across teams."
          />
          <div className="mt-8 grid gap-3">
            {securityPoints.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[18px] border border-slate-100 bg-white px-4 py-3.5 shadow-[0_8px_22px_rgba(15,23,42,.04)]">
                <ShieldCheck className="shrink-0 text-[#1260ff]" size={18} />
                <span className="text-[13px] font-semibold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fbff] px-5 py-14 sm:px-8 sm:py-18">
        <div className="site-container">
          <SectionTitle
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="Quick answers about using the Operations Dashboard day to day."
          />
          <div className="mt-8 grid gap-4">
            {faqs.map((item, index) => {
              const open = openFaq === index;

              return (
                <div key={item.question} className="overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,.05)]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                    aria-expanded={open}
                  >
                    <span className="min-w-0">
                      <span className="block text-[10px] font-bold tracking-[.12em] text-[#1260ff]">FAQ {String(index + 1).padStart(2, '0')}</span>
                      <span className="mt-2 block text-[15px] font-bold text-slate-900 sm:text-[16px]">{item.question}</span>
                    </span>
                    <ChevronDown className={`shrink-0 text-[#1260ff] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} size={20} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-200 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 text-[13px] leading-6 text-slate-500 sm:px-6">{item.answer}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
