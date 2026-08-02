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
import Button from '../components/Button.jsx';

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
      <h1 className="max-w-none text-[clamp(52px,5.8vw,74px)] font-extrabold leading-[1.02] tracking-[-.065em] text-[#081837]">
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
          <div className="rounded-[18px] border border-[#dbe6fb] bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,.06)] sm:p-5">
            <h2 className="text-[15px] font-bold leading-[1.2] text-[#081837]">Send Us a Message</h2>
            <div className="mt-4 grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="text" placeholder="Full Name" className="h-10 rounded-[8px] border border-[#dbe6fb] px-3 text-[12px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
                <input type="email" placeholder="Email Address" className="h-10 rounded-[8px] border border-[#dbe6fb] px-3 text-[12px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="tel" placeholder="Phone Number" className="h-10 rounded-[8px] border border-[#dbe6fb] px-3 text-[12px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
                <input type="text" placeholder="Company Name" className="h-10 rounded-[8px] border border-[#dbe6fb] px-3 text-[12px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
              </div>
              <input type="text" placeholder="Subject" className="h-10 rounded-[8px] border border-[#dbe6fb] px-3 text-[12px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
              <textarea placeholder="Your Message" className="min-h-[140px] rounded-[8px] border border-[#dbe6fb] px-3 py-3 text-[12px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
            </div>
            <button
              type="button"
              className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#1260ff] px-4 text-[12px] font-bold text-white shadow-[0_10px_22px_rgba(18,96,255,.18)] transition-colors hover:bg-[#0f56e8]"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Send Message
            </button>
          </div>

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
