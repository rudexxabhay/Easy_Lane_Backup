import { useEffect, useRef, useState } from 'react';
import {
  Bot, ChevronDown, FilePenLine, LayoutDashboard, Link2, LogOut, MessageSquare,
  Mail, Menu, Share2, UserRound, UsersRound, X,
} from 'lucide-react';
import logo from '../../assets/logo.png';
import { navigate, usePathname } from '../../lib/router.js';

const adminNavigation = [
  { label: 'Dashboard', items: [{ label: 'Overview', path: '/admin', icon: LayoutDashboard }] },
  { label: 'Lead Management', items: [{ label: 'Leads', path: '/admin/leads', icon: UsersRound }, { label: 'Contact Leads', path: '/admin/contact-leads', icon: Mail }] },
  { label: 'Website Management', items: [{ label: 'Website Content', path: '/admin/website-content', icon: FilePenLine }, { label: 'AI Knowledge Base', path: '/admin/ai-knowledge-base', icon: Bot }, { label: 'AI Conversations', path: '/admin/ai-conversations', icon: MessageSquare }, { label: 'Social Links', path: '/admin/social-links', icon: Share2 }, { label: 'Navigation Links', path: '/admin/navigation-links', icon: Link2 }] },
  { label: 'Account', items: [{ label: 'Profile', path: '/admin/profile', icon: UserRound }] },
];

export default function AdminLayout({ title, admin, onLogout, children }) {
  const path = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const close = (event) => { if (!profileRef.current?.contains(event.target)) setProfileOpen(false); };
    const escape = (event) => { if (event.key === 'Escape') { setProfileOpen(false); setSidebarOpen(false); } };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', escape); };
  }, []);

  const go = (nextPath) => { navigate(nextPath); setSidebarOpen(false); };
  const sidebar = <aside aria-label="Admin navigation" className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col overflow-y-auto border-r border-white/10 bg-[#041533] text-white shadow-2xl transition-transform duration-200 lg:translate-x-0 lg:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex min-h-[92px] items-center border-b border-white/10 px-5"><img src={logo} alt="Easy Lane" className="h-[52px] w-auto object-contain" /><div className="ml-3 border-l border-white/15 pl-3"><p className="text-[11px] font-semibold tracking-wide text-white/65">Admin Panel</p></div><button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" className="ml-auto rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden"><X size={20} /></button></div><nav className="flex-1 space-y-6 px-3 py-6">{adminNavigation.map((group) => <div key={group.label}><p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.14em] text-white/35">{group.label}</p><div className="space-y-1">{group.items.map((item) => { const Icon = item.icon; const active = path === item.path || (item.path === '/admin/leads' && path === '/admin/demo-bookings'); return <button key={item.path} type="button" onClick={() => go(item.path)} aria-current={active ? 'page' : undefined} className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[13px] font-semibold transition ${active ? 'bg-[#1260ff] text-white shadow-[0_6px_18px_rgba(18,96,255,.25)]' : 'text-white/65 hover:bg-white/[.07] hover:text-white'}`}><Icon size={17} />{item.label}</button>; })}</div></div>)}</nav></aside>;

  return <div className="min-h-screen overflow-x-hidden bg-slate-100 text-slate-900">{sidebar}{sidebarOpen && <button type="button" aria-label="Close sidebar backdrop" className="fixed inset-0 z-40 bg-slate-950/55 lg:hidden" onClick={() => setSidebarOpen(false)} />}<div className="min-w-0 lg:pl-[250px]"><header className="sticky top-0 z-30 flex h-[68px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6"><button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" className="mr-3 rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden"><Menu size={20} /></button><div><p className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:block">Easy Lane Admin</p><h1 className="text-lg font-extrabold text-slate-900">{title}</h1></div><div ref={profileRef} className="relative ml-auto"><button type="button" onClick={() => setProfileOpen((open) => !open)} aria-haspopup="menu" aria-expanded={profileOpen} className="flex items-center gap-2 rounded-[10px] px-2 py-1.5 hover:bg-slate-50"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#eaf2ff] text-sm font-extrabold text-[#1260ff]">A</span><span className="hidden text-left sm:block"><strong className="block text-xs text-slate-800">Admin</strong><small className="block max-w-28 truncate text-[10px] text-slate-400">{admin?.id || 'Administrator'}</small></span><ChevronDown size={14} className="text-slate-400" /></button>{profileOpen && <div role="menu" className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-100 bg-white p-1.5 shadow-[0_14px_35px_rgba(15,23,42,.15)]"><button role="menuitem" type="button" onClick={() => { go('/admin/profile'); setProfileOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"><UserRound size={16} /> My Profile</button><div className="my-1 border-t border-slate-100" /><button role="menuitem" type="button" onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"><LogOut size={16} /> Sign Out</button></div>}</div></header><main className="min-w-0 p-4 sm:p-6 lg:p-7"><div className="mx-auto max-w-[1440px]">{children}</div></main></div></div>;
}
