import {
  ArrowUpRight,
  BarChart3,
  Building2,
  CircleDollarSign,
  Eye,
  Factory,
  FileText,
  Handshake,
  Package,
  Route,
  ShieldCheck,
  Target,
  Truck,
  UserRound,
  UsersRound,
} from 'lucide-react';
import Button from '../components/Button.jsx';

const missionRows = [
  {
    title: 'Our Mission',
    description: 'To simplify logistics operations with innovative technology and empower every stakeholder to grow.',
    icon: Target,
  },
  {
    title: 'Our Vision',
    description: 'To become the most trusted logistics ecosystem that connects every stakeholder through intelligence and technology.',
    icon: Eye,
  },
  {
    title: 'Our Purpose',
    description: 'To build a connected, efficient and profitable logistics network for India.',
    icon: ShieldCheck,
  },
  {
    title: 'Our Promise',
    description: 'Simple to use. Easy to adopt. Built for growth.',
    icon: PromiseIcon,
  },
];

const storyPoints = [
  {
    title: 'Traditional & Manual Processes',
    description: 'Leads to inefficiency, high cost and low visibility.',
  },
  {
    title: 'Technology-Driven Transformation',
    description: 'Automation, real-time data and smarter planning.',
  },
  {
    title: 'Connected Ecosystem',
    description: 'Businesses, transporters, drivers and partners on one platform.',
  },
  {
    title: 'Smarter Logistics. Better Business.',
    description: 'Higher efficiency, lower cost, better cash flow.',
  },
];

const services = [
  {
    title: 'TMS Platform',
    description: 'End-to-end transportation management from booking to delivery with real-time tracking and visibility.',
    icon: Truck,
  },
  {
    title: 'Fleet Management',
    description: 'Manage your fleet, vehicles, drivers, maintenance, documents and compliance in one place.',
    icon: Route,
  },
  {
    title: 'Bill Discounting',
    description: 'Unlock working capital instantly. Get up to 100% invoice value with quick disbursement.',
    icon: CircleDollarSign,
  },
  {
    title: 'Finance & Billing',
    description: 'Automated invoicing, vendor payments, reconciliation, outstanding management and financial reports.',
    icon: FileText,
  },
  {
    title: 'Driver & Partner Network',
    description: 'Empower drivers and channel partners with mobile apps, incentives, support and transparent communication.',
    icon: UsersRound,
  },
];

const advantageItems = [
  {
    title: 'Improve Fleet Utilization',
    description: 'Reduce empty trips and increase profits',
    icon: BarChart3,
  },
  {
    title: 'Strengthen Cash Flow',
    description: 'Get paid faster with bill discounting',
    icon: CircleDollarSign,
  },
  {
    title: 'Real-Time Visibility',
    description: 'Live tracking and insights at every step',
    icon: Eye,
  },
  {
    title: 'Reduce Operational Cost',
    description: 'Automate processes and save time',
    icon: ShieldCheck,
  },
  {
    title: 'Data-Driven Decisions',
    description: 'Powerful reports and business intelligence',
    icon: ArrowUpRight,
  },
];

const stakeholders = [
  { label: 'Manufacturers', icon: Factory },
  { label: 'Transport Companies', icon: Truck },
  { label: 'Fleet Owners', icon: Building2 },
  { label: 'Drivers', icon: UserRound },
  { label: 'Distributors', icon: Package },
  { label: '3PL & Logistics Companies', icon: UsersRound },
  { label: 'Channel Partners', icon: HandshakeIcon },
];

function PromiseIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M3.5 11.5 8 7l3.2 3.2a1.8 1.8 0 0 0 2.6 0L17 7l3.5 3.5-4 4a3.4 3.4 0 0 1-4.8 0l-1.3-1.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.8 14.2 5.8 16.2a1.8 1.8 0 0 0 0 2.5l.7.7a1.8 1.8 0 0 0 2.5 0l2-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.6 11.2 16 13.6l1.7-1.7a1.8 1.8 0 0 1 2.5 0l.1.1a1.8 1.8 0 0 1 0 2.5l-2.6 2.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HandshakeIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M4 12.5 8.5 8l2.1 2.1a2 2 0 0 0 2.8 0L15.5 8 20 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 15.3 9 18a2 2 0 0 0 2.8 0l1.2-1.2a2 2 0 0 0 2.8 0l1.3-1.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 10.2 12 13.7 15.5 10.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionDivider() {
  return <div className="mx-auto my-0 h-px w-full max-w-[1280px] bg-[linear-gradient(90deg,transparent,rgba(18,96,255,.16),transparent)]" />;
}

