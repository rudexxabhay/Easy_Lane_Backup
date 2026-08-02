import { useState } from 'react';
import {
  BadgeCheck,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck2,
  FileText,
  Gauge,
  KeyRound,
  Layers3,
  LayoutDashboard,
  LockKeyhole,
  MessageSquareMore,
  ShieldCheck,
  Truck,
  UsersRound,
} from 'lucide-react';
import Button from '../components/Button.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import ecoClient from '../assets/eco_client.png';

const benefits = [
  { icon: Truck, title: 'Live Shipment Tracking', description: 'Monitor every shipment in real time with accurate location updates.' },
  { icon: Clock3, title: 'ETA & Delivery Timeline', description: 'Track estimated arrival times and milestone progress clearly.' },
  { icon: FileCheck2, title: 'Proof of Delivery', description: 'Instantly access signed PODs and completed delivery records.' },
  { icon: FileText, title: 'Invoice & Billing', description: 'Download invoices and monitor payment status from one place.' },
  { icon: BarChart3, title: 'Analytics & Reports', description: 'View shipment trends, monthly performance and logistics reports.' },
  { icon: Bell, title: 'Notifications', description: 'Receive alerts for shipment updates, delays and delivery confirmations.' },
];

const steps = [
  { icon: LayoutDashboard, number: '01', title: 'Booking Confirmed', description: 'Shipment appears instantly inside the dashboard.' },
  { icon: Truck, number: '02', title: 'Shipment In Transit', description: 'Track vehicle movement, milestones and ETA.' },
  { icon: CheckCircle2, number: '03', title: 'Delivery Completed', description: 'POD and delivery confirmation become available.' },
  { icon: FileText, number: '04', title: 'Reports & Invoices', description: 'Invoices, reports and shipment history remain accessible anytime.' },
];

const featureChecklist = ['Real-time Tracking', 'Live ETA', 'Invoice Download', 'Digital POD', 'Shipment History', 'Performance Reports', 'Alerts & Notifications', 'Multiple User Access'];

const businessValue = [
  { icon: MessageSquareMore, title: 'Reduce customer support calls', description: 'Give customers direct access to shipment status and documentation.' },
  { icon: Gauge, title: 'Faster issue resolution', description: 'Spot delays, exceptions and follow-ups earlier in the journey.' },
  { icon: UsersRound, title: 'Better customer satisfaction', description: 'Deliver a cleaner, more transparent customer experience.' },
  { icon: Layers3, title: 'Complete shipment transparency', description: 'Keep every milestone, record and report visible in one secure portal.' },
];

const faqs = [
  { question: 'How do customers access the dashboard?', answer: 'Customers log in through a secure portal with role-based access and account permissions defined by your team.' },
  { question: 'Can multiple users access the same account?', answer: 'Yes. You can configure multiple users, teams and access levels for the same customer organization.' },
  { question: 'Can invoices be downloaded?', answer: 'Yes. Approved invoices and billing records can be viewed and downloaded from the dashboard.' },
  { question: 'Can customers track multiple shipments?', answer: 'Yes. The dashboard is designed to handle multiple live shipments, each with its own milestone visibility.' },
  { question: 'Is POD available after delivery?', answer: 'Yes. Proof of delivery becomes available once the delivery is completed and verified.' },
  { question: 'Does the dashboard work on mobile devices?', answer: 'Yes. The layout is responsive and supports desktop, tablet and mobile use without changing the workflow.' },
];

