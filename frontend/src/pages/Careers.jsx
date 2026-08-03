import { Mail, Send, Target, UsersRound, Zap } from 'lucide-react';
import Button from '../components/Button.jsx';

const values = [
  { icon: Target, title: 'Clear ownership', description: 'Small teams with direct responsibility and measurable outcomes.' },
  { icon: UsersRound, title: 'Customer focus', description: 'Work that helps logistics teams move faster and operate with more clarity.' },
  { icon: Zap, title: 'Practical innovation', description: 'Build useful products that solve real problems instead of adding complexity.' },
];

const ways = [
  'Product and engineering',
  'Operations and support',
  'Sales and partnerships',
  'Design and growth',
];

export default function Careers() {
  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_80%_12%,rgba(18,96,255,.08),transparent_18%),radial-gradient(circle_at_15%_8%,rgba(18,96,255,.04),transparent_20%),linear-gradient(180deg,#fff_0%,#fbfdff_100%)] pt-[92px] text-[#071837]">
      <section className="px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 text-[12px] text-[#64748B] sm:text-[13px]">
          <a href="/" className="transition-colors hover:text-[#1260ff]">Home</a>
          <span className="text-[#a8b7d3]">/</span>
          <span>Careers</span>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-start">
          <div className="max-w-[620px]">
            <p className="mb-4 inline-flex h-9 items-center rounded-full bg-[#eef6ff] px-4 text-[11px] font-bold tracking-[0.08em] text-[#1260ff]">
              CAREERS
            </p>
            <h1 className="max-w-[620px] text-[clamp(34px,4.4vw,56px)] font-extrabold leading-[1.04] tracking-[-.065em] text-[#081837]">
              Build logistics software that people actually use.
            </h1>
            <p className="mt-5 max-w-[620px] text-[15px] leading-[1.85] text-[#5b677f] sm:text-[16px]">
              Easy Lane is looking for people who care about clarity, execution and useful technology. We build tools for logistics businesses, transporters, fleet owners, drivers and partners, so the work needs to be thoughtful, practical and grounded in real operational needs.
            </p>
            <p className="mt-4 max-w-[620px] text-[15px] leading-[1.85] text-[#5b677f] sm:text-[16px]">
              If you want to work on products that simplify transport operations, improve visibility and make logistics finance easier to manage, this is the kind of environment that values that mindset.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="mailto:career@easylane.co.in" className="h-11 px-5 text-[12px]">
                Email Your Resume
              </Button>
              <Button href="/contact-us" variant="outline" className="h-11 px-5 text-[12px]">
                Talk to the Team
              </Button>
            </div>
          </div>

          <section className="rounded-[24px] border border-[#dbe6fb] bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,.05)] sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">What we value</p>
            <div className="mt-4 grid gap-4">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3 rounded-[16px] border border-[#edf2fb] p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef6ff] text-[#1260ff]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-[14px] font-bold leading-[1.25] text-[#081837]">{item.title}</h3>
                      <p className="mt-1 text-[13px] leading-[1.65] text-[#5b677f]">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-5 lg:grid-cols-2">
          <section className="rounded-[24px] border border-[#dbe6fb] bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,.05)] sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">Where you can contribute</p>
            <ul className="mt-4 space-y-3">
              {ways.map((item) => (
                <li key={item} className="rounded-[14px] border border-[#edf2fb] px-4 py-3 text-[13px] leading-[1.7] text-[#5b677f]">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[24px] border border-[#dbe6fb] bg-[linear-gradient(180deg,#f7fbff_0%,#eef6ff_100%)] p-5 shadow-[0_12px_32px_rgba(15,23,42,.05)] sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">How to apply</p>
            <div className="mt-4 space-y-4">
              <p className="text-[13px] leading-[1.8] text-[#5b677f]">
                Send your resume to <a href="mailto:career@easylane.co.in" className="font-semibold text-[#1260ff]">career@easylane.co.in</a> with a short note about the kind of work you want to do.
              </p>
              <p className="text-[13px] leading-[1.8] text-[#5b677f]">
                If you already know the area you want to work in, mention it clearly. That helps the team review your profile against current needs more quickly.
              </p>
            </div>
            <div className="mt-5 border-t border-[#dbe6fb] pt-5">
              <a href="mailto:career@easylane.co.in" className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#1260ff] px-5 text-[12px] font-bold text-white transition-colors hover:bg-[#0f56e8]">
                <Send size={15} /> Send Resume
              </a>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
