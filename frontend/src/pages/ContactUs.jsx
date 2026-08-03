import {
  Clock3,
  Globe,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button.jsx';
import { api } from '../lib/api.js';

const contactMethods = [
  { icon: Phone, title: 'Call Us', value: '+91 98956 25800', meta: 'Mon - Sat, 9:00 AM - 7:00 PM' },
  { icon: Mail, title: 'Email Us', value: 'hello@easylane.co.in', meta: 'We reply within 24 hours' },
  { icon: MapPin, title: 'Visit Us', value: 'Easy Lane Logistics Solutions Pvt. Ltd.', meta: 'A21, Sector 62, Noida, UP' },
  { icon: UsersRound, title: 'Support', value: '9936526750', meta: 'support@easylane.co.in' },
];

const trustItems = [
  { icon: Clock3, title: 'Business Hours', description: 'Mon - Sat, 9:00 AM - 7:00 PM\nSunday: Closed' },
  { icon: Globe, title: 'Pan India Presence', description: 'Serving 1000+ locations\nacross India' },
  { icon: ShieldCheck, title: 'Secure & Reliable', description: 'Your data and privacy\nare our priority' },
];

function HeroCopy() {
  return (
    <div className="w-full max-w-none">
      <p className="mb-4 inline-flex h-9 items-center rounded-full bg-[#eef6ff] px-4 text-[11px] font-bold tracking-[0.08em] text-[#1260ff]">
        CONTACT US
      </p>
      <h1 className="max-w-none text-[clamp(26px,2.8vw,38px)] font-extrabold leading-[1.02] tracking-[-.065em] text-[#081837]">
        <span className="block">Get in Touch</span>
        <span className="block text-[#1260ff]">We&apos;re Here to Help!</span>
      </h1>
      <div className="mt-4 h-[3px] w-[60px] rounded-full bg-[#1260ff]" />
      <p className="mt-5 max-w-none text-[15px] leading-[1.7] text-[#5b677f] sm:text-[16px]">
        Have questions, need support, or want to learn more about Easy Lane? Our team is just a message away. Let&apos;s connect and drive your logistics forward.
      </p>
    </div>
  );
}

function MethodCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="flex items-start gap-3 rounded-[14px] border border-[#dbe6fb] bg-white p-3.5 shadow-[0_10px_24px_rgba(15,23,42,.04)]">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1260ff] text-white">
        <Icon className="h-[15px] w-[15px]" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h3 className="text-[12px] font-bold leading-[1.2] text-[#081837]">{item.title}</h3>
        <p className="mt-1 text-[11px] leading-[1.45] text-[#5b677f]">{item.value}</p>
        <p className="mt-1 whitespace-pre-line text-[10px] leading-[1.45] text-[#64748B]">{item.meta}</p>
      </div>
    </div>
  );
}

