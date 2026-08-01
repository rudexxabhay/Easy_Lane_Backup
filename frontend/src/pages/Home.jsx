import { motion, useReducedMotion } from 'framer-motion';
import { Fragment, useEffect, useRef, useState } from 'react';
import {
  ArrowRight, BarChart3, Boxes, BriefcaseBusiness, ChevronLeft, ChevronRight, CircleDollarSign,
  Clock3, FileCheck2, Gauge, Network, Radar, ReceiptIndianRupee,
  Route, ShieldCheck, Smartphone, Truck, UsersRound, WalletCards, Zap, Package, ShoppingCart, Factory, Pill, Snowflake, Waypoints, Landmark, Rocket, Check, Upload,
} from 'lucide-react';
import Hero from '../components/Hero.jsx';
import ControlTowerMap from '../components/ControlTowerMap.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import Button from '../components/Button.jsx';
import SevenPillars from '../components/sections/SevenPillars.jsx';
import logo from '../assets/logo.png';
import i1 from '../assets/i1.webp';
import i2 from '../assets/i2.webp';
import i3 from '../assets/i3.webp';
import i4 from '../assets/i4.webp';
import i6 from '../assets/i6.webp';
import i7 from '../assets/i7.webp';
import i8 from '../assets/i8.webp';
import whatIsEasyLaneImage from '../assets/whatiseasylane.png';
import trustedLogosImage from '../../../EasyLaneSS/trusted.png';
import { api } from '../lib/api.js';
const fadeUp = { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.16 }, transition: { duration: 0.48 } };
const platforms = [
  ['Client Dashboard', 'Live shipment tracking\nETA monitoring\nPOD visibility\nAnalytics & reports', BarChart3, 'from-blue-600 to-blue-400'],
  ['Vendor Dashboard', 'Invoice tracking\nPayment visibility\nBill discounting access\nTrip & load history', BriefcaseBusiness, 'from-emerald-600 to-emerald-400'],
  ['Driver App', 'Trip updates\nNavigation & maps\nDocument upload\nExpenses & SOS', Smartphone, 'from-amber-400 to-orange-500'],
  ['Operations Dashboard', 'Smart dispatching\nTrip management\nAlerts & analytics\nAI driven analytics', Network, 'from-violet-600 to-purple-400'],
];
const howItWorksSteps = [
  {
    number: '1',
    title: 'Trip Completed',
    description: 'Trip and POD are completed and verified on the platform.',
    accent: 'bg-[#1260ff]',
    type: 'trip',
  },
  {
    number: '2',
    title: 'Invoice Raised',
    description: 'Invoice is generated and submitted on the platform.',
    accent: 'bg-[#1260ff]',
    type: 'invoice',
  },
  {
    number: '3',
    title: 'Invoice Approved',
    description: 'Invoice is reviewed, approved, and made ready for funding.',
    accent: 'bg-[#16a34a]',
    type: 'approved',
  },
  {
    number: '4',
    title: 'Funds Released',
    description: 'Approved invoice amount is released to your bank account.',
    accent: 'bg-[#d97706]',
    type: 'funds',
  },
];
const howItWorksBenefits = [
  { title: '100% Digital', description: 'Paperless process', icon: FileCheck2 },
  { title: 'Quick Approval', description: 'Streamlined approval flow', icon: Zap },
  { title: 'Secure', description: 'Bank-grade security', icon: ShieldCheck },
  { title: 'Fast Payouts', description: 'As fast as 4 hours', icon: Clock3 },
];
const whatIsEasyLaneModules = [
  {
    title: 'TMS & Transport',
    description: 'Manage trips, loads, assets & dispatch',
    icon: Truck,
    tint: 'bg-[#edf4ff]',
    iconClass: 'text-[#1260ff]',
    top: 'top-[74px]',
  },
  {
    title: 'Bill Discounting',
    description: 'Unlock cash flow with fast & flexible funding',
    icon: ReceiptIndianRupee,
    tint: 'bg-[#eefaf2]',
    iconClass: 'text-emerald-600',
    top: 'top-[212px]',
  },
  {
    title: 'Vendor / Driver / Admin',
    description: 'Manage vendors, drivers & admin workflows',
    icon: UsersRound,
    tint: 'bg-[#f4efff]',
    iconClass: 'text-violet-600',
    top: 'top-[350px]',
  },
];
const whatIsEasyLaneMiniBenefits = [
  {
    title: 'One Connected Platform',
    description: 'TMS, finance and operations together',
    icon: Network,
  },
  {
    title: 'Real-Time Visibility',
    description: 'Track every trip and workflow live',
    icon: Radar,
  },
  {
    title: 'Faster Cash Flow',
    description: 'Invoice funding and quicker settlements',
    icon: CircleDollarSign,
  },
];

function DashboardPreview({ dark = false }) {
  return <div className={`rounded-[20px] border p-3 shadow-xl ${dark ? 'border-white/10 bg-[#071b43]' : 'border-slate-100 bg-white'}`}>
    <div className="flex items-center gap-2"><span className="h-7 w-7 rounded-lg bg-[#0d5eff]" /><span className={`h-2 w-20 rounded-full ${dark ? 'bg-white/20' : 'bg-slate-200'}`} /><span className="ml-auto h-2 w-10 rounded-full bg-emerald-400" /></div>
    <div className="mt-3 grid grid-cols-[58px_1fr] gap-3"><div className={`rounded-lg p-2 ${dark ? 'bg-white/5' : 'bg-slate-50'}`}><i /><i /><i /><i /></div><div className="space-y-2"><div className={`h-12 rounded-lg ${dark ? 'bg-blue-400/15' : 'bg-blue-50'}`} /><div className="grid grid-cols-3 gap-2"><div className="h-10 rounded-lg bg-emerald-50" /><div className="h-10 rounded-lg bg-blue-50" /><div className="h-10 rounded-lg bg-amber-50" /></div><div className={`h-16 rounded-lg ${dark ? 'bg-white/5' : 'bg-slate-50'}`} /></div></div>
  </div>;
}

