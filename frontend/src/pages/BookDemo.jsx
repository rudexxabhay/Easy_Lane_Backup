import { useState } from 'react';
import { CheckCircle2, ShieldCheck, Sparkles, TimerReset } from 'lucide-react';
import { api } from '../lib/api.js';

const initialForm = { name: '', email: '', phone: '', company: '', jobTitle: '', fleetSize: '', module: '', message: '' };
const modules = ['TMS', 'Fleet Management', 'Control Tower', 'Live Tracking', 'Bill Discounting', 'Complete Platform', 'Other'];

export default function BookDemo() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [state, setState] = useState({ loading: false, error: '', bookingId: '' });
  const update = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: '' }));
  };
  const validate = () => {
    const errors = {};
    if (form.name.trim().length < 2) errors.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid work email.';
    if (!/^[+]?[-\d\s()]{7,30}$/.test(form.phone)) errors.phone = 'Please enter a valid phone number.';
    if (!form.company.trim()) errors.company = 'Please enter your company name.';
    if (!form.fleetSize) errors.fleetSize = 'Please select a company size.';
    if (!form.module) errors.module = 'Please select an interested module.';
    return errors;
  };
  const submit = async (event) => {
    event.preventDefault();
    if (state.loading) return;
    const errors = validate();
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    setState({ loading: true, error: '', bookingId: '' });
    const details = [form.jobTitle && `Job title: ${form.jobTitle}`, `Interested module: ${form.module}`, form.message].filter(Boolean).join('\n');
    try {
      const result = await api('/leads', { method: 'POST', body: { name: form.name, email: form.email, phone: form.phone, company: form.company, fleetSize: form.fleetSize, message: details } });
      setState({ loading: false, error: '', bookingId: result.bookingId });
    } catch (error) {
      setState({ loading: false, error: error.message, bookingId: '' });
    }
  };
  const fieldClass = 'mt-1.5 w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-blue-100';
  const FieldError = ({ name }) => fieldErrors[name] ? <span id={`${name}-error`} className="mt-1 text-xs font-medium text-red-600">{fieldErrors[name]}</span> : null;

  return <div className="bg-white px-5 pb-20 pt-[clamp(6rem,8vw,8rem)] sm:px-8 sm:pb-24"><section className="site-container"><div className="grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16"><div className="pt-3"><p className="text-[11px] font-bold tracking-[.12em] text-[#1260ff]">BOOK A DEMO</p><h1 className="mt-4 text-[clamp(2.375rem,2rem+1.25vw,4rem)] font-extrabold leading-[1.08] tracking-[-.05em] text-[#071837]">See Easy Lane<br />in Action</h1><p className="mt-5 max-w-md text-sm leading-7 text-slate-600">Tell us about your logistics operations and our team will arrange a tailored walkthrough of the platform.</p><div className="mt-9 space-y-5">{[[Sparkles, 'A walkthrough tailored to your workflows'], [TimerReset, 'A focused session with our logistics team'], [ShieldCheck, 'No obligation and no hidden commitment']].map(([Icon, text]) => <div key={text} className="flex items-center gap-3 text-sm font-semibold text-slate-700"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#edf4ff] text-[#1260ff]"><Icon size={19} /></span>{text}</div>)}</div></div><div className="rounded-[24px] border border-blue-100 bg-[#f1f6ff] p-5 shadow-[0_18px_48px_rgba(18,96,255,.09)] sm:p-8">{state.bookingId ? <div role="status" className="flex min-h-[480px] flex-col items-center justify-center text-center"><CheckCircle2 className="h-14 w-14 text-emerald-500" /><h2 className="mt-5 text-3xl font-extrabold text-[#071837]">Demo request received</h2><p className="mt-3 max-w-md text-sm leading-6 text-slate-600">Thank you. Our team will be in touch shortly. Keep this booking ID for your records.</p><p className="mt-5 rounded-xl bg-white px-5 py-3 font-bold text-[#1260ff] shadow-sm">{state.bookingId}</p></div> : <form noValidate className="grid gap-5 sm:grid-cols-2" onSubmit={submit}><label className="text-sm font-semibold text-slate-700">Full Name *<input name="name" autoComplete="name" value={form.name} onChange={update} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'name-error' : undefined} className={fieldClass} /><FieldError name="name" /></label><label className="text-sm font-semibold text-slate-700">Work Email *<input name="email" type="email" autoComplete="email" value={form.email} onChange={update} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'email-error' : undefined} className={fieldClass} /><FieldError name="email" /></label><label className="text-sm font-semibold text-slate-700">Phone Number *<input name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={update} aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? 'phone-error' : undefined} className={fieldClass} /><FieldError name="phone" /></label><label className="text-sm font-semibold text-slate-700">Company Name *<input name="company" autoComplete="organization" value={form.company} onChange={update} aria-invalid={Boolean(fieldErrors.company)} aria-describedby={fieldErrors.company ? 'company-error' : undefined} className={fieldClass} /><FieldError name="company" /></label><label className="text-sm font-semibold text-slate-700">Job Title<input name="jobTitle" autoComplete="organization-title" value={form.jobTitle} onChange={update} className={fieldClass} /></label><label className="text-sm font-semibold text-slate-700">Company Size / Monthly Spend *<select name="fleetSize" value={form.fleetSize} onChange={update} aria-invalid={Boolean(fieldErrors.fleetSize)} aria-describedby={fieldErrors.fleetSize ? 'fleetSize-error' : undefined} className={fieldClass}><option value="">Select an option</option><option>1–25 vehicles</option><option>26–100 vehicles</option><option>101–500 vehicles</option><option>500+ vehicles</option><option>Monthly spend below ₹10L</option><option>Monthly spend above ₹10L</option></select><FieldError name="fleetSize" /></label><label className="text-sm font-semibold text-slate-700 sm:col-span-2">Interested Module *<select name="module" value={form.module} onChange={update} aria-invalid={Boolean(fieldErrors.module)} aria-describedby={fieldErrors.module ? 'module-error' : undefined} className={fieldClass}><option value="">Select a module</option>{modules.map((item) => <option key={item}>{item}</option>)}</select><FieldError name="module" /></label><label className="text-sm font-semibold text-slate-700 sm:col-span-2">Message / Requirement<textarea name="message" value={form.message} onChange={update} rows="4" maxLength="2800" className={`${fieldClass} resize-y`} /></label>{state.error && <p role="alert" className="sm:col-span-2 rounded-[10px] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}<button type="submit" disabled={state.loading} className="sm:col-span-2 inline-flex min-h-12 items-center justify-center rounded-[8px] bg-[#ffe800] px-6 text-sm font-extrabold text-[#071837] transition hover:bg-[#ffdc00] disabled:cursor-not-allowed disabled:opacity-60">{state.loading ? 'Booking your demo…' : 'Book My Demo →'}</button></form>}</div></div></section></div>;
}