function SecurityIllustration() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-[radial-gradient(circle_at_30%_20%,rgba(18,96,255,.12),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)] p-5 shadow-[0_18px_48px_rgba(18,96,255,.1)] sm:p-7">
      <div className="absolute right-[-10%] top-[-12%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(18,96,255,.14),transparent_68%)] blur-2xl" />
      <div className="absolute bottom-[-16%] left-[-10%] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(18,96,255,.08),transparent_68%)] blur-2xl" />
      <div className="relative grid gap-4">
        <div className="flex items-center justify-between rounded-[22px] border border-white/80 bg-white/90 p-4 shadow-[0_12px_28px_rgba(15,23,42,.08)] backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#edf4ff] text-[#1260ff]">
              <ShieldCheck size={22} />
            </span>
            <div>
              <p className="text-[11px] font-bold tracking-[.14em] text-[#1260ff]">SECURE ACCESS</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">Role-based portal controls</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">Encrypted</span>
        </div>
        <div className="grid gap-4">
          {[{ icon: LockKeyhole, title: 'Encrypted Login', detail: 'Protected customer access and private account data.' }, { icon: KeyRound, title: 'Controlled Permissions', detail: 'Different users can be limited to the right visibility.' }, { icon: BadgeCheck, title: 'Audit Trails', detail: 'Activity history helps operations and support teams stay aligned.' }].map(({ icon: Icon, title, detail }) => (
            <div key={title} className="rounded-[20px] border border-white/80 bg-white/90 p-4 shadow-[0_12px_26px_rgba(15,23,42,.07)]">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#edf4ff] text-[#1260ff]">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-white pt-[70px] text-[#071837]">
      <section className="bg-[radial-gradient(circle_at_80%_30%,rgba(18,96,255,.09),transparent_28%),#f8fbff] px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
        <div className="site-container grid items-center gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#eaf2ff] px-3.5 py-1.5 text-[11px] font-bold tracking-[.02em] text-[#1260ff]">
              <LayoutDashboard size={14} /> CLIENT DASHBOARD
            </p>
            <h1 className="mt-5 max-w-3xl text-[30px] font-extrabold leading-[1.08] tracking-[-.05em] sm:text-[38px] lg:text-[44px]">
              Client Dashboard
              <br />
              <span className="text-[#1260ff]">Complete Visibility</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[13px] leading-6 text-slate-600 sm:text-sm sm:leading-7">
              Give your customers complete control over every shipment through a modern self-service dashboard. Easy Lane&apos;s Client Dashboard provides live shipment visibility, delivery milestones, proof of delivery, invoices, reports, and actionable insights—all from one secure portal. Eliminate manual follow-ups, improve communication, and create a better customer experience with real-time logistics information available anytime.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/book-demo" className="w-full sm:w-auto">Book Demo</Button>
              <Button href="/contact-us" variant="outline" className="w-full sm:w-auto">Contact Sales</Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-x-[10%] top-[8%] h-40 rounded-full bg-[radial-gradient(circle,rgba(18,96,255,.22),transparent_68%)] blur-3xl" />
            <div className="relative">
              <div className="absolute -left-3 top-8 h-14 w-14 rounded-2xl bg-[#1260ff]/10 blur-[2px]" />
              <div className="absolute -right-2 bottom-10 h-20 w-20 rounded-full bg-[#1260ff]/12 blur-[2px]" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white p-4 shadow-[0_24px_70px_rgba(18,96,255,.16)]">
                <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_20px_44px_rgba(15,23,42,.09)]">
                  <img src={ecoClient} alt="Client Dashboard preview" className="block h-full w-full object-contain object-center" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pt-8 pb-16 sm:px-8 sm:pt-10 sm:pb-20">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#1260ff] sm:text-[11px]">KEY BENEFITS</p>
            <h2 className="mt-3 text-[24px] font-extrabold leading-[1.12] tracking-[-.045em] text-[#071837] sm:text-[30px]">
              Everything Your Customers Need In One Place
            </h2>
            <p className="mt-3 text-[12px] leading-6 text-slate-500 sm:text-[13px]">
              A centralized customer dashboard improves shipment transparency, keeps communication clear and gives customers faster answers without relying on manual follow-ups.
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-[20px] border border-slate-100 bg-white p-4.5 shadow-[0_14px_35px_rgba(15,23,42,.06)] transition hover:-translate-y-1">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#edf4ff] text-[#1260ff]">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 text-[16px] font-bold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-[12px] leading-5 text-slate-500">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fbff] px-5 py-16 sm:px-8 sm:py-20">
        <div className="site-container">
          <SectionTitle eyebrow="HOW CLIENT DASHBOARD WORKS" title="A Simple Experience For Every Customer" description="Customers move from booking to reporting in a clean, predictable workflow that keeps every shipment easy to follow." />
          <div className="relative mt-10">
            <div className="absolute left-6 right-6 top-10 hidden h-px bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 lg:block" />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ icon: Icon, number, title, description }) => (
                <article key={title} className="group relative rounded-[22px] border border-slate-100 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,.1)]">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#edf4ff] text-[#1260ff] transition group-hover:scale-105">
                      <Icon size={22} />
                    </span>
                    <span className="rounded-full bg-[#f4f8ff] px-3 py-1 text-[11px] font-bold tracking-[.12em] text-[#1260ff]">{number}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="site-container grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <SectionTitle eyebrow="CLIENT DASHBOARD FEATURES" title="Designed For Complete Shipment Visibility" description="Customers no longer need to call operations teams for updates because shipment status, documents and reports are available inside one secure portal." />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {featureChecklist.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[18px] border border-slate-100 bg-[#f8fbff] px-4 py-3.5 shadow-[0_8px_22px_rgba(15,23,42,.04)]">
                <CheckCircle2 className="shrink-0 text-[#1260ff]" size={18} />
                <span className="text-sm font-semibold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fbff] px-5 py-16 sm:px-8 sm:py-20">
        <div className="site-container">
          <SectionTitle eyebrow="BUSINESS VALUE" title="Business Value" description="The Client Dashboard improves visibility for customers while reducing friction across support, operations and reporting workflows." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {businessValue.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-[22px] border border-slate-100 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,.06)] transition hover:-translate-y-1">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#edf4ff] text-[#1260ff]">
                  <Icon size={19} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="site-container">
          <SectionTitle eyebrow="SECURITY" title="Enterprise Grade Security" description="Easy Lane protects customer information through role-based access, encrypted data, secure login flows, controlled permissions and audit-ready activity logging." />
          <div className="mt-8">
            <SecurityIllustration />
          </div>
        </div>
      </section>

      <section className="bg-[#f8fbff] px-5 py-16 sm:px-8 sm:py-20">
        <div className="site-container">
          <SectionTitle eyebrow="FAQ" title="Frequently Asked Questions" description="Common questions about how customers use the Client Dashboard day to day." />
          <div className="mt-10 grid gap-4">
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
                      <span className="mt-2 block text-base font-bold text-slate-900 sm:text-lg">{item.question}</span>
                    </span>
                    <ChevronDown className={`shrink-0 text-[#1260ff] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} size={20} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-200 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 text-sm leading-7 text-slate-500 sm:px-6">{item.answer}</div>
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