function RowIcon({ icon: Icon }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef6ff] text-[#1260ff]">
      <Icon className="h-5 w-5" />
    </span>
  );
}

function StakeholderChip({ item }) {
  return (
    <div className="flex items-center gap-2 rounded-[10px] border border-[#dbe6fb] bg-white px-3 py-2 text-left shadow-[0_8px_20px_rgba(15,23,42,.04)] transition-colors duration-200 hover:border-[#bfd7ff]">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef6ff] text-[#1260ff]">
        <item.icon className="h-[15px] w-[15px]" />
      </span>
      <span className="text-[12px] font-medium leading-[1.2] text-[#081837]">{item.label}</span>
    </div>
  );
}

function AdvantageItem({ item, isLast }) {
  return (
    <div className={`flex flex-col gap-3 px-7 py-1 ${!isLast ? 'xl:border-r xl:border-[#dbe6fb] xl:pr-7' : ''}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef6ff] text-[#1260ff]">
        <item.icon className="h-[18px] w-[18px]" />
      </span>
      <div>
        <h3 className="text-[13px] font-bold leading-[1.2] tracking-[-.02em] text-[#081837]">{item.title}</h3>
        <p className="mt-1 max-w-[190px] text-[11px] leading-[1.5] text-[#64748B]">{item.description}</p>
      </div>
    </div>
  );
}

function ServiceCard({ item }) {
  return (
    <article className="flex h-full flex-col rounded-[12px] border border-[#dbe6fb] bg-white p-[18px] text-center shadow-[0_10px_24px_rgba(15,23,42,.045)] transition-all duration-200 hover:-translate-y-1 hover:border-[#c3d8ff] hover:shadow-[0_16px_34px_rgba(15,23,42,.08)]">
      <div className="mx-auto flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#eef6ff] text-[#1260ff]">
        <item.icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-[15px] font-bold leading-[1.2] text-[#081837]">{item.title}</h3>
      <p className="mt-2 text-[11px] leading-[1.55] text-[#64748B]">{item.description}</p>
    </article>
  );
}

function AboutUs() {
  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_78%_12%,rgba(18,96,255,.08),transparent_18%),linear-gradient(180deg,#fff_0%,#fbfdff_100%)] pt-[92px] text-[#071837]">
      <section className="px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px] text-[12px] text-[#64748B] sm:text-[13px]">
          <a href="/" className="transition-colors hover:text-[#1260ff]">Home</a>
          <span className="px-2 text-[#a8b7d3]">/</span>
          <span>About Us</span>
        </div>
      </section>

      <section className="px-4 pb-[70px] pt-[22px] sm:px-6 sm:pb-[78px] lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[.54fr_.46fr] lg:gap-14">
          <div className="max-w-[560px]">
            <p className="mb-3 inline-flex rounded-full border border-[#cfe0ff] bg-[#eef6ff] px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[#1260ff]">
              ABOUT EASYLANE
            </p>
            <h1 className="max-w-[560px] text-[clamp(34px,3.8vw,46px)] font-extrabold leading-[1.08] tracking-[-.06em] text-[#081837]">
              <span className="block">Transforming Logistics.</span>
              <span className="block">Empowering Businesses.</span>
            </h1>
            <p className="mt-6 max-w-[560px] text-[14px] leading-[1.7] text-[#5b677f] sm:text-[15px]">
              EasyLane is a technology-driven logistics platform that simplifies transportation operations and financial workflows for businesses, transporters, fleet owners, drivers and channel partners.
            </p>
            <p className="mt-4 max-w-[560px] text-[14px] leading-[1.7] text-[#5b677f] sm:text-[15px]">
              Our mission is to remove inefficiencies, reduce manual work and bring transparency across the entire logistics value chain through innovation and automation.
            </p>
          </div>

          <div className="rounded-[16px] border border-[#dbe6fb] bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,.06)] sm:p-5">
            <div className="divide-y divide-[#edf3ff]">
              {missionRows.map((row) => (
                <div key={row.title} className="grid grid-cols-[40px_128px_1fr] items-center gap-3 px-1 py-4 sm:grid-cols-[44px_132px_1fr] sm:py-4.5">
                  <RowIcon icon={row.icon} />
                  <h3 className="text-[13px] font-bold leading-[1.2] tracking-[-.02em] text-[#081837] sm:text-[14px]">{row.title}</h3>
                  <p className="text-[11px] leading-[1.5] text-[#64748B] sm:text-[12px]">{row.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-4 py-[68px] sm:px-6 sm:py-[76px] lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[.52fr_.48fr] lg:gap-14">
          <div className="max-w-[560px]">
            <p className="inline-flex rounded-full border border-[#cfe0ff] bg-[#eef6ff] px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[#1260ff]">
              OUR STORY
            </p>
            <h2 className="mt-3 text-[clamp(28px,3vw,36px)] font-extrabold leading-[1.12] tracking-[-.055em] text-[#081837]">
              Why EasyLane Exists
            </h2>
            <div className="mt-5 space-y-4 text-[14px] leading-[1.7] text-[#5b677f] sm:text-[15px]">
              <p>The logistics industry has been running on traditional methods for decades fragmented operations, limited visibility, delayed payments and empty return trips.</p>
              <p>We saw these challenges as an opportunity to build a unified platform that brings transportation, fleet, finance and people together.</p>
              <p>Today, EasyLane is helping businesses streamline their logistics operations, improve cash flow, enhance fleet utilization and build stronger partner networks.</p>
            </div>
          </div>

          <div className="rounded-[16px] border border-[#bfd7ff] bg-white p-5 shadow-[0_16px_40px_rgba(18,96,255,.08)] sm:p-6">
            <div className="space-y-4">
              {storyPoints.map((point) => (
                <div key={point.title} className="flex items-start gap-3 rounded-[12px] border border-[#edf3ff] bg-[#fbfdff] p-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1260ff] text-white">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-[13px] font-bold leading-[1.2] text-[#081837]">{point.title}</h3>
                    <p className="mt-1 text-[11px] leading-[1.5] text-[#64748B] sm:text-[12px]">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-4 py-[68px] sm:px-6 sm:py-[76px] lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="max-w-[760px]">
            <p className="inline-flex rounded-full border border-[#cfe0ff] bg-[#eef6ff] px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[#1260ff]">
              WHAT WE DO
            </p>
            <h2 className="mt-3 text-[clamp(28px,3vw,36px)] font-extrabold leading-[1.1] tracking-[-.055em] text-[#081837]">
              One Platform. Complete Logistics Solution.
            </h2>
            <p className="mt-3 max-w-[620px] text-[14px] leading-[1.7] text-[#5b677f] sm:text-[15px]">
              EasyLane brings all critical logistics and financial operations on a single, integrated platform.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {services.map((item) => (
              <ServiceCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-4 pb-[80px] pt-[84px] sm:px-6 sm:pb-[88px] sm:pt-[92px] lg:px-8 lg:pb-[96px] lg:pt-[96px]">
        <div className="mx-auto max-w-[1280px]">
          <p className="mb-4 inline-flex rounded-full border border-[#cfe0ff] bg-[#eef6ff] px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[#1260ff]">
            THE EASYLANE ADVANTAGE
          </p>
          <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2 xl:grid-cols-5 xl:gap-0">
            {advantageItems.map((item, index) => (
              <AdvantageItem key={item.title} item={item} isLast={index === advantageItems.length - 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-[76px] sm:px-6 sm:pb-[82px] lg:px-8">
        <div className="mx-auto max-w-[1280px] rounded-[18px] border border-[#dbe6fb] bg-[linear-gradient(180deg,#f6faff_0%,#eef5ff_100%)] p-5 shadow-[0_16px_40px_rgba(18,96,255,.08)] sm:p-6">
          <p className="inline-flex rounded-full border border-[#cfe0ff] bg-white px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[#1260ff]">
            WHO WE SERVE
          </p>
          <h2 className="mt-3 text-[clamp(22px,2.2vw,28px)] font-extrabold leading-[1.08] tracking-[-.05em] text-[#081837]">
            Built for Every Stakeholder in Logistics
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {stakeholders.map((item) => (
              <StakeholderChip key={item.label} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-[88px] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[16px] bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,.25),transparent_32%),linear-gradient(100deg,#062a84_0%,#0642c7_55%,#032b88_100%)] px-5 py-5 text-white shadow-[0_22px_54px_rgba(3,43,136,.18)] sm:px-6 sm:py-6 lg:px-7 lg:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[760px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#cfe0ff]">READY TO LEARN MORE?</p>
              <h2 className="mt-1 text-[clamp(20px,2.1vw,28px)] font-extrabold leading-[1.06] tracking-[-.055em] text-white">
                Partner with a team building the future of logistics.
              </h2>
            </div>
            <Button href="/book-demo" variant="primary" className="h-12 bg-[#ffe800] px-6 text-[12px] text-[#081837] hover:bg-[#ffdc00]">
              Book a Demo
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutUs;