function TrustItem({ item }) {
  const Icon = item.icon;

  return (
    <div className="flex items-start gap-3 px-0 py-1">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#1260ff] shadow-[0_8px_22px_rgba(18,96,255,.08)]">
        <Icon className="h-[15px] w-[15px]" aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-[12px] font-bold leading-[1.2] text-[#081837] sm:text-[13px]">{item.title}</h3>
        <p className="mt-1 whitespace-pre-line text-[10px] leading-[1.45] text-[#64748B] sm:text-[11px]">{item.description}</p>
      </div>
    </div>
  );
}

function CareerCard() {
  return (
    <section className="px-4 pb-10 pt-2 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px] rounded-[18px] border border-[#dbe6fb] bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,.06)] sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[.44fr_.56fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-[#eef6ff] px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] text-[#1260ff]">
              CAREER OPPORTUNITIES
            </p>
            <h2 className="mt-3 text-[15px] font-bold leading-[1.2] text-[#081837] sm:text-[16px]">
              Build the Future of Logistics
            </h2>
            <p className="mt-2 max-w-[480px] text-[12px] leading-[1.65] text-[#5b677f] sm:text-[13px]">
              Join our team of innovators and problem solvers driving the future of logistics with technology.
            </p>
            <Button href="/careers" className="mt-4 h-10 px-4 text-[12px]">
              View Openings
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['Great Work Culture', 'Collaborate, innovate and grow together.'],
              ['Learning & Growth', 'Continuous learning and career development.'],
              ['Meaningful Impact', 'Solve real-world problems at scale.'],
            ].map(([title, description]) => (
              <article key={title} className="rounded-[16px] border border-[#dbe6fb] bg-[#f8fbff] p-3.5 shadow-[0_10px_24px_rgba(15,23,42,.04)]">
                <h3 className="text-[12px] font-bold leading-[1.2] text-[#081837]">{title}</h3>
                <p className="mt-1 text-[10.5px] leading-[1.45] text-[#64748B]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactUs() {
  const emptyForm = { fullName: '', email: '', phone: '', companyName: '', subject: '', message: '' };
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const change = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus((current) => ({ ...current, error: '', success: current.success && current.loading ? current.success : '' }));
  };

  const validate = () => {
    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const companyName = form.companyName.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();
    if (fullName.length < 2) return { error: 'Please enter your full name.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address.' };
    if (!/^[+]?[-\d\s().]{7,30}$/.test(phone)) return { error: 'Please enter a valid phone number.' };
    if (!subject) return { error: 'Please enter a subject.' };
    if (subject.length > 160) return { error: 'Subject must be 160 characters or fewer.' };
    if (message.length < 10) return { error: 'Message must be at least 10 characters long.' };
    if (message.length > 3000) return { error: 'Message must be 3,000 characters or fewer.' };
    return { value: { fullName, email, phone, companyName, subject, message } };
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status.loading) return;
    const cleaned = validate();
    if (cleaned.error) {
      setStatus({ loading: false, error: cleaned.error, success: '' });
      return;
    }
    setStatus({ loading: true, error: '', success: '' });
    try {
      const response = await api('/contact-us', { method: 'POST', body: cleaned.value, auth: false });
      setForm(emptyForm);
      setStatus({ loading: false, error: '', success: response?.message || 'Message sent successfully.' });
    } catch (error) {
      setStatus({ loading: false, error: error.message || 'Unable to send your message. Please try again.', success: '' });
    }
  };

  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_80%_12%,rgba(18,96,255,.08),transparent_18%),radial-gradient(circle_at_15%_8%,rgba(18,96,255,.04),transparent_20%),linear-gradient(180deg,#fff_0%,#fbfdff_100%)] pt-[92px] text-[#071837]">
      <section className="px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1480px] items-center gap-2 text-[12px] text-[#64748B] sm:text-[13px]">
          <a href="/" className="transition-colors hover:text-[#1260ff]">Home</a>
          <span className="text-[#a8b7d3]">/</span>
          <span>Contact Us</span>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1480px]">
          <HeroCopy />
        </div>
      </section>

      <section className="px-4 pb-10 pt-2 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1480px] gap-4 lg:grid-cols-2 lg:items-start">
          <form onSubmit={submit} className="rounded-[18px] border border-[#dbe6fb] bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,.06)] sm:p-5">
            <h2 className="text-[15px] font-bold leading-[1.2] text-[#081837]">Send Us a Message</h2>
            <div className="mt-4 grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="text" value={form.fullName} onChange={(event) => change('fullName', event.target.value)} placeholder="Full Name" className="h-10 rounded-[8px] border border-[#dbe6fb] px-3 text-[12px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
                <input type="email" value={form.email} onChange={(event) => change('email', event.target.value)} placeholder="Email Address" className="h-10 rounded-[8px] border border-[#dbe6fb] px-3 text-[12px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="tel" value={form.phone} onChange={(event) => change('phone', event.target.value)} placeholder="Phone Number" className="h-10 rounded-[8px] border border-[#dbe6fb] px-3 text-[12px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
                <input type="text" value={form.companyName} onChange={(event) => change('companyName', event.target.value)} placeholder="Company Name" className="h-10 rounded-[8px] border border-[#dbe6fb] px-3 text-[12px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
              </div>
              <input type="text" value={form.subject} onChange={(event) => change('subject', event.target.value)} placeholder="Subject" className="h-10 rounded-[8px] border border-[#dbe6fb] px-3 text-[12px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
              <textarea value={form.message} onChange={(event) => change('message', event.target.value)} placeholder="Your Message" className="min-h-[140px] rounded-[8px] border border-[#dbe6fb] px-3 py-3 text-[12px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
            </div>
            {(status.error || status.success) && <p role={status.error ? 'alert' : 'status'} className={`mt-3 text-[12px] leading-[1.5] ${status.error ? 'text-[#d92d20]' : 'text-[#1260ff]'}`}>{status.error || status.success}</p>}
            <button
              type="submit"
              disabled={status.loading}
              className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#1260ff] px-4 text-[12px] font-bold text-white shadow-[0_10px_22px_rgba(18,96,255,.18)] transition-colors hover:bg-[#0f56e8] disabled:cursor-not-allowed disabled:opacity-70"
              aria-busy={status.loading}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Send Message
            </button>
          </form>

          <div className="rounded-[18px] border border-[#dbe6fb] bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,.06)] sm:p-5">
            <h2 className="text-[15px] font-bold leading-[1.2] text-[#081837]">Other Ways to Connect</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {contactMethods.map((item) => (
                <MethodCard key={item.title} item={item} />
              ))}
            </div>
            <div className="mt-4 rounded-[14px] border border-[#dbe6fb] bg-white p-3.5">
              <p className="text-[12px] font-bold text-[#081837]">Follow Us</p>
              <div className="mt-3 flex gap-2">
                {['in', 'f', 'x', '▶'].map((label) => (
                  <span key={label} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef6ff] text-[11px] font-bold text-[#1260ff]">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CareerCard />

      <section className="px-4 pb-[56px] pt-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1480px] rounded-[18px] border border-[#dbe6fb] bg-[linear-gradient(180deg,#f7fbff_0%,#eef6ff_100%)] p-4 shadow-[0_12px_32px_rgba(15,23,42,.05)] sm:p-5">
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {trustItems.map((item) => (
              <TrustItem key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