function OperationsDashboardVisual() {
  const modules = [['Maintenance', 'Service & Repair', Gauge, 'text-emerald-600'], ['Fuel Management', 'Monitor Expenses', CircleDollarSign, 'text-[#1260ff]'], ['Trip Management', 'Load & Route', Route, 'text-violet-600'], ['Compliance', 'Docs & Permits', FileCheck2, 'text-emerald-600'], ['Driver Management', 'Performance & Safety', UsersRound, 'text-[#1260ff]'], ['Cost Health', 'Analyze & Reduce', BarChart3, 'text-amber-500']];
  const ModuleCard = ({ module, className = '' }) => { const [title, detail, Icon, color] = module; return <div className={`flex min-w-[126px] items-center gap-2.5 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-[0_9px_20px_rgba(15,23,42,.1)] ${className}`}><Icon size={18} className={color}/><div><p className="text-[9px] font-bold text-slate-800">{title}</p><p className="mt-0.5 text-[7px] text-slate-400">{detail}</p></div></div>; };
  return <div className="relative mx-auto w-full max-w-[900px] pt-8 lg:px-[92px]"><div className="hidden lg:block"><ModuleCard module={modules[0]} className="absolute left-0 top-[14%]" /><ModuleCard module={modules[1]} className="absolute left-0 top-[43%]" /><ModuleCard module={modules[2]} className="absolute bottom-[8%] left-0" /><ModuleCard module={modules[3]} className="absolute right-0 top-[14%]" /><ModuleCard module={modules[4]} className="absolute right-0 top-[43%]" /><ModuleCard module={modules[5]} className="absolute bottom-[8%] right-0" /></div><div className="overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_20px_42px_rgba(15,23,42,.14)]"><div className="flex h-9 items-center border-b border-slate-100 px-4"><img src={logo} alt="" className="h-5 w-5 object-contain" /><span className="ml-2 text-[8px] font-bold text-slate-800">Easy Lane Overview</span><span className="ml-auto h-2 w-16 rounded bg-slate-100" /></div><div className="grid grid-cols-[48px_1fr]"><aside className="bg-[#041333] px-2.5 py-4"><span className="mb-4 block h-2 rounded bg-[#1260ff]" />{Array.from({ length: 7 }).map((_, index) => <span key={index} className="mb-4 block h-2 rounded bg-white/20" />)}</aside><div className="p-3.5"><div className="grid grid-cols-4 gap-2.5">{[['Total Vehicles', '1,261', 'text-slate-800'], ['Active Trips', '230', 'text-slate-800'], ['Trips Completed', '1,840', 'text-emerald-600'], ['On-Time Performance', '92%', 'text-emerald-600']].map(([label, value, color]) => <div key={label} className="rounded-lg border border-slate-100 p-2"><p className="text-[6px] text-slate-400">{label}</p><p className={`mt-1 text-[12px] font-extrabold ${color}`}>{value}</p></div>)}</div><div className="mt-2.5 grid grid-cols-3 gap-2.5"><div className="rounded-lg border border-slate-100 p-2.5"><p className="text-[7px] text-slate-500">Fleet Health</p><div className="mt-2 flex items-center gap-2"><span className="h-11 w-11 rounded-full border-[6px] border-emerald-400 border-r-slate-100" /><span className="text-[12px] font-bold">1,261</span></div></div><div className="rounded-lg border border-slate-100 p-2.5"><p className="text-[7px] text-slate-500">Active Trips</p><div className="mt-2 flex items-center gap-2"><span className="h-11 w-11 rounded-full border-[6px] border-[#6b9cff] border-r-slate-100" /><span className="text-[12px] font-bold">230</span></div></div><div className="rounded-lg border border-slate-100 p-2.5"><p className="text-[7px] text-slate-500">Fuel Cost This Month</p><p className="mt-1 text-[12px] font-extrabold">₹18.6L</p><div className="mt-2 flex h-7 items-end gap-1">{[2, 4, 3, 6, 4, 8].map((height, index) => <span key={index} style={{ height: `${height * 3}px` }} className="w-1.5 rounded-t bg-[#1260ff]" />)}</div></div></div><div className="mt-2.5 grid grid-cols-4 gap-2.5">{[['Maintenance Due', '26'], ['Trip Alerts', '14'], ['AI Insights', '9'], ['Invoices Discounted', '₹4.8Cr']].map(([label, value]) => <div key={label} className="rounded-lg border border-slate-100 p-2"><p className="text-[6px] text-slate-400">{label}</p><p className="mt-1 text-[9px] font-extrabold text-slate-800">{value}</p></div>)}</div></div></div></div><div className="mt-4 grid grid-cols-2 gap-3 lg:hidden">{modules.map((module) => <ModuleCard key={module[0]} module={module} />)}</div></div>;
}

