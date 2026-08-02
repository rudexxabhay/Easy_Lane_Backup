import { useState } from 'react';
import {
  BadgeCheck,
  Banknote,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FileText,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  ShieldCheck,
  Truck,
  Upload,
  UsersRound,
} from 'lucide-react';
import Button from '../components/Button.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import ecoVendor from '../assets/eco_vendor.png';

const benefits = [
  { icon: Truck, title: 'Trip Management', description: 'Accept and manage assigned trips with complete visibility.' },
  { icon: Upload, title: 'Invoice Management', description: 'Upload invoices digitally and track approval status.' },
  { icon: CircleDollarSign, title: 'Bill Discounting', description: 'Convert approved invoices into faster working capital.' },
  { icon: Banknote, title: 'Payment Tracking', description: 'Monitor payment status, settlements and transaction history.' },
  { icon: FileCheck2, title: 'Compliance Documents', description: 'Upload RC, Insurance, PAN, GST and driver documents to stay compliant.' },
  { icon: BarChart3, title: 'Performance Insights', description: 'Track completed trips, delivery performance and operational KPIs.' },
];

const steps = [
  { icon: Truck, number: '01', title: 'Receive Load Assignment', description: 'Trips instantly appear inside the dashboard.' },
  { icon: Truck, number: '02', title: 'Execute Delivery', description: 'Complete transportation while updating shipment milestones.' },
  { icon: FileText, number: '03', title: 'Upload Invoice & POD', description: 'Digitally submit invoices and proof of delivery.' },
  { icon: Banknote, number: '04', title: 'Receive Approval & Payment', description: 'Track approvals, settlements and bill discounting eligibility.' },
];

const vendorChecklist = ['Trip Assignment', 'Invoice Upload', 'POD Upload', 'Bill Discounting Access', 'Settlement History', 'Document Management', 'Payment Notifications', 'Vendor Performance Reports'];

const discountingBenefits = [
  { icon: Banknote, title: 'Faster Working Capital', description: 'Access funds sooner and improve vendor liquidity.' },
  { icon: FileCheck2, title: 'No Manual Paperwork', description: 'Keep invoice and POD workflows digital from end to end.' },
  { icon: ShieldCheck, title: 'Secure Approval Workflow', description: 'Track approvals with controlled, auditable steps.' },
  { icon: LockKeyhole, title: 'Transparent Settlement Process', description: 'Understand payment timing and settlement status clearly.' },
];

const performanceStats = [
  { value: '1,240', title: 'Completed Trips', description: 'Trips completed across the active vendor network.' },
  { value: '96%', title: 'On-Time Deliveries', description: 'Share of deliveries completed on schedule.' },
  { value: '88%', title: 'Invoice Approval Rate', description: 'Invoices moving through the approval flow successfully.' },
  { value: '2.3 Days', title: 'Average Settlement Time', description: 'Typical time to settle approved vendor payments.' },
];

const securityChecklist = ['Role-based Access', 'Encrypted Data', 'Digital Document Storage', 'GST Compliance', 'Vendor Verification', 'Audit History'];

const faqs = [
  { question: 'How do vendors receive trips?', answer: 'Assigned trips appear in the vendor dashboard as soon as operations dispatch them.' },
  { question: 'How are invoices uploaded?', answer: 'Invoices can be submitted digitally with the related trip and POD information attached.' },
  { question: 'What is Bill Discounting?', answer: 'Bill discounting lets approved invoices be converted into faster working capital.' },
  { question: 'How can vendors check payment status?', answer: 'Payment status, settlements and transaction history are visible inside the dashboard.' },
  { question: 'Can vendors manage compliance documents?', answer: 'Yes. Vendors can upload, store and monitor compliance documents in one secure place.' },
  { question: 'Can the dashboard be accessed from mobile devices?', answer: 'Yes. The dashboard is responsive and works across desktop, tablet and mobile devices.' },
];

function HighlightFigure() {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white p-4 shadow-[0_24px_70px_rgba(18,96,255,.16)]">
      <div className="absolute inset-x-[10%] top-[8%] h-40 rounded-full bg-[radial-gradient(circle,rgba(18,96,255,.22),transparent_68%)] blur-3xl" />
      <div className="relative overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_20px_44px_rgba(15,23,42,.09)]">
        <img src={ecoVendor} alt="Vendor Dashboard preview" className="block h-full w-full object-contain object-center" />
      </div>
    </div>
  );
}

function SecurityCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[
        { icon: LockKeyhole, title: 'Encrypted Data', detail: 'Vendor records and documents stay protected.' },
        { icon: ShieldCheck, title: 'Role-based Permissions', detail: 'Access levels can be tuned per vendor user.' },
        { icon: FileCheck2, title: 'Digital Document Storage', detail: 'Store compliance files in a central workspace.' },
        { icon: BadgeCheck, title: 'Audit History', detail: 'Track important document and workflow activity.' },
      ].map(({ icon: Icon, title, detail }) => (
        <div key={title} className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_12px_26px_rgba(15,23,42,.07)]">
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
  );
}

