import {
  Briefcase,
  Clock3,
  FileText,
  Handshake,
  Headset,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react';

const teams = [
  {
    title: 'Sales & Enquiries',
    description: 'Learn more about our platform and solutions.',
    phone: '+91 98765 43210',
    email: 'sales@easylane.co.in',
    icon: Briefcase,
  },
  {
    title: 'Support',
    description: 'Get help with technical support and platform issues.',
    phone: '+91 98765 43211',
    email: 'support@easylane.co.in',
    icon: Headset,
  },
  {
    title: 'Partnerships',
    description: 'Explore partnership or channel partner opportunities.',
    phone: '+91 98765 43212',
    email: 'partnerships@easylane.co.in',
    icon: Handshake,
  },
  {
    title: 'Careers',
    description: 'Join our team and be a part of our growth journey.',
    phone: '+91 98765 43213',
    email: 'careers@easylane.co.in',
    icon: UsersRound,
  },
  {
    title: 'Accounts & Billing',
    description: 'For billing, payments and financial related queries.',
    phone: '+91 98765 43214',
    email: 'accounts@easylane.co.in',
    icon: FileText,
  },
];

const trustItems = [
  { title: 'Quick Response', description: 'We respond to all enquiries within 24 hours.', icon: MessageSquareText },
  { title: 'Reliable Support', description: 'Our team is always here to help you succeed.', icon: ShieldCheck },
  { title: 'Customer First', description: 'Your satisfaction is our top priority.', icon: UserRound },
  { title: 'Secure Communication', description: 'Your information is safe and confidential with us.', icon: LockKeyhole },
];

function SectionDivider() {
  return <div className="mx-auto h-px w-full max-w-[1280px] bg-[linear-gradient(90deg,transparent,rgba(18,96,255,.16),transparent)]" />;
}

function TeamCard({ item }) {
  return (
    <article className="flex h-full min-h-[180px] flex-col rounded-[16px] border border-[#dbe6fb] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,.05)] transition-all duration-200 hover:-translate-y-1 hover:border-[#bfd7ff] hover:shadow-[0_16px_34px_rgba(15,23,42,.08)] sm:min-h-[188px] sm:p-4.5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef6ff] text-[#1260ff] sm:h-10 sm:w-10">
          <item.icon className="h-4 w-4 sm:h-[15px] sm:w-[15px]" aria-hidden="true" />
        </span>
        <div className="min-w-0 text-left">
          <h3 className="text-[14px] font-bold leading-[1.2] tracking-[-.03em] text-[#081837] sm:text-[15px]">{item.title}</h3>
          <p className="mt-1 text-[11px] leading-[1.45] text-[#64748B] sm:text-[12px]">{item.description}</p>
        </div>
      </div>
      <div className="pt-2">
        <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
          <Phone className="h-3 w-3 text-[#1260ff]" aria-hidden="true" />
          {item.phone ? <a href={`tel:${item.phone.replace(/\s/g, '')}`} className="font-medium text-[#1260ff] transition-colors hover:text-[#0f56e8]">{item.phone}</a> : <span className="text-transparent">.</span>}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-[#64748B]">
          <Mail className="h-3 w-3 text-[#1260ff]" aria-hidden="true" />
          <a href={`mailto:${item.email}`} className="font-medium text-[#1260ff] transition-colors hover:text-[#0f56e8]">{item.email}</a>
        </div>
      </div>
    </article>
  );
}

function InfoRow({ icon: Icon, title, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef6ff] text-[#1260ff] sm:h-10 sm:w-10">
        <Icon className="h-[15px] w-[15px] sm:h-4 sm:w-4" aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-[13px] font-bold leading-[1.2] text-[#081837] sm:text-[14px]">{title}</h3>
        <p className="mt-1 text-[12px] leading-[1.55] text-[#64748B] sm:text-[13px]">{children}</p>
      </div>
    </div>
  );
}

function SocialButton({ icon: Icon, label, href = '#' }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef6ff] text-[#1260ff] transition-colors duration-200 hover:bg-[#dfeaff] sm:h-10 sm:w-10"
    >
      <Icon className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" aria-hidden="true" />
    </a>
  );
}

function LinkedInIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M7 10.5V17M7 7.2h.01M11 17v-3.8c0-1.8 1-3.2 2.8-3.2 1.7 0 2.2 1.1 2.2 2.8V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 5.5h13v13h-13z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function FacebookIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M14 8.5h2V5h-2.2C11.9 5 11 6.2 11 7.8v1.7H9v3h2V19h3v-6.5h2.1l.4-3H14v-1.3c0-.5.2-.7.7-.7Z" fill="currentColor" />
      <path d="M5.5 5.5h13v13h-13z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function InstagramIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.1" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.7" cy="7.3" r="0.9" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="4.8" y="6.5" width="14.4" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="m11 10 4 2-4 2z" fill="currentColor" />
    </svg>
  );
}