function PlatformCard({ item }) { const [title, bullets, Icon] = item; const theme = { 'Client Dashboard': { surface: 'bg-[#edf4ff]', badge: 'bg-[#1260ff]', accent: 'bg-[#bdd4ff]', ring: 'border-[#1260ff]', dot: 'bg-[#1260ff]' }, 'Vendor Dashboard': { surface: 'bg-[#effaf4]', badge: 'bg-[#16a36a]', accent: 'bg-[#bcebd3]', ring: 'border-[#16a36a]', dot: 'bg-[#16a36a]' }, 'Driver App': { surface: 'bg-[#fff8e6]', badge: 'bg-[#f0a900]', accent: 'bg-[#ffe3a0]', ring: 'border-[#e5a000]', dot: 'bg-[#e5a000]' }, 'Operations Dashboard': { surface: 'bg-[#f5f0ff]', badge: 'bg-[#7a49d9]', accent: 'bg-[#dccbff]', ring: 'border-[#7a49d9]', dot: 'bg-[#7a49d9]' } }[title]; return <motion.article {...fadeUp} className="min-w-[300px] rounded-[22px] border border-[rgba(15,23,42,.05)] bg-white px-4 pb-4 pt-4 shadow-[0_18px_42px_rgba(15,23,42,.09)] transition hover:-translate-y-1 sm:min-w-0"><div className={`relative h-[136px] shrink-0 overflow-visible rounded-[14px] border border-white/80 p-3 ${theme.surface}`}><div className="flex h-3 items-center gap-2 border-b border-white/70 pb-2"><span className={`h-2 w-8 rounded-full ${theme.accent}`} /><span className="h-2 w-2 rounded-full bg-white/90" /><span className="ml-auto h-2 w-7 rounded-full bg-white/85" /></div><div className="mt-2 grid h-[92px] grid-cols-[24px_1fr] gap-2"><aside className="rounded-lg bg-white/70 p-1.5"><span className="mb-2 block h-1.5 rounded bg-slate-200" /><span className="mb-2 block h-1.5 rounded bg-slate-200" /><span className="mb-2 block h-1.5 rounded bg-slate-200" /><span className="block h-1.5 rounded bg-slate-200" /></aside><div className="grid grid-rows-[28px_1fr] gap-2"><div className="grid grid-cols-3 gap-2"><span className="rounded-lg bg-white/90" /><span className="rounded-lg bg-white/75" /><span className="rounded-lg bg-white/90" /></div><div className="grid grid-cols-[1.25fr_.75fr] gap-2"><div className="rounded-lg bg-white/85 p-2"><span className="block h-1.5 w-2/3 rounded bg-slate-200" /><span className={`mt-3 block h-5 rounded-md ${theme.accent}`} /></div><div className="rounded-lg bg-white/80 p-2"><span className="block h-1.5 w-3/4 rounded bg-slate-200" /><span className={`mt-3 block h-6 rounded-t-full border-b-2 ${theme.ring}`} /></div></div></div></div><span className={`absolute -bottom-[21px] left-2 flex h-[42px] w-[42px] items-center justify-center rounded-[14px] text-white shadow-[0_7px_16px_rgba(15,23,42,.17)] ${theme.badge}`}><Icon size={19} /></span></div><div className="px-2"><h3 className="mt-7 text-[19px] font-bold leading-[1.1] tracking-[-.035em] text-slate-900">{title}</h3><ul className="mt-2.5 space-y-1.5 text-[13px] leading-none text-slate-500">{bullets.split('\n').map((x) => <li className="flex items-center gap-2" key={x}><span className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-full border-2 ${theme.ring}`}><span className={`h-[3px] w-[3px] rounded-full ${theme.dot}`} /></span>{x}</li>)}</ul><a href="#contact" className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold leading-none text-[#1260ff]">Learn more <ArrowRight size={13} /></a></div></motion.article>; }

function FinanceFeature({ icon: Icon, title }) { return <div className="flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#1260ff]"><Icon size={22} /></span><span className="max-w-[112px] pt-1 text-[13px] font-bold leading-[1.25] text-slate-700">{title}</span></div>; }

function WhatIsEasyLaneHub() {
  return (
    <div className="what-is-easy-lane__hub" aria-hidden="true">
      <span className="what-is-easy-lane__hub-glow" />
      <span className="what-is-easy-lane__hub-ring" />
      <span className="what-is-easy-lane__hub-core">
        <img src={logo} alt="" className="what-is-easy-lane__hub-logo" />
      </span>
    </div>
  );
}

function HowItWorksStepVisual({ type }) {
  switch (type) {
    case 'trip':
      return (
        <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[#edf5ff]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 160" aria-hidden="true">
            <defs>
              <linearGradient id="how-it-works-trip-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eef5ff" />
                <stop offset="100%" stopColor="#f8fbff" />
              </linearGradient>
            </defs>
            <circle cx="80" cy="80" r="79" fill="url(#how-it-works-trip-bg)" />
            <circle cx="54" cy="53" r="12" fill="#cfe3ff" opacity=".8" />
            <path d="M97 44c11 4 18 13 22 24" fill="none" stroke="#d7e8ff" strokeWidth="7" strokeLinecap="round" />
            <path d="M47 104c11-9 25-13 42-11" fill="none" stroke="#d7e8ff" strokeWidth="7" strokeLinecap="round" />
          </svg>
          <Truck className="relative z-10 h-[50px] w-[50px] text-[#1260ff]" strokeWidth={1.85} aria-hidden="true" />
          <span className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffe76b] text-[#9b7100] shadow-[0_8px_20px_rgba(245,174,35,.22)]" aria-hidden="true">
            <Check size={10} strokeWidth={2.8} />
          </span>
        </div>
      );
    case 'invoice':
      return (
        <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[#eef6ff]">
          <ReceiptIcon />
          <span className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1260ff] text-white shadow-[0_8px_20px_rgba(18,96,255,.22)]" aria-hidden="true">
            <Upload size={9} strokeWidth={2.35} />
          </span>
        </div>
      );
    case 'approved':
      return (
        <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[#eef9f1]">
          <ShieldCheck className="relative z-10 h-[52px] w-[52px] text-[#16a34a]" strokeWidth={1.8} aria-hidden="true" />
          <span className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-[0_8px_20px_rgba(22,163,74,.2)]" aria-hidden="true">
            <Check size={10} strokeWidth={2.8} />
          </span>
        </div>
      );
    case 'funds':
      return (
        <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[#fff7e6]">
          <Landmark className="relative z-10 h-[52px] w-[52px] text-[#d97706]" strokeWidth={1.8} aria-hidden="true" />
          <span className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#f7be38] text-[#8a6400] shadow-[0_8px_20px_rgba(247,190,56,.25)]" aria-hidden="true">
            <ReceiptIndianRupee size={9} strokeWidth={2.2} />
          </span>
        </div>
      );
    default:
      return null;
  }
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 96 96" className="relative z-10 h-[56px] w-[56px]" aria-hidden="true">
      <rect x="25" y="19" width="38" height="56" rx="8" fill="#fff" stroke="#9cc3ff" strokeWidth="1.9" />
      <path d="M31 28h15" stroke="#1260ff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M31 38h20" stroke="#c9dcff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M31 48h13" stroke="#c9dcff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M31 58h15" stroke="#c9dcff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M55 31c-3.8 0-6.8 3-6.8 6.8s3 6.8 6.8 6.8c1.8 0 3.6-.6 4.9-1.8" fill="none" stroke="#1260ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50.6 36h8.5" stroke="#1260ff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M57.5 42l4.2-4.2 4.2 4.2" fill="none" stroke="#1260ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HowItWorksStepCard({ step }) {
  return (
    <li className="relative flex justify-center">
      <article
        className="group relative flex h-full min-h-[206px] w-full max-w-[146px] flex-col items-center rounded-[18px] border border-[#d9e8f7] bg-white px-[10px] pb-[14px] pt-[18px] text-center shadow-[0_12px_34px_rgba(15,23,42,0.06)] transition-all duration-300 motion-reduce:transform-none motion-reduce:transition-none hover:-translate-y-1.5 hover:border-[#b9d8ff] hover:shadow-[0_16px_40px_rgba(15,23,42,0.09)]"
      >
        <span className="absolute left-1/2 top-0 flex h-[28px] w-[28px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-[#1260ff] text-[12px] font-bold text-white shadow-[0_10px_22px_rgba(18,96,255,.22)]">
          {step.number}
        </span>
        <HowItWorksStepVisual type={step.type} />
        <h3 className="mt-2 text-[12px] font-extrabold leading-[1.2] tracking-[-0.04em] text-[#081B4B]">
          {step.title}
        </h3>
        <span className={`mt-1 h-[3px] w-[26px] rounded-full ${step.accent}`} aria-hidden="true" />
        <p className="mt-1 max-w-[132px] text-[8px] leading-[1.35] text-slate-500">
          {step.description}
        </p>
      </article>
    </li>
  );
}

function HowItWorksBenefit({ title, description, icon: Icon, isLast }) {
  return (
    <article className={`flex items-center gap-2.5 px-2.5 py-2.5 text-center sm:text-left lg:min-h-[92px] lg:flex-col lg:items-start lg:justify-center lg:px-4 lg:py-3 ${!isLast ? 'lg:border-r lg:border-[#dce9ff]' : ''}`}>
      <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full border border-[#cfe0ff] bg-[#eef5ff] text-[#1260ff] shadow-[0_6px_18px_rgba(18,96,255,.06)]">
        <Icon size={17} strokeWidth={2.1} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h3 className="text-[14px] font-bold leading-[1.2] text-[#081B4B]">{title}</h3>
        <p className="mt-0.5 text-[11px] leading-[1.35] text-slate-500">{description}</p>
      </div>
    </article>
  );
}

function HowItWorksSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="relative isolate overflow-hidden bg-white"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 0%, rgba(18,96,255,0.09), transparent 32%), radial-gradient(circle at 12% 18%, rgba(118,178,255,0.08), transparent 22%), radial-gradient(circle at 88% 28%, rgba(18,96,255,0.05), transparent 18%)',
      }}
    >
      <div className="relative mx-auto w-[calc(100%-24px)] max-w-[1440px] px-4 pb-[56px] pt-[56px] sm:w-[calc(100%-32px)] sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1160px] text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="hidden h-px w-[48px] bg-[#c8dcff] md:block" aria-hidden="true" />
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#1260ff] sm:text-[13px]">
              HOW IT WORKS
            </p>
            <span className="hidden h-px w-[48px] bg-[#c8dcff] md:block" aria-hidden="true" />
          </div>
          <h2
            id="how-it-works-title"
            className="mx-auto mt-3 max-w-[1100px] text-[clamp(24px,2.8vw,36px)] font-extrabold leading-[1.05] tracking-[-0.05em] text-[#081B4B] lg:whitespace-nowrap"
          >
            From Invoice to Cash in 4 Simple Steps
          </h2>
          <p className="mx-auto mt-2.5 max-w-[780px] text-[clamp(12px,1.1vw,15px)] leading-[1.45] text-slate-500">
            Digital. Automated. Fast. Get paid in as fast as 4 hours.
          </p>
        </div>

        <div className="mx-auto mt-6 flex items-center justify-center gap-3 sm:mt-7">
          <span className="hidden h-px w-[66px] bg-[#c8dcff] md:block" aria-hidden="true" />
          <div className="flex w-full max-w-[196px] items-center gap-1.5 rounded-full border border-[#cfe0ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] px-2 py-1 shadow-[0_12px_32px_rgba(18,96,255,.08)]">
            <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-[#bcd6ff] bg-white text-[#1260ff] shadow-[0_0_0_3px_rgba(18,96,255,.05)]">
              <Clock3 size={14} strokeWidth={1.9} aria-hidden="true" />
            </span>
            <div className="min-w-0 text-left leading-none">
              <p className="text-[9px] font-medium text-[#081B4B]">Average Turnaround Time</p>
              <p className="mt-0.5 text-[12px] font-extrabold tracking-[-0.05em] text-[#1260ff]">4 Hours</p>
            </div>
          </div>
          <span className="hidden h-px w-[66px] bg-[#c8dcff] md:block" aria-hidden="true" />
        </div>

        <ul className="relative mx-auto mt-6 grid gap-x-8 gap-y-8 px-3 sm:grid-cols-2 sm:px-4 lg:grid-cols-4 lg:gap-x-8 lg:px-6 xl:flex xl:flex-nowrap xl:items-center xl:gap-0 xl:px-8">
          {howItWorksSteps.map((step, index) => (
            <Fragment key={step.title}>
              <HowItWorksStepCard step={step} />
              {index < howItWorksSteps.length - 1 && (
                <li aria-hidden="true" className="hidden xl:flex xl:flex-1 xl:min-w-[40px] xl:items-center xl:justify-center xl:px-2">
                  <span className="h-px flex-1 border-t border-dashed border-[#9dc3ff]" />
                  <span className="mx-2 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#1260ff] text-white shadow-[0_10px_22px_rgba(18,96,255,.2)]">
                    <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <span className="h-px flex-1 border-t border-dashed border-[#9dc3ff]" />
                </li>
              )}
            </Fragment>
          ))}
        </ul>

        <div className="mx-auto mt-4 w-full overflow-hidden border border-[#d8e8ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] shadow-[0_14px_34px_rgba(15,23,42,0.05)] lg:min-h-[102px]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
            <article className="flex items-center gap-1.5 px-2.5 py-2.5 sm:px-3 lg:border-r lg:border-[#dce9ff] lg:px-3.5">
              <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#cfe0ff] bg-[#eef5ff] text-[#1260ff] shadow-[0_12px_28px_rgba(18,96,255,.08)]">
                <Rocket size={20} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="text-[clamp(15px,1.15vw,16px)] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#081B4B]">
                  From Invoice to Cash in <span className="text-[#1260ff]">~4 Hours</span>
                </h3>
                <p className="mt-0.5 text-[10px] leading-[1.35] text-slate-500 sm:text-[11px]">
                  No paperwork. No delays. Just faster cash flow for your business.
                </p>
              </div>
            </article>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorksBenefits.map((benefit, index) => (
                <HowItWorksBenefit
                  key={benefit.title}
                  title={benefit.title}
                  description={benefit.description}
                  icon={benefit.icon}
                  isLast={index === howItWorksBenefits.length - 1}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-center sm:mt-6">
          <ShieldCheck size={13} className="text-[#1260ff]" strokeWidth={2.1} aria-hidden="true" />
          <p className="max-w-[900px] text-[11px] font-medium leading-[1.45] text-[#081B4B] sm:text-[12px]">
            Trusted by 1000+ transporters &amp; logistics partners across India
          </p>
        </div>
      </div>
      {reduceMotion ? null : <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#e6f0ff]" />}
    </section>
  );
}

function WhatIsEasyLaneSection() {
  return (
    <section className="mx-auto mt-8 mb-16 w-[calc(100%-20px)] max-w-[1520px] sm:mt-10 sm:mb-20 sm:w-[calc(100%-32px)] lg:w-[calc(100%-32px)]">
      <div className="relative overflow-hidden rounded-[30px] border border-[#dce8fa] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] px-4 py-5 shadow-[0_18px_55px_rgba(15,42,85,.10)] sm:px-6 sm:py-6 lg:px-12 lg:py-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-6%] top-[12%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(18,96,255,.12),transparent_68%)] blur-3xl" />
          <div className="absolute right-[12%] top-[34%] h-[16rem] w-[16rem] rounded-full bg-[radial-gradient(circle,rgba(18,96,255,.05),transparent_72%)]" />
          <div className="absolute inset-0 opacity-[0.055] [background-image:radial-gradient(circle_at_1px_1px,rgba(18,96,255,.7)_1px,transparent_0)] [background-size:24px_24px]" />
        </div>

        <div className="relative grid min-h-[470px] items-start gap-6 lg:gap-8 xl:grid-cols-[minmax(0,.92fr)_1px_minmax(0,1.08fr)] xl:items-start xl:gap-12">
          <div className="mx-auto max-w-[600px] self-start xl:mx-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#1260ff] sm:text-[11px]">
              WHAT IS EASY LANE?
            </p>
            <span className="mt-4 block h-[3px] w-[62px] rounded-full bg-[#1260ff]" />
            <h2 className="mt-4 max-w-[560px] text-[22px] font-extrabold leading-[1.08] tracking-[-0.05em] text-slate-900 sm:mt-5 sm:text-[27px] lg:text-[30px]">
              Your all-in-one logistics
              <br />
              operating system.
            </h2>
            <p className="mt-3 max-w-[560px] text-[11px] leading-[1.56] text-slate-500 sm:text-[12px] lg:text-[13px]">
              Easy Lane helps transport businesses run smarter with TMS operations, bill discounting, invoicing, vendors, drivers, and admin workflows—all from one connected platform.
            </p>
            <Button
              href="/platform"
              className="mt-5 inline-flex h-[42px] w-full max-w-[160px] items-center justify-center rounded-[12px] bg-[#1260ff] px-4.5 text-[12px] font-bold text-[#081B4B] shadow-[0_12px_26px_rgba(18,96,255,.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(18,96,255,.22)] sm:h-[44px] sm:w-auto sm:max-w-none sm:px-5 sm:text-[13px]"
            >
              Explore Platform
            </Button>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-4 lg:divide-x lg:divide-[#d8e8ff]">
              {whatIsEasyLaneMiniBenefits.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="group flex min-h-[72px] items-start gap-2.5 rounded-[16px] bg-white/60 px-0 py-0 shadow-[0_8px_20px_rgba(15,23,42,.05)] transition duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_14px_28px_rgba(15,23,42,.08)] sm:px-3 sm:py-1.5">
                    <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full border border-[#dbe7f5] bg-[#edf4ff] text-[#1260ff] shadow-[0_6px_16px_rgba(18,96,255,.08)] transition duration-300 group-hover:border-[#bfd7fb] group-hover:bg-[#e8f1ff] group-hover:shadow-[0_10px_22px_rgba(18,96,255,.14)]">
                      <Icon size={15} strokeWidth={2.1} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold leading-[1.2] tracking-[-0.03em] text-[#081B4B] transition duration-300 group-hover:text-[#1260ff]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[10px] leading-[1.35] text-slate-500 transition duration-300 group-hover:text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <span aria-hidden="true" className="hidden self-stretch border-l border-dashed border-[#c7dcf8] xl:block" />

          <div className="relative flex min-h-[320px] items-center justify-center self-start pt-2 sm:min-h-[380px] lg:min-h-[440px] xl:block xl:min-h-[470px] xl:pt-0">
            <img
              src={whatIsEasyLaneImage}
              alt="Easy Lane platform illustration"
              className="mx-auto h-auto w-full max-w-[400px] rounded-[22px] border border-[#dbe7f5] object-contain shadow-[0_16px_40px_rgba(15,23,42,.10)] sm:max-w-[460px] lg:max-w-[500px] xl:max-w-[480px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


function WhatIsEasyLaneConnectors({ reduceMotion }) {
  return (
    <svg
      className={`what-is-easy-lane__connectors${reduceMotion ? ' is-reduced-motion' : ''}`}
      viewBox="0 0 760 520"
      aria-hidden="true"
    >
      <defs>
        <filter id="what-is-easy-lane-line-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.2 0 0 0 0 0.56 0 0 0 0 0.96 0 0 0 0.34 0" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {[
        'M 258 81 C 304 81, 308 113, 286 138 C 262 165, 246 170, 230 170',
        'M 258 251 C 316 251, 314 251, 230 251',
        'M 258 421 C 304 421, 308 389, 286 364 C 262 337, 246 332, 230 330',
        'M 502 81 C 456 81, 452 113, 474 138 C 498 165, 514 170, 530 170',
        'M 502 251 C 444 251, 446 251, 530 251',
        'M 502 421 C 456 421, 452 389, 474 364 C 498 337, 514 332, 530 330',
      ].map((d) => <path key={d} d={d} className="what-is-easy-lane__connector" filter="url(#what-is-easy-lane-line-glow)" />)}
      {[
        { cx: 258, cy: 81 },
        { cx: 258, cy: 251 },
        { cx: 258, cy: 421 },
        { cx: 502, cy: 81 },
        { cx: 502, cy: 251 },
        { cx: 502, cy: 421 },
        { cx: 230, cy: 170 },
        { cx: 230, cy: 251 },
        { cx: 230, cy: 330 },
        { cx: 530, cy: 170 },
        { cx: 530, cy: 251 },
        { cx: 530, cy: 330 },
      ].map((dot) => <circle key={`${dot.cx}-${dot.cy}`} cx={dot.cx} cy={dot.cy} r="3.4" className="what-is-easy-lane__connector-dot" />)}
    </svg>
  );
}

function TrustedLogos({ settings }) {
  const normalise = (value = {}) => ({ enabled: typeof value.enabled === 'boolean' ? value.enabled : true, animationEnabled: typeof value.animationEnabled === 'boolean' ? value.animationEnabled : true, animationSpeed: ['slow', 'normal', 'fast'].includes(value.animationSpeed) ? value.animationSpeed : 'normal' });
  const [options, setOptions] = useState(() => normalise(settings));
  useEffect(() => { let active = true; api('/settings/public').then((result) => { if (active) setOptions(normalise(result.trustedLogos)); }).catch(() => {}); return () => { active = false; }; }, []);
  const enabled = options.enabled === true;
  const animationEnabled = options.animationEnabled === true;
  const speed = options.animationSpeed;
  const logos = [
    ['Trusted logo 1', i1], ['Trusted logo 2', i2], ['Trusted logo 3', i3], ['Trusted logo 4', i4],
    ['Trusted logo 6', i6], ['Trusted logo 7', i7], ['Trusted logo 8', i8],
  ];
  if (!enabled) return null;
  const group = (hidden = false) => <div className="trusted-logos__group" aria-hidden={hidden || undefined}>{logos.map(([name, src]) => <span key={name} className="trusted-logos__logo" style={{ width: 156, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={src} alt={hidden ? '' : name} style={{ position: 'static', inset: 'auto', width: '100%', height: '100%', objectFit: 'contain' }} /></span>)}</div>;
  return <section className="trusted-logos" aria-label="Trusted by forward-thinking businesses"><p>Trusted by forward-thinking businesses</p>{animationEnabled ? <><div className="trusted-logos__viewport"><div className={`trusted-logos__track trusted-logos__track--${speed}`}>{group(false)}{group(true)}</div></div><div className="trusted-logos__reduced">{group(false)}</div></> : <div className="trusted-logos__static">{group(false)}</div>}</section>;
}

const Home = () => {
  const [content, setContent] = useState(null);
  useEffect(() => { api('/content').then(setContent).catch(() => {}); }, []);
  const cta = content?.cta;
  const platformRailRef = useRef(null);
  const scrollPlatformCards = (direction) => platformRailRef.current?.scrollBy({ left: direction * 280, behavior: 'smooth' });
  return <div className="overflow-x-clip bg-white text-slate-900"><Hero /><main>
  <TrustedLogos settings={content?.trustedLogos} />
  <WhatIsEasyLaneSection />
  <div className="platform-showcase">
    <section className="platform-ecosystem lg:!mt-[-4.5rem]"><div className="flex items-start justify-between gap-4"><SectionTitle eyebrow="PLATFORM ECOSYSTEM" title="Dedicated Experience for Every Stakeholder" /><div className="flex shrink-0 gap-2 pt-1"><button type="button" onClick={() => scrollPlatformCards(-1)} aria-label="Previous platform" className="grid h-8 w-8 place-items-center rounded-full border border-slate-100 bg-white text-[#1260ff] shadow-[0_3px_10px_rgba(15,23,42,.08)]"><ChevronLeft size={15} /></button><button type="button" onClick={() => scrollPlatformCards(1)} aria-label="Next platform" className="grid h-8 w-8 place-items-center rounded-full border border-slate-100 bg-white text-[#1260ff] shadow-[0_3px_10px_rgba(15,23,42,.08)]"><ChevronRight size={15} /></button></div></div><div ref={platformRailRef} className="mt-7 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:mx-auto lg:w-[min(100%,1284px)] lg:grid-cols-[repeat(4,300px)] lg:justify-between lg:gap-7">{platforms.map((item) => <PlatformCard key={item[0]} item={item} />)}</div></section>
  </div>
  <section id="services" className="mx-auto grid w-[calc(100%-32px)] max-w-[90rem] gap-10 py-14 max-sm:w-[calc(100%-28px)] lg:grid-cols-[35fr_65fr] lg:items-center lg:gap-12 xl:gap-16"><div><span className="inline-flex items-center gap-2 rounded-full bg-[#eaf2ff] px-3.5 py-1.5 text-[11px] font-bold tracking-[.02em] text-[#1260ff]"><ReceiptIndianRupee size={15} /> BILL DISCOUNTING</span><h2 className="mt-5 text-[34px] font-bold leading-[1.12] tracking-[-.05em] text-slate-900 sm:text-[42px] lg:whitespace-nowrap xl:text-[48px]">Faster Payments.<br />Stronger <span className="text-[#1260ff]">Cash Flow.</span></h2><p className="mt-5 max-w-[27rem] text-[14px] leading-[1.75] text-slate-500">Convert your approved invoices into instant working capital and keep your operations moving without cash flow delays.</p><div className="mt-9 grid grid-cols-3">{[['Instant Liquidity', 'Get funds in as fast as 24 Hours', Zap],['Risk Protected', 'Credit assessment & fraud protected', ShieldCheck],['Flexible & Simple', 'Minimal docs. Maximum flexibility.', Radar]].map(([text, note, Icon], index) => <div key={text} className={`min-w-0 px-5 first:pl-0 ${index < 2 ? 'border-r border-slate-200' : 'pr-0'}`}><span className="grid h-11 w-11 place-items-center rounded-full bg-[#edf4ff] text-[#1260ff]"><Icon size={22}/></span><p className="mt-3 text-[13px] font-bold leading-tight text-slate-800">{text}</p><p className="mt-2 max-w-[7rem] text-[10px] leading-[1.5] text-slate-500">{note}</p></div>)}</div></div><motion.div {...fadeUp} className="rounded-[28px] bg-[#eef5ff] p-5 shadow-[0_15px_40px_rgba(35,97,190,.06)] sm:p-7 lg:p-8"><div className="grid gap-5 lg:grid-cols-[154px_70px_166px_minmax(120px,1fr)] lg:items-center xl:grid-cols-[168px_76px_180px_minmax(135px,1fr)]"><div className="relative h-[205px] rounded-[13px] bg-white p-5 shadow-[0_13px_28px_rgba(15,23,42,.13)] sm:h-[220px] sm:p-6"><span className="absolute right-0 top-0 h-0 w-0 border-b-[24px] border-l-[24px] border-b-transparent border-l-[#eef5ff]" /><p className="text-[13px] font-extrabold text-slate-800">INVOICE</p><p className="mt-1.5 text-[10px] text-slate-400">#INV-2024-0876</p><div className="mt-5 space-y-2"><span className="block h-2 w-4/5 rounded bg-slate-100" /><span className="block h-2 w-3/5 rounded bg-slate-100" /></div><p className="mt-5 text-[10px] text-slate-400">Invoice Amount</p><p className="text-[19px] font-extrabold text-slate-900">₹12,50,000</p><span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-600">● Approved</span></div><div className="flex items-center justify-center gap-1.5 text-[#1260ff]"><span className="h-px w-5 border-t-2 border-dotted border-[#1260ff]" /><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1260ff] text-lg font-bold text-white shadow-lg">₹</span><span className="h-px w-5 border-t-2 border-dotted border-[#1260ff]" /></div><div className="h-[205px] rounded-[13px] bg-[#041333] p-5 text-white shadow-[0_15px_30px_rgba(4,19,51,.34)] sm:h-[220px] sm:p-6"><p className="text-[10px] font-bold text-white/55">FUNDS RECEIVED</p><p className="mt-3 text-[24px] font-extrabold">₹12,50,000</p><span className="mt-3 inline-block rounded bg-[#1260ff] px-2.5 py-1.5 text-[9px] font-bold">100% Invoice Value</span><p className="mt-5 border-t border-white/10 pt-4 text-[10px] font-bold leading-4 text-white"><span className="mr-1.5 text-base text-[#ffe800]">⚡</span> In as fast as<br className="hidden xl:block" /> 24 Hours</p></div><div className="grid grid-cols-2 gap-x-5 gap-y-5 lg:grid-cols-1 lg:gap-y-5"><FinanceFeature icon={ShieldCheck} title="No Collateral Required" /><FinanceFeature icon={Clock3} title="Fast Turnaround" /><FinanceFeature icon={CircleDollarSign} title="Competitive Rates" /><FinanceFeature icon={FileCheck2} title="Transparent Process" /></div></div><div className="mt-6 flex min-h-[82px] items-center justify-between gap-3 rounded-[13px] border border-slate-100 bg-white px-5 py-4 shadow-[0_6px_16px_rgba(15,23,42,.06)] sm:min-h-[94px] sm:px-7"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#edf4ff] text-[#1260ff]"><BarChart3 size={25}/></span><div className="mr-auto ml-1 sm:ml-3"><p className="text-[10px] text-slate-500 sm:text-[11px]">Receive ₹12,50,000</p><p className="text-[21px] font-extrabold leading-tight text-[#1260ff] sm:text-[24px]">100% Invoice Value <span className="block text-[9px] font-medium text-slate-500 sm:inline sm:text-[10px]">vs traditional financing</span></p></div><svg aria-hidden="true" viewBox="0 0 70 34" className="h-12 w-[98px] shrink-0 sm:h-14 sm:w-[118px]"><path d="M2 27L17 24 31 26 45 16 57 19 67 4" fill="none" stroke="#bfd3ff" strokeWidth="1.5"/><path d="M64 4h4v4" fill="none" stroke="#1260ff" strokeWidth="1.5"/><rect x="4" y="24" width="6" height="7" rx="1" fill="#dce8ff"/><rect x="17" y="20" width="6" height="11" rx="1" fill="#bdd4ff"/><rect x="30" y="17" width="6" height="14" rx="1" fill="#8fb4ff"/><rect x="43" y="11" width="6" height="20" rx="1" fill="#1260ff"/><rect x="56" y="4" width="7" height="27" rx="1" fill="#ffe800"/></svg></div></motion.div></section>
    <HowItWorksSection />
    <SevenPillars />
  <section className="control-tower-section border-t border-white/20 bg-[#020d2b] px-5 pb-12 pt-8 text-white sm:px-8"><div className="mx-auto max-w-6xl"><div className="grid gap-7 lg:grid-cols-[.3fr_.7fr] lg:items-center"><div><SectionTitle eyebrow="CONTROL TOWER" title={<>Your Logistics<br />Command Center</>} description={<>Monitor your entire logistics network in real-time.<br />Detect delays, manage exceptions and take<br />faster decisions.</>} /><a href="#contact" className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-[#ffe800] px-4 text-xs font-bold text-[#041333] shadow-[0_8px_18px_rgba(255,232,0,.16)]">Explore Control Tower <ArrowRight size={13}/></a></div><div className="w-full"><ControlTowerMap /></div></div></div></section>
  <section className="bg-white px-5 py-12 sm:px-8"><div className="mx-auto grid max-w-6xl gap-9 lg:grid-cols-2 lg:gap-0"><div className="lg:pr-10"><SectionTitle eyebrow="INDUSTRY SOLUTIONS" title="Solutions for Every Industry" /><div className="mt-7 grid grid-cols-3 gap-x-3 gap-y-6 lg:grid-cols-6 lg:gap-x-2">{[['FMCG', Package],['Retail', ShoppingCart],['Manufacturing', Factory],['Pharma', Pill],['Cold Chain', Snowflake],['3PL & Aggregators', Waypoints]].map(([text,Icon]) => <div key={text} className="min-w-0 text-center"><Icon className="mx-auto mb-2 text-slate-700" size={19}/><p className="text-[9px] font-semibold leading-3 text-slate-600">{text}</p></div>)}</div></div><div className="border-t border-slate-100 pt-9 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"><SectionTitle eyebrow="TRUSTED BY LEADING BUSINESSES" title="Driving Real Business Results" /><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{[['23%','Reduction in\nOperational Delays'],['18%','Fuel Cost\nSavings'],['40%','Faster Invoice\nProcessing'],['99.9%','Tracking\nUptime']].map(([num,label]) => <div key={num} className="flex min-h-[78px] flex-col items-center justify-center rounded-lg border border-slate-100 bg-white p-2.5 text-center shadow-[0_4px_12px_rgba(15,23,42,.045)]"><strong className="text-[20px] font-extrabold tracking-[-.04em] text-slate-800">{num}</strong><p className="mt-1 whitespace-pre-line text-[8px] leading-3 text-slate-500">{label}</p></div>)}</div></div></div></section>
  <section id="contact" className="border-y border-white/15 bg-gradient-to-r from-[#124dff] to-[#0744e7] px-5 py-5 text-white md:py-[17px] lg:py-4"><div className="mx-auto flex max-w-6xl flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left"><div><h2 className="text-xl font-bold">{cta?.title || 'Ready to Transform Your Logistics Operations?'}</h2><p className="mt-1 text-xs text-white/80">{cta?.description || 'Join hundreds of businesses moving smarter, faster and better with Easy Lane.'}</p></div><div className="flex justify-center gap-2.5"><Button href="/book-demo" className="h-10 px-4 text-[14px] md:h-[42px] md:px-5 md:text-[15px] lg:h-11 lg:px-6 lg:text-base">Book a Demo</Button><Button href="/book-demo" variant="secondary" className="h-10 px-4 text-[14px] md:h-[42px] md:px-5 md:text-[15px] lg:h-11 lg:px-6 lg:text-base">Talk to Sales</Button></div></div></section>
</main></div>;
};

export default Home;