export default function VendorDashboard() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-white pt-[70px] text-[#071837]">
      <section className="bg-[radial-gradient(circle_at_80%_30%,rgba(18,96,255,.09),transparent_28%),#f8fbff] px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
        <div className="site-container grid items-center gap-12 lg:grid-cols-[.98fr_1.02fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#eaf2ff] px-3.5 py-1.5 text-[11px] font-bold tracking-[.02em] text-[#1260ff]">
              <LayoutDashboard size={14} /> VENDOR DASHBOARD
            </p>
            <h1 className="mt-5 max-w-3xl text-[27px] font-extrabold leading-[1.08] tracking-[-.05em] sm:text-[34px] lg:text-[40px]">
              Vendor Control
              <br />
              One Dashboard
            </h1>
            <p className="mt-5 max-w-2xl text-[13px] leading-6 text-slate-600 sm:text-sm sm:leading-7">
              Easy Lane&apos;s Vendor Dashboard provides transport vendors with a centralized workspace to manage assigned loads, upload invoices, monitor payments, access bill discounting, track settlements, maintain compliance documents, and communicate with transport teams—all from one secure portal. Improve operational efficiency while ensuring complete transparency across every shipment and payment cycle.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/book-demo" className="w-full sm:w-auto">Become a Vendor</Button>
              <Button href="/book-demo" variant="outline" className="w-full sm:w-auto">Book Demo</Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-[10%] top-[8%] h-40 rounded-full bg-[radial-gradient(circle,rgba(18,96,255,.22),transparent_68%)] blur-3xl" />
            <div className="relative">
              <div className="absolute -left-3 top-8 h-14 w-14 rounded-2xl bg-[#1260ff]/10 blur-[2px]" />
              <div className="absolute -right-2 bottom-10 h-20 w-20 rounded-full bg-[#1260ff]/12 blur-[2px]" />
              <HighlightFigure />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#1260ff] sm:text-[11px]">WHY VENDORS LOVE EASY LANE</p>
            <h2 className="mt-3 text-[24px] font-extrabold leading-[1.12] tracking-[-.045em] text-[#071837] sm:text-[30px]">
              Everything Vendors Need
              <br />
              In One Dashboard
            </h2>
            <p className="mt-3 text-[12px] leading-6 text-slate-500 sm:text-[13px]">
              Reduce manual follow-ups, improve vendor productivity and keep every trip, invoice and settlement organized in one modern workspace.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,.06)] transition hover:-translate-y-1">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#edf4ff] text-[#1260ff]">
                  <Icon size={16} />
                </span>
                <h3 className="mt-3 text-[15px] font-bold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-[11px] leading-5 text-slate-500">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fbff] px-5 py-16 sm:px-8 sm:py-20">
        <div className="site-container">
          <SectionTitle eyebrow="HOW IT WORKS" title="A Simple Workflow For Every Vendor" description="From assignment to settlement, the workflow stays clear and easy to manage so vendors can keep operations moving without friction." />
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
            <SectionTitle eyebrow="VENDOR CAPABILITIES" title="Built For Faster Vendor Operations" description="Easy Lane digitizes vendor operations by reducing paperwork, simplifying invoicing, improving communication and enabling quicker settlements." />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {vendorChecklist.map((item) => (
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
          <SectionTitle eyebrow="BILL DISCOUNTING" title="Improve Cash Flow With Bill Discounting" description="Approved invoices can be discounted through Easy Lane, allowing vendors to receive payments faster without waiting for long payment cycles." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {discountingBenefits.map(({ icon: Icon, title, description }) => (
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
          <SectionTitle eyebrow="VENDOR PERFORMANCE" title="Track Performance In Real Time" description="Understand vendor performance with a dashboard-style metrics area that keeps operations and settlement tracking visible." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {performanceStats.map(({ value, title, description }) => (
              <article key={title} className="rounded-[22px] border border-slate-100 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,.06)] transition hover:-translate-y-1">
                <p className="text-[32px] font-extrabold tracking-[-.05em] text-[#1260ff] sm:text-[36px]">{value}</p>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fbff] px-5 py-16 sm:px-8 sm:py-20">
        <div className="site-container">
          <SectionTitle eyebrow="SECURITY & COMPLIANCE" title="Secure Vendor Operations" description="Easy Lane keeps vendor documents, communications and operational activity protected with encrypted data, role-based access, compliance monitoring and audit-ready history." />
          <div className="mt-8 grid gap-3">
            {securityChecklist.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[18px] border border-slate-100 bg-white px-4 py-3.5 shadow-[0_8px_22px_rgba(15,23,42,.04)]">
                <CheckCircle2 className="shrink-0 text-[#1260ff]" size={18} />
                <span className="text-sm font-semibold text-slate-700">{item}</span>
              </div>
            ))}
            <SecurityCards />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="site-container">
          <SectionTitle eyebrow="FAQ" title="Frequently Asked Questions" description="Common questions about using the Vendor Dashboard day to day." />
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
