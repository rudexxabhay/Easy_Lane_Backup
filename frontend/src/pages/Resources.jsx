import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CircleHelp,
  FileText,
  Headphones,
  IndianRupee,
  MapPinned,
  MessageCircleQuestion,
  Network,
  Package,
  Search,
  ShieldCheck,
  Truck,
  TrendingUp,
  UserRound,
} from 'lucide-react';

const resourceCategories = [
  {
    title: 'Blogs',
    description: 'Industry trends, expert opinions and the latest logistics insights.',
    link: '#latest-insights',
    Icon: FileText,
    accent: 'blue',
  },
  {
    title: 'Case Studies',
    description: 'Real customer stories and how Easy Lane delivers measurable results.',
    link: '#latest-insights',
    Icon: BriefcaseBusiness,
    accent: 'green',
  },
  {
    title: 'Guides & Ebooks',
    description: 'In-depth guides to help you solve logistics and business challenges.',
    link: '#latest-insights',
    Icon: BookOpen,
    accent: 'purple',
  },
  {
    title: 'Help Center',
    description: 'Step-by-step articles to help you get the most out of Easy Lane.',
    link: '#support',
    Icon: CircleHelp,
    accent: 'orange',
  },
  {
    title: 'FAQs',
    description: 'Quick answers to the most common questions about Easy Lane.',
    link: '#support',
    Icon: MessageCircleQuestion,
    accent: 'teal',
  },
];

const insightCards = [
  {
    category: 'TMS',
    title: 'How TMS Helps Logistics Companies Improve Efficiency & Reduce Costs',
    description: 'Discover how a modern Transport Management System can optimize routes, reduce empty trips and improve on-time delivery.',
    date: 'May 20, 2026',
    readingTime: '5 min read',
  },
  {
    category: 'FINANCE',
    title: 'Bill Discounting in Logistics: Improve Cash Flow and Grow Your Business',
    description: 'Convert approved invoices into instant cash, reduce payment delays and strengthen your working capital.',
    date: 'May 15, 2026',
    readingTime: '4 min read',
  },
  {
    category: 'VISIBILITY',
    title: 'Real-Time Visibility: The Key to Smarter Logistics Operations',
    description: 'Learn how real-time tracking and visibility improve decision-making, customer trust and overall operational control.',
    date: 'May 10, 2026',
    readingTime: '6 min read',
  },
];

const roleItems = [
  { title: 'Shippers', description: 'Optimize freight spend, visibility and performance.', Icon: Package, accent: 'blue' },
  { title: 'Transporters', description: 'Manage fleets, drivers and operations better.', Icon: Truck, accent: 'green' },
  { title: '3PL / Logistics', description: 'Streamline multi-client operations at scale.', Icon: Network, accent: 'purple' },
  { title: 'Finance Teams', description: 'Improve cash flow and financial control.', Icon: IndianRupee, accent: 'amber' },
  { title: 'Drivers', description: 'Access trips, digital tools and real-time updates.', Icon: UserRound, accent: 'teal' },
  { title: 'Administrators', description: 'Control platform access, reports and workflows.', Icon: ShieldCheck, accent: 'slate' },
];

const accentClasses = {
  blue: 'bg-[#edf4ff] text-[#1260ff] border-[#d8e8ff]',
  green: 'bg-[#edfdf3] text-[#1f9d5a] border-[#d6f4e1]',
  purple: 'bg-[#f2edff] text-[#6d4eff] border-[#e2d9ff]',
  orange: 'bg-[#fff4e9] text-[#d97706] border-[#fde2c2]',
  teal: 'bg-[#ecfbfb] text-[#0f9aa7] border-[#d0f2f4]',
  amber: 'bg-[#fff8e5] text-[#c48a00] border-[#ffe9a3]',
  slate: 'bg-[#eef3fb] text-[#2f4a72] border-[#d9e4f3]',
};

