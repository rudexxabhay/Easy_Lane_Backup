import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { api } from '../lib/api.js';

const columns = {
  Platform: [
    { label: 'TMS', url: '/platform/tms' },
    { label: 'Fleet Management', url: '/platform/fleet-management' },
    { label: 'Control Tower', url: '/platform/control-tower' },
    { label: 'Live Tracking', url: '/platform/live-tracking' },
  ],
  Features: [
    { label: 'Maintenance', url: '/platform/maintenance' },
    { label: 'Fuel Management', url: '/platform/fuel-management' },
    { label: 'Tyre Management', url: '/platform/tyre-management' },
    { label: 'Driver Management', url: '/platform/driver-management' },
    { label: 'Compliance', url: '/platform/compliance' },
  ],
  Finance: [
    { label: 'Bill Discounting', url: '/platform/bill-discounting' },
    { label: 'Vendor Payments', url: '/platform/vendor-payments' },
    { label: 'Invoice Management', url: '/platform/invoice-management' },
  ],
  Resources: ['Blogs', 'Case Studies', 'Videos', 'Guides'],
  Company: [
    { label: 'About Us', url: '/about-us' },
    { label: 'Careers', url: '/careers' },
    { label: 'Contact Us', url: '/contact-us' },
    { label: 'Privacy Policy', url: '/privacy-policy' },
  ],
};

const socialLinks = [
  ['linkedin', 'LinkedIn', <svg key="linkedin" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.3V18M6.5 5.3v.1M10.5 18v-5.4c0-2.7 4.8-3 4.8.2V18M10.5 9.8V18" /></svg>],
  ['facebook', 'Facebook', <svg key="facebook" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 7.2h2V4.3h-2.4c-2.8 0-4.1 1.7-4.1 4.4v1.6H7.5v3H10V20h3.2v-6.7h2.7l.5-3h-3.2V8.9c0-1.1.4-1.7 1.3-1.7Z" /></svg>],
  ['youtube', 'YouTube', <svg key="youtube" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12c0 2-.2 4.1-.8 4.8-.7.8-4.4.9-7.2.9s-6.5-.1-7.2-.9C4.2 16.1 4 14 4 12s.2-4.1.8-4.8c.7-.8 4.4-.9 7.2-.9s6.5.1 7.2.9c.6.7.8 2.8.8 4.8Z" /><path d="m10.3 9.5 4.1 2.5-4.1 2.5Z" /></svg>],
  ['twitter', 'X', <svg key="x" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 5 12 14M18 5 6 19" /></svg>],
];

const validSocialUrl = (value) => {
  try {
    const url = new URL(String(value || '').trim());
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};

export default function Footer() {
  const [links, setLinks] = useState({ linkedin: '', facebook: '', youtube: '', twitter: '' });
  const [managedFooterLinks, setManagedFooterLinks] = useState([]);
  useEffect(() => { api('/settings/public').then((result) => { setLinks(result.socialLinks || {}); setManagedFooterLinks((result.navigationLinks || []).filter((link) => link.location === 'footer')); }).catch(() => {}); }, []);
  const routeMap = {
    tms: '/platform/tms',
    'fleet management': '/platform/fleet-management',
    'control tower': '/platform/control-tower',
    'live tracking': '/platform/live-tracking',
    maintenance: '/platform/maintenance',
    'fuel management': '/platform/fuel-management',
    'tyre management': '/platform/tyre-management',
    'driver management': '/platform/driver-management',
    compliance: '/platform/compliance',
    'bill discounting': '/platform/bill-discounting',
    'vendor payments': '/platform/vendor-payments',
    'invoice management': '/platform/invoice-management',
    'about us': '/about-us',
    careers: '/careers',
    'contact us': '/contact-us',
    'privacy policy': '/privacy-policy',
  };
  const resolveUrl = (label, url = '') => routeMap[String(label || '').trim().toLowerCase()] || url || '/';
  const normalizeItem = (item) => (typeof item === 'string'
    ? { label: item, url: resolveUrl(item), newTab: false }
    : { ...item, url: resolveUrl(item.label, item.url), newTab: item.newTab === true });
  const footerColumns = managedFooterLinks.length
    ? managedFooterLinks.reduce((groups, item) => ({
      ...groups,
      [item.group || 'Links']: [...(groups[item.group || 'Links'] || []), normalizeItem(item)],
    }), {})
    : Object.fromEntries(Object.entries(columns).map(([title, items]) => [title, items.map(normalizeItem)]));
  return <footer id="about" className="w-full border-t-2 border-[#0b54db] bg-[#041533] text-white"><div className="mx-auto w-[min(calc(100%-2rem),108rem)] px-3 pb-4 pt-8 sm:w-[min(calc(100%-3rem),108rem)] sm:px-0 sm:pb-5 sm:pt-9 lg:w-[min(calc(100%-6rem),108rem)]"><div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.55fr_repeat(5,1fr)] lg:gap-x-12 xl:gap-x-20"><div><img src={logo} alt="Easy Lane" className="h-[72px] w-[112px] object-contain object-left" /><p className="mt-4 max-w-[220px] text-[11px] leading-[1.55] text-white/65">An intelligent logistics platform built to move businesses forward.</p><div className="mt-4 flex min-h-8 items-center gap-3">{socialLinks.map(([key, label, icon]) => { const href = validSocialUrl(links[key]); const className = "grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-[#061a3d] text-white/85 transition-colors [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:stroke-[1.8]"; return href ? <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`${className} hover:border-white/40 hover:text-white`}>{icon}</a> : <span key={key} aria-label={`${label} (link unavailable)`} aria-disabled="true" role="link" className={`${className} cursor-not-allowed opacity-50`}>{icon}</span>; })}</div></div>{Object.entries(footerColumns).slice(0, 5).map(([title, items]) => <nav key={title} aria-label={title}><h3 className="text-[13px] font-semibold text-white">{title}</h3><ul className="mt-4 space-y-2.5 text-[11px] leading-[1.25] text-white/65">{items.map((item) => <li key={item._id || `${title}-${item.label}`}><a href={item.url} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noopener noreferrer' : undefined} className="transition-colors hover:text-white">{item.label}</a></li>)}</ul></nav>)}</div><div className="mt-7 flex flex-col gap-2.5 border-t border-white/15 pt-4 text-[10px] text-white/55 sm:flex-row sm:items-center sm:justify-between"><span>© 2025 Easy Lane Logistics. All rights reserved.</span><span>Made with 💙 for the logistics world.</span></div></div></footer>;
}