function ContactUs() {
  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_84%_10%,rgba(18,96,255,.09),transparent_18%),linear-gradient(180deg,#fff_0%,#fbfdff_100%)] pt-[92px] text-[#071837]">
      <section className="px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px] text-[12px] text-[#64748B] sm:text-[13px]">
          <a href="/" className="transition-colors hover:text-[#1260ff]">Home</a>
          <span className="px-2 text-[#a8b7d3]">/</span>
          <span>Contact Us</span>
        </div>
      </section>

      <section className="relative px-8 pb-[44px] pt-[12px] sm:px-10 sm:pb-[52px] lg:px-16">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34%] bg-[radial-gradient(circle_at_50%_36%,rgba(18,96,255,.14),transparent_26%),radial-gradient(circle_at_50%_52%,rgba(18,96,255,.07),transparent_30%)] lg:block" aria-hidden="true">
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(120,145,188,.35) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                'linear-gradient(90deg, transparent 0, transparent 22px, rgba(18,96,255,.18) 22px, rgba(18,96,255,.18) 23px, transparent 23px), linear-gradient(0deg, transparent 0, transparent 22px, rgba(18,96,255,.12) 22px, rgba(18,96,255,.12) 23px, transparent 23px)',
              backgroundSize: '100% 100%',
            }}
          />
        </div>
        <div className="mx-auto grid max-w-[1280px] gap-7 lg:grid-cols-[.64fr_.36fr] lg:items-center lg:gap-10">
          <div className="max-w-[650px]">
            <p className="mb-2.5 inline-flex rounded-full border border-[#cfe0ff] bg-[#eef6ff] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1260ff] sm:text-[12px]">
              CONTACT US
            </p>
            <h1 className="max-w-[650px] text-[clamp(32px,3.9vw,54px)] font-extrabold leading-[1.05] tracking-[-.06em] text-[#081837]">
              <span className="block">Let&apos;s <span className="text-[#1260ff]">Connect.</span></span>
              <span className="block">We&apos;re Here to Help You</span>
            </h1>
            <p className="mt-4 max-w-[620px] text-[13px] leading-[1.65] text-[#5b677f] sm:text-[14px]">
              Have questions about EasyLane or our solutions? Our team is ready to assist you. Reach out to the right team or send us a message and we&apos;ll get back to you as soon as possible.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[290px] rounded-[18px] border border-[#dbe6fb] bg-white p-4 text-center shadow-[0_14px_40px_rgba(15,23,42,.06)] sm:p-5">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eef6ff] text-[#1260ff]">
                <Headset className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-2.5 text-[11px] font-medium leading-[1.45] text-[#64748B] sm:text-[12px]">We usually respond within</p>
              <p className="mt-1.5 text-[26px] font-extrabold leading-none tracking-[-.05em] text-[#1260ff] sm:text-[30px]">24 Hours</p>
              <div className="mx-auto mt-3.5 h-px w-full bg-[#edf3ff]" />
              <p className="mt-2.5 text-[11px] font-medium leading-[1.45] text-[#081837] sm:text-[12px]">Your success is our priority.</p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-4 py-[54px] sm:px-6 sm:py-[64px] lg:px-8">
        <div className="mx-auto max-w-[1280px] text-center">
          <p className="inline-flex rounded-full border border-[#cfe0ff] bg-[#eef6ff] px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[#1260ff]">
            GET IN TOUCH
          </p>
          <h2 className="mt-3 text-[clamp(26px,2.8vw,34px)] font-extrabold leading-[1.1] tracking-[-.055em] text-[#081837]">
            Contact Our Teams
          </h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {teams.map((team) => (
              <TeamCard key={team.title} item={team} />
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-4 py-[54px] sm:px-6 sm:py-[64px] lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-5 lg:grid-cols-[.55fr_.45fr]">
          <div className="rounded-[16px] border border-[#dbe6fb] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,.06)] sm:p-6">
            <p className="inline-flex rounded-full border border-[#cfe0ff] bg-[#eef6ff] px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[#1260ff]">
              SEND US A MESSAGE
            </p>
            <h2 className="mt-3 text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.1] tracking-[-.05em] text-[#081837]">
              Send Us a Message
            </h2>
            <p className="mt-2 text-[13px] leading-[1.6] text-[#64748B] sm:text-[14px]">
              Fill out the form and our team will get back to you.
            </p>

            <form className="mt-4 grid gap-3.5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1.5 text-[12px] font-semibold text-[#081837]">
                  Full Name *
                  <input type="text" required className="h-11 rounded-lg border border-[#dbe6fb] px-3 text-[13px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
                </label>
                <label className="grid gap-1.5 text-[12px] font-semibold text-[#081837]">
                  Email Address *
                  <input type="email" required className="h-11 rounded-lg border border-[#dbe6fb] px-3 text-[13px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1.5 text-[12px] font-semibold text-[#081837]">
                  Phone Number *
                  <input type="tel" required className="h-11 rounded-lg border border-[#dbe6fb] px-3 text-[13px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
                </label>
                <label className="grid gap-1.5 text-[12px] font-semibold text-[#081837]">
                  Company Name
                  <input type="text" className="h-11 rounded-lg border border-[#dbe6fb] px-3 text-[13px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
                </label>
              </div>

              <label className="grid gap-1.5 text-[12px] font-semibold text-[#081837]">
                Subject / Department *
                <select required defaultValue="" className="h-11 rounded-lg border border-[#dbe6fb] px-3 text-[13px] outline-none transition focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]">
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option>Sales</option>
                  <option>Support</option>
                  <option>Partnerships</option>
                  <option>Careers</option>
                  <option>Accounts &amp; Billing</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="grid gap-1.5 text-[12px] font-semibold text-[#081837]">
                Your Message *
                <textarea required placeholder="Tell us how we can help you..." className="min-h-[130px] rounded-lg border border-[#dbe6fb] px-3 py-3 text-[13px] outline-none transition placeholder:text-[#9aa8c0] focus:border-[#1260ff] focus:ring-2 focus:ring-[#cfe0ff]" />
              </label>

              <div>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#1260ff] px-5 text-[12px] font-bold text-white shadow-[0_10px_22px_rgba(18,96,255,.18)] transition-colors hover:bg-[#0f56e8]"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send Message
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-5">
            <div className="rounded-[16px] border border-[#dbe6fb] bg-[linear-gradient(180deg,#f7fbff_0%,#eef6ff_100%)] p-5 shadow-[0_14px_40px_rgba(15,23,42,.05)] sm:p-6">
              <p className="inline-flex rounded-full border border-[#cfe0ff] bg-white px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[#1260ff]">
                OUR OFFICE
              </p>
              <h2 className="mt-3 text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.1] tracking-[-.05em] text-[#081837]">
                Our Office
              </h2>

              <div className="mt-5 space-y-4">
                <InfoRow icon={MapPin} title="Company">
                  Easy Cargo Solutions Private Limited
                </InfoRow>
                <InfoRow icon={MapPin} title="Address">
                  Kanodia Group, 1st Floor, Knowledge Park III, Greater Noida, Uttar Pradesh – 201308, India
                </InfoRow>
                <InfoRow icon={Phone} title="Phone">
                  +91 98727 65272
                </InfoRow>
                <InfoRow icon={Mail} title="Email">
                  info@easylane.co.in
                </InfoRow>
                <InfoRow icon={Clock3} title="Hours">
                  Mon – Sat: 9:30 AM to 6:30 PM<br />
                  Sunday: Closed
                </InfoRow>
              </div>

              <div className="mt-6 border-t border-[#dbe6fb] pt-5">
                <h3 className="text-[14px] font-bold text-[#081837]">Find Us</h3>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <SocialButton icon={LinkedInIcon} label="LinkedIn" />
                  <SocialButton icon={FacebookIcon} label="Facebook" />
                  <SocialButton icon={InstagramIcon} label="Instagram" />
                  <SocialButton icon={YouTubeIcon} label="YouTube" />
                </div>
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-[16px] border border-[#dbe6fb] shadow-[0_14px_40px_rgba(15,23,42,.05)]"
              aria-label="Map placeholder"
              role="img"
            >
              <div
                className="relative h-[190px] w-full bg-[linear-gradient(180deg,#f7fbff_0%,#eef5ff_100%)] sm:h-[210px]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 2px 2px, rgba(18,96,255,.12) 1px, transparent 0), linear-gradient(90deg, rgba(18,96,255,.07) 1px, transparent 1px), linear-gradient(180deg, rgba(18,96,255,.07) 1px, transparent 1px)',
                  backgroundSize: '22px 22px, 44px 44px, 44px 44px',
                }}
              >
                <div className="absolute left-8 top-10 h-px w-[42%] bg-[#cfe0ff]" />
                <div className="absolute left-12 top-[72px] h-px w-[56%] bg-[#dbe6fb]" />
                <div className="absolute left-[15%] top-[48%] h-px w-[48%] -rotate-6 bg-[#cfe0ff]" />
                <div className="absolute right-10 top-[34%] h-px w-[32%] rotate-12 bg-[#dbe6fb]" />

                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1260ff] text-white shadow-[0_14px_30px_rgba(18,96,255,.25)]">
                    <MapPin className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="mt-3 rounded-[10px] border border-[#dbe6fb] bg-white px-3 py-2 text-center text-[11px] leading-[1.45] text-[#081837] shadow-[0_10px_24px_rgba(15,23,42,.06)]">
                    <p className="font-semibold">Easy Cargo Solutions Private Limited</p>
                    <p className="text-[#64748B]">Knowledge Park III, Greater Noida, UP – 201308</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-4 py-[50px] sm:px-6 sm:py-[62px] lg:px-8">
        <div className="mx-auto max-w-[1280px] rounded-[16px] border border-[#dbe6fb] bg-[linear-gradient(180deg,#f7fbff_0%,#eef6ff_100%)] p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-0">
            {trustItems.map((item, index) => (
              <div
                key={item.title}
                className={`flex items-start gap-3 rounded-[12px] px-0 py-1 ${index !== trustItems.length - 1 ? 'xl:border-r xl:border-[#dbe6fb] xl:pr-6' : ''}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#1260ff] sm:h-9 sm:w-9">
                  <item.icon className="h-[15px] w-[15px] sm:h-[16px] sm:w-[16px]" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[12px] font-bold leading-[1.2] text-[#081837] sm:text-[13px]">{item.title}</h3>
                  <p className="mt-1 text-[10px] leading-[1.5] text-[#64748B] sm:text-[11px]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactUs;