function ResourceHubVisual() {
  const sidebarItems = [
    [FileText, 'Blogs', true],
    [BriefcaseBusiness, 'Case Studies', false],
    [BookOpen, 'Guides', false],
    [CircleHelp, 'Help Center', false],
    [MessageCircleQuestion, 'FAQs', false],
  ];

  return (
    <div className="relative mx-auto h-[430px] w-full max-w-[560px] lg:h-[520px]">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_67%_29%,rgba(18,96,255,.2),transparent_30%),radial-gradient(circle_at_80%_38%,rgba(18,96,255,.1),transparent_22%),radial-gradient(circle_at_15%_18%,rgba(255,232,0,.08),transparent_24%)] blur-2xl" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(18, 96, 255, .12) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          maskImage: 'linear-gradient(180deg, rgba(0, 0, 0, .9), transparent 88%)',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0, 0, 0, .9), transparent 88%)',
        }}
      />
      <svg aria-hidden="true" viewBox="0 0 560 430" className="pointer-events-none absolute inset-0 h-full w-full">
        <path d="M84 127 C146 102, 178 100, 230 124" fill="none" stroke="#bfd6ff" strokeDasharray="4 8" strokeWidth="1.4" />
        <path d="M408 104 C365 126, 338 138, 300 168" fill="none" stroke="#bfd6ff" strokeDasharray="4 8" strokeWidth="1.4" />
        <path d="M132 300 C178 270, 222 258, 282 252" fill="none" stroke="#bfd6ff" strokeDasharray="4 8" strokeWidth="1.4" />
        <circle cx="84" cy="127" r="4.5" fill="#1260ff" />
        <circle cx="230" cy="124" r="4.5" fill="#1260ff" />
        <circle cx="408" cy="104" r="4.5" fill="#1260ff" />
        <circle cx="300" cy="168" r="4.5" fill="#1260ff" />
        <circle cx="132" cy="300" r="4.5" fill="#1260ff" />
        <circle cx="282" cy="252" r="4.5" fill="#1260ff" />
      </svg>

      <div className="absolute left-0 top-16 z-20 hidden w-[176px] rounded-[13px] border border-[#dbe7fb] bg-white/95 px-3 py-2.5 shadow-[0_10px_26px_rgba(15,23,42,.08)] backdrop-blur-[2px] sm:block">
        <div className="mb-2 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#edf4ff] text-[#1260ff]">
            <TrendingUp size={14} aria-hidden="true" />
          </span>
          <span className="text-[12px] font-bold text-[#071837]">Logistics Insights</span>
        </div>
        <p className="text-[11px] leading-[1.45] text-slate-500">New perspectives on routing, visibility and efficiency.</p>
      </div>

      <div className="absolute right-0 top-6 z-20 hidden w-[154px] rounded-[13px] border border-[#dbe7fb] bg-white/95 px-3 py-2.5 shadow-[0_10px_26px_rgba(15,23,42,.08)] backdrop-blur-[2px] sm:block">
        <div className="mb-2 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#edfdf3] text-[#1f9d5a]">
            <BriefcaseBusiness size={14} aria-hidden="true" />
          </span>
          <span className="text-[12px] font-bold text-[#071837]">Case Study</span>
        </div>
        <p className="text-[11px] leading-[1.45] text-slate-500">Measured gains from modern logistics operations.</p>
      </div>

      <div className="absolute left-12 bottom-7 z-20 hidden w-[158px] rounded-[13px] border border-[#dbe7fb] bg-white/95 px-3 py-2.5 shadow-[0_10px_26px_rgba(15,23,42,.08)] backdrop-blur-[2px] sm:block">
        <div className="mb-2 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#fff4e9] text-[#d97706]">
            <BookOpen size={14} aria-hidden="true" />
          </span>
          <span className="text-[12px] font-bold text-[#071837]">Best Practices</span>
        </div>
        <p className="text-[11px] leading-[1.45] text-slate-500">Practical guidance for logistics teams.</p>
      </div>

      <div className="absolute left-1/2 top-12 z-10 w-[450px] max-w-[calc(100%-1rem)] -translate-x-1/2 rounded-[18px] border border-[#dbe7fb] bg-white/88 shadow-[0_18px_44px_rgba(15,23,42,.09)] backdrop-blur-[2px]">
        <div className="rounded-t-[18px] bg-[#eef5ff] px-4 py-2.5 text-[12px] font-semibold text-[#1260ff]">
          Easy Lane Resource Hub
        </div>
        <div className="grid grid-cols-[128px_minmax(0,1fr)] gap-0">
          <aside className="border-r border-[#eef3fb] px-3 py-4">
            <div className="space-y-1">
              {sidebarItems.map(([Icon, label, active]) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 rounded-[10px] px-2.5 py-2 text-[11px] font-semibold ${
                    active ? 'bg-[#edf4ff] text-[#1260ff]' : 'text-slate-600'
                  }`}
                >
                  <span className={`grid h-6 w-6 place-items-center rounded-full ${active ? 'bg-white/90 text-[#1260ff]' : 'bg-[#f5f8fd] text-slate-500'}`}>
                    <Icon size={13} aria-hidden="true" />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </aside>
          <div className="px-4 py-4">
            <div className="rounded-[16px] border border-[#dfeaff] bg-[linear-gradient(135deg,rgba(249,252,255,.96)_0%,rgba(238,245,255,.92)_55%,rgba(231,239,255,.92)_100%)] p-3">
              <div className="relative h-[120px] overflow-hidden rounded-[14px] border border-white/70 bg-[linear-gradient(135deg,#0a2c73_0%,#1260ff_42%,#dfeaff_42%,#f7fbff_100%)]">
                <svg aria-hidden="true" viewBox="0 0 320 120" className="absolute inset-0 h-full w-full">
                  <path d="M20 88 C72 58, 108 70, 148 45 S220 25, 278 58" fill="none" stroke="#c7dcff" strokeWidth="2.2" />
                  <path d="M18 92 L284 92" fill="none" stroke="#9cc2ff" strokeDasharray="5 7" strokeWidth="1.2" />
                  <circle cx="22" cy="88" r="4" fill="#ffe800" />
                  <circle cx="114" cy="68" r="4" fill="#ffffff" />
                  <circle cx="162" cy="45" r="4" fill="#ffe800" />
                  <circle cx="238" cy="32" r="4" fill="#ffffff" />
                  <circle cx="278" cy="58" r="4" fill="#1260ff" />
                </svg>
                <div className="absolute left-4 top-4 rounded-full bg-white/88 px-2.5 py-1 text-[10px] font-bold text-[#1260ff] shadow-sm backdrop-blur-[1px]">
                  Featured article
                </div>
                <div className="absolute left-6 bottom-6 flex h-12 w-20 items-end gap-1">
                  <div className="h-4 w-3 rounded-[2px] bg-[#ffe800]" />
                  <div className="h-8 w-3 rounded-[2px] bg-white" />
                  <div className="h-10 w-3 rounded-[2px] bg-[#1260ff]" />
                  <div className="h-6 w-3 rounded-[2px] bg-[#8fb4ff]" />
                </div>
                <div className="absolute right-4 bottom-4 grid h-11 w-11 place-items-center rounded-full bg-white shadow-[0_8px_20px_rgba(15,23,42,.15)]">
                  <Truck size={20} className="text-[#1260ff]" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-2.5 w-[88%] rounded-full bg-slate-200/90" />
                <div className="h-2.5 w-[76%] rounded-full bg-slate-200/90" />
                <div className="h-2 w-[62%] rounded-full bg-slate-100" />
                <div className="h-2 w-[68%] rounded-full bg-slate-100" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="inline-flex rounded-full bg-[#edf4ff] px-2.5 py-1 text-[10px] font-bold text-[#1260ff]">
                  Logistics
                </span>
                <span className="text-[11px] font-semibold text-[#1260ff]">
                  Read more <ArrowRight size={12} className="inline-block align-[-1px]" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ item }) {
  const Icon = item.Icon;

  return (
    <a
      href={item.link}
      className="group flex h-full min-h-[220px] flex-col rounded-[14px] border border-[#dbe7fb] bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,.04)] transition duration-[250ms] hover:-translate-y-1 hover:border-[#b7d2ff] hover:shadow-[0_14px_34px_rgba(18,96,255,.1)]"
    >
      <span className={`grid h-12 w-12 place-items-center rounded-full border ${accentClasses[item.accent]} shadow-[0_8px_16px_rgba(15,23,42,.05)]`}>
        <Icon size={20} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-[19px] font-bold leading-[1.2] text-[#071837]">{item.title}</h3>
      <p className="mt-3 text-[13px] leading-[1.7] text-slate-500">{item.description}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[12px] font-bold text-[#1260ff]">
        {item.title === 'Blogs' && 'Explore Blogs'}
        {item.title === 'Case Studies' && 'View Case Studies'}
        {item.title === 'Guides & Ebooks' && 'Browse Ebooks'}
        {item.title === 'Help Center' && 'Visit Help Center'}
        {item.title === 'FAQs' && 'View FAQs'}
        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </a>
  );
}

function TmsVisual() {
  return (
    <div className="relative h-full overflow-hidden rounded-[14px] bg-[linear-gradient(140deg,#0a2c73_0%,#103d8f_48%,#f3f8ff_48%,#dceaff_100%)]">
      <img
        src="https://images.unsplash.com/photo-1720811559337-c59b75acc4de?auto=format&fit=crop&w=1400&q=85"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,21,51,.02)_0%,rgba(4,21,51,.14)_100%)]" />
    </div>
  );
}

function FinanceVisual() {
  return (
    <div className="relative h-full overflow-hidden rounded-[14px] bg-[linear-gradient(140deg,#0b2a5c_0%,#123d8b_50%,#f7fbff_50%,#e1ecff_100%)]">
      <img
        src="https://images.unsplash.com/photo-1748609160056-7b95f30041f0?auto=format&fit=crop&w=1400&q=85"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,21,51,.02)_0%,rgba(4,21,51,.16)_100%)]" />
    </div>
  );
}

function VisibilityVisual() {
  return (
    <div className="relative h-full overflow-hidden rounded-[14px] bg-[linear-gradient(140deg,#082150_0%,#1260ff_46%,#f4f8ff_46%,#dbe8ff_100%)]">
      <img
        src="https://images.unsplash.com/photo-1774116196662-a9e1e4fa1612?auto=format&fit=crop&w=1400&q=85"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,21,51,.02)_0%,rgba(4,21,51,.18)_100%)]" />
    </div>
  );
}

function InsightCard({ item, visual }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-[#dbe7fb] bg-white shadow-[0_8px_22px_rgba(15,23,42,.04)] transition duration-[250ms] hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(18,96,255,.1)]">
      <div className="relative h-[170px] overflow-hidden">
        {visual}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#1260ff] shadow-sm">
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[19px] font-bold leading-[1.24] text-[#071837]">{item.title}</h3>
        <p className="mt-3 text-[13px] leading-[1.7] text-slate-500">{item.description}</p>
        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between gap-4 text-[11px] font-semibold text-slate-500">
            <span>{item.date}</span>
            <span>{item.readingTime}</span>
          </div>
          <a
            href="#top"
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-[#1260ff]"
          >
            Read article
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Resources() {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();

  const filteredCategories = resourceCategories.filter((item) => {
    if (!normalized) return true;
    return [item.title, item.description].some((value) => value.toLowerCase().includes(normalized));
  });

  const filteredInsights = insightCards.filter((item) => {
    if (!normalized) return true;
    return [item.category, item.title, item.description].some((value) => value.toLowerCase().includes(normalized));
  });

  return (
    <main id="top" className="bg-white pb-12 pt-[64px] text-[#071837] sm:pb-16 sm:pt-[72px]">
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 78% 24%, rgba(18, 96, 255, .1), transparent 30%), radial-gradient(circle at 14% 20%, rgba(18, 96, 255, .05), transparent 22%), radial-gradient(circle at 88% 36%, rgba(18, 96, 255, .08), transparent 20%)',
          }}
        />
        <div className="mx-auto w-[min(calc(100%-2rem),1280px)] sm:w-[min(calc(100%-3rem),1280px)] lg:w-[min(calc(100%-6rem),1280px)]">
          <div className="grid min-h-[460px] items-center gap-10 py-2 lg:grid-cols-[.97fr_1.03fr] lg:gap-8 lg:py-4">
            <div className="relative z-10 max-w-[560px]">
              <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">Resources</p>
              <h1 className="max-w-[520px] text-[46px] font-[800] leading-[1.05] tracking-[-0.05em] text-[#071837] sm:text-[52px] lg:text-[56px]">
                <span className="block">Knowledge. Insights.</span>
                <span className="block text-[#1260ff]">Smarter Logistics.</span>
              </h1>
              <p className="mt-5 max-w-[500px] text-[16px] leading-[1.65] text-slate-600">
                Actionable insights, practical guides and expert perspectives to help you streamline logistics, cut costs and grow your business.
              </p>
              <form className="mt-6 w-full max-w-[460px]" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="resource-search" className="sr-only">
                  Search resources
                </label>
                <div className="flex h-[48px] overflow-hidden rounded-[10px] border border-[#cfe0fb] bg-white shadow-[0_8px_22px_rgba(15,23,42,.03)] focus-within:border-[#1260ff] focus-within:ring-2 focus-within:ring-[#1260ff]/15">
                  <input
                    id="resource-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search resources, guides, blogs..."
                    className="min-w-0 flex-1 bg-transparent px-4 text-[14px] text-[#071837] outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    aria-label="Search resources"
                    className="grid w-[48px] shrink-0 place-items-center bg-[#1260ff] text-white transition-colors hover:bg-[#0f54de]"
                  >
                    <Search size={18} aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>

            <div className="relative z-10">
              <ResourceHubVisual />
            </div>
          </div>
        </div>
      </section>

      <section id="resource-categories" className="pt-16 sm:pt-20">
        <div className="mx-auto w-[min(calc(100%-2rem),1280px)] sm:w-[min(calc(100%-3rem),1280px)] lg:w-[min(calc(100%-6rem),1280px)]">
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">Explore our resources</p>
            <h2 className="mt-4 text-[30px] font-[800] leading-[1.12] tracking-[-0.045em] text-[#071837] sm:text-[34px]">
              Find the right resource for you
            </h2>
          </div>
          <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {filteredCategories.map((item) => (
              <ResourceCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section id="latest-insights" className="pt-[4.5rem] sm:pt-20">
        <div className="mx-auto w-[min(calc(100%-2rem),1280px)] sm:w-[min(calc(100%-3rem),1280px)] lg:w-[min(calc(100%-6rem),1280px)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[760px]">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">Latest insights</p>
              <h2 className="mt-4 text-[30px] font-[800] leading-[1.12] tracking-[-0.045em] text-[#071837] sm:text-[34px]">
                Fresh perspectives to keep you ahead
              </h2>
            </div>
            <a href="#latest-insights" className="text-[14px] font-bold text-[#1260ff]">
              View all blogs <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredInsights.map((item, index) => {
              const visuals = [TmsVisual, FinanceVisual, VisibilityVisual];
              const Visual = visuals[index] || TmsVisual;
              return <InsightCard key={item.title} item={item} visual={<Visual />} />;
            })}
          </div>
        </div>
      </section>

      <section className="pt-16 sm:pt-20">
        <div className="mx-auto w-[min(calc(100%-2rem),1280px)] sm:w-[min(calc(100%-3rem),1280px)] lg:w-[min(calc(100%-6rem),1280px)]">
          <div className="rounded-[18px] bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)] px-5 py-14 sm:px-6 lg:px-0">
            <div className="mx-auto max-w-[920px]">
              <div className="text-center">
                <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">Knowledge built for every role</p>
                <h2 className="mt-4 text-[30px] font-[800] leading-[1.12] tracking-[-0.045em] text-[#071837] sm:text-[34px]">
                  Resources tailored for your team
                </h2>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-0">
                {roleItems.map((item, index) => {
                  const Icon = item.Icon;
                  return (
                    <div
                      key={item.title}
                      className={`px-2 text-center ${
                        index < roleItems.length - 1 ? 'lg:border-r lg:border-[#d8e8ff]' : ''
                      }`}
                    >
                      <span className={`mx-auto grid h-12 w-12 place-items-center rounded-full border ${accentClasses[item.accent]}`}>
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <h3 className="mt-4 text-[15px] font-bold text-[#071837]">{item.title}</h3>
                      <p className="mx-auto mt-2 max-w-[160px] text-[12px] leading-[1.6] text-slate-500">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="support" className="pt-10 sm:pt-12">
        <div className="mx-auto w-[min(calc(100%-2rem),1280px)] sm:w-[min(calc(100%-3rem),1280px)] lg:w-[min(calc(100%-6rem),1280px)]">
          <div className="grid gap-5 lg:grid-cols-[.38fr_.62fr]">
            <div className="relative overflow-hidden rounded-[16px] border border-[#dbe7fb] bg-[linear-gradient(135deg,#f8fbff_0%,#eef5ff_100%)] p-6 min-h-[170px]">
              <div className="relative z-10 max-w-[220px]">
                <h3 className="text-[18px] font-bold text-[#071837]">Still have questions?</h3>
                <p className="mt-2 text-[14px] font-semibold text-[#071837]">We&apos;re here to help.</p>
                <p className="mt-2 text-[13px] leading-[1.65] text-slate-600">
                  Explore our Help Center or reach out to our support team.
                </p>
                <a
                  href="#support"
                  className="mt-5 inline-flex h-[44px] items-center justify-center rounded-[9px] border border-[#1260ff] bg-white px-4 text-[13px] font-bold text-[#1260ff] transition-colors hover:bg-[#f4f8ff]"
                >
                  Visit Help Center <span className="ml-1" aria-hidden="true">→</span>
                </a>
              </div>
              <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[44%] min-w-[150px]">
                <div className="absolute right-8 top-8 grid h-14 w-14 place-items-center rounded-full bg-[#edf4ff] text-[#1260ff] shadow-sm">
                  <Headphones size={28} />
                </div>
                <div className="absolute right-16 top-[74px] rounded-[16px] rounded-br-[6px] bg-white px-3 py-2 text-[11px] font-semibold text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,.08)]">
                  Support reply in progress
                </div>
                <span className="absolute right-4 top-5 h-20 w-20 rounded-full border border-[#cfe0fb]" />
                <span className="absolute right-14 bottom-6 h-10 w-10 rounded-full bg-[#1260ff]/10" />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[16px] border border-[#071837] bg-[linear-gradient(135deg,#041533_0%,#0b3eaa_100%)] p-7 min-h-[170px] text-white">
              <div className="relative z-10 max-w-[430px]">
                <h3 className="text-[21px] font-bold leading-[1.15] sm:text-[24px]">
                  Want to see Easy Lane in action?
                </h3>
                <p className="mt-3 max-w-[390px] text-[14px] leading-[1.7] text-white/78">
                  Book a personalized demo and see how we can transform your logistics operations.
                </p>
                <a
                  href="/book-demo"
                  className="mt-6 inline-flex h-[44px] items-center justify-center rounded-[9px] bg-white px-5 text-[13px] font-bold text-[#071837] transition-colors hover:bg-[#f4f7fb]"
                >
                  Book a Demo <span className="ml-1" aria-hidden="true">→</span>
                </a>
              </div>
              <svg aria-hidden="true" viewBox="0 0 420 180" className="absolute inset-0 h-full w-full opacity-30">
                <path d="M42 120 H126 L160 92 H244 L292 58 H372" fill="none" stroke="#9ec2ff" strokeWidth="2.2" strokeDasharray="6 8" />
                <circle cx="42" cy="120" r="5" fill="#ffe800" />
                <circle cx="126" cy="120" r="5" fill="#ffffff" />
                <circle cx="160" cy="92" r="5" fill="#1260ff" />
                <circle cx="244" cy="92" r="5" fill="#ffffff" />
                <circle cx="292" cy="58" r="5" fill="#ffe800" />
                <circle cx="372" cy="58" r="5" fill="#ffffff" />
              </svg>
              <div className="absolute right-6 bottom-5 h-24 w-44 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute right-8 top-8 h-16 w-24 rounded-[18px] border border-white/10 bg-white/10" />
              <div className="absolute right-12 top-12 h-10 w-10 rounded-full border border-white/15 bg-white/10" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
