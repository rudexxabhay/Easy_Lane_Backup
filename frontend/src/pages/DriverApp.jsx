import { useState } from 'react';
import {
  BadgeCheck,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileCheck2,
  Gauge,
  LayoutDashboard,
  MapPin,
  Navigation,
  PhoneCall,
  Smartphone,
  Truck,
  Upload,
  UserRound,
} from 'lucide-react';
import Button from '../components/Button.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import ecoDriver from '../assets/eco_driver.png';

const benefits = [
  { icon: Truck, title: 'Trip Updates', description: 'See assigned loads, route details and live trip status in one place.' },
  { icon: Navigation, title: 'Navigation & Maps', description: 'Access route guidance and movement information with less switching between tools.' },
  { icon: Upload, title: 'Document Upload', description: 'Upload trip-related files, receipts and delivery documents instantly.' },
  { icon: Gauge, title: 'Expenses & Mileage', description: 'Track trip expenses, mileage and journey-related records clearly.' },
  { icon: Bell, title: 'Alerts & Notifications', description: 'Stay informed about new assignments, delays and delivery changes.' },
  { icon: PhoneCall, title: 'SOS & Support', description: 'Reach operations support quickly when a trip needs attention.' },
];

const steps = [
  { icon: LayoutDashboard, number: '01', title: 'Trip Assigned', description: 'New trip details appear inside the driver app immediately.' },
  { icon: MapPin, number: '02', title: 'Start Journey', description: 'Use route guidance and live trip information while on the road.' },
  { icon: Upload, number: '03', title: 'Upload Proof', description: 'Submit receipts, documents and delivery proof directly from the app.' },
  { icon: CheckCircle2, number: '04', title: 'Complete Trip', description: 'Trip completion, milestones and records are stored for reference.' },
];

const capabilities = ['Trip Assignments', 'Live Route Updates', 'Document Upload', 'Delivery Proof', 'Expense Tracking', 'Trip History', 'Driver Communication', 'SOS Support'];

const performanceCards = [
  { icon: Clock3, title: 'Trip Completion', description: 'Measure on-time trip completion and delivery consistency.' },
  { icon: FileCheck2, title: 'Document Readiness', description: 'Track whether the right documents are uploaded for each trip.' },
  { icon: UserRound, title: 'Driver Activity', description: 'Monitor app usage and assigned trip participation.' },
  { icon: BadgeCheck, title: 'Operational Compliance', description: 'Keep driver-side workflows aligned with transport requirements.' },
];

const securityChecklist = ['Role-based Access', 'Encrypted Data', 'Trip History', 'Secure Login', 'Document Storage', 'Audit Logs'];

const faqs = [
  { question: 'How do drivers receive trip assignments?', answer: 'Assigned trips appear directly in the app as soon as operations dispatch them.' },
  { question: 'Can drivers upload documents from mobile?', answer: 'Yes. Drivers can upload documents, receipts and delivery proof from their device.' },
  { question: 'Does the app support live updates?', answer: 'Yes. The app is designed to keep drivers aligned with trip and route updates.' },
  { question: 'Can expenses be tracked?', answer: 'Yes. Drivers can capture trip expenses and related records in the app.' },
  { question: 'Is SOS support available?', answer: 'Yes. The app can be used to contact operations support when needed.' },
  { question: 'Does it work on mobile devices?', answer: 'Yes. The Driver App is built for mobile-first usage and adapts to different screen sizes.' },
];

function AppPreview() {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white p-4 shadow-[0_24px_70px_rgba(18,96,255,.16)]">
      <div className="absolute inset-x-[10%] top-[8%] h-40 rounded-full bg-[radial-gradient(circle,rgba(18,96,255,.22),transparent_68%)] blur-3xl" />
      <div className="relative overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_20px_44px_rgba(15,23,42,.09)]">
        <img src={ecoDriver} alt="Driver App preview" className="block h-full w-full object-contain object-center" />
      </div>
    </div>
  );
}

export default function DriverApp() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-white pt-[70px] text-[#071837]">
      <section className="bg-[radial-gradient(circle_at_80%_30%,rgba(18,96,255,.09),transparent_28%),#f8fbff] px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
        <div className="site-container grid items-center gap-12 lg:grid-cols-[.98fr_1.02fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#eaf2ff] px-3.5 py-1.5 text-[11px] font-bold tracking-[.02em] text-[#1260ff]">
              <Smartphone size={14} /> DRIVER APP
            </p>
            <h1 className="mt-5 max-w-3xl text-[27px] font-extrabold leading-[1.08] tracking-[-.05em] sm:text-[34px] lg:text-[40px]">
              Driver App
              <br />
              Built for the Road
            </h1>
            <p className="mt-5 max-w-2xl text-[13px] leading-6 text-slate-600 sm:text-sm sm:leading-7">
              Easy Lane&apos;s Driver App keeps drivers connected to assigned trips, route information, documents, expenses and support in one mobile-first workspace. Reduce missed updates, simplify trip execution and make every delivery easier to manage from the field.
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
              <AppPreview />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#1260ff] sm:text-[11px]">WHY DRIVERS USE EASY LANE</p>
            <h2 className="mt-3 text-[24px] font-extrabold leading-[1.12] tracking-[-.045em] text-[#071837] sm:text-[30px]">
              One App
              <br />
              Less Manual Work
            </h2>
            <p className="mt-3 text-[12px] leading-6 text-slate-500 sm:text-[13px]">
              A mobile-first driver workspace helps teams reduce calls, keep trips moving and handle documents and updates without extra coordination.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
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

      <section className="bg-[#f8fbff] px-5 py-16 sm:px-8 sm:py-20">
        <div className="site-container">
          <SectionTitle eyebrow="HOW IT WORKS" title="A Simple Workflow For Drivers" description="The app keeps each trip clear from assignment to completion so drivers can move through the workflow without confusion." />
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
            <SectionTitle eyebrow="DRIVER CAPABILITIES" title="Built For Real-Time Trip Execution" description="Easy Lane helps drivers stay organized by digitizing trip updates, communication, document handling and field operations in one place." />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {capabilities.map((item) => (
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
          <SectionTitle eyebrow="DRIVER PERFORMANCE" title="Track Driver Activity In Real Time" description="Operations teams can keep an eye on trip completion, document readiness and app usage without switching tools." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {performanceCards.map(({ icon: Icon, title, description }) => (
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
          <SectionTitle eyebrow="SECURITY & COMPLIANCE" title="Secure Driver Operations" description="Driver communication, records and document workflows stay protected with encrypted data, role-based access and audit history." />
          <div className="mt-8 grid gap-3">
            {securityChecklist.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[18px] border border-slate-100 bg-white px-4 py-3.5 shadow-[0_8px_22px_rgba(15,23,42,.04)]">
                <CheckCircle2 className="shrink-0 text-[#1260ff]" size={18} />
                <span className="text-sm font-semibold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fbff] px-5 py-16 sm:px-8 sm:py-20">
        <div className="site-container">
          <SectionTitle eyebrow="FAQ" title="Frequently Asked Questions" description="Common questions about using the Driver App day to day." />
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
