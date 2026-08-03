import { ArrowRight } from 'lucide-react';
import Button from './Button.jsx';

function InfoList({ title, items }) {
  return (
    <section className="rounded-[24px] border border-[#dbe6fb] bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,.05)] sm:p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="border-b border-[#edf2fb] pb-3 text-[13px] leading-[1.7] text-[#5b677f] last:border-b-0 last:pb-0">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function NumberedStep({ number, title, description }) {
  return (
    <li className="rounded-[18px] border border-[#dbe6fb] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,.045)] sm:p-5">
      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#eef6ff] px-2 text-[12px] font-bold text-[#1260ff]">
        {number}
      </span>
      <h3 className="mt-3 text-[16px] font-bold leading-[1.2] text-[#081837]">{title}</h3>
      <p className="mt-2 text-[13px] leading-[1.7] text-[#5b677f]">{description}</p>
    </li>
  );
}

export default function PlatformDetailPage({ eyebrow, title, description, introLines, capabilitiesTitle, capabilities, stepsTitle, steps, audienceTitle, audience, note }) {
  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_80%_12%,rgba(18,96,255,.08),transparent_18%),radial-gradient(circle_at_15%_8%,rgba(18,96,255,.04),transparent_20%),linear-gradient(180deg,#fff_0%,#fbfdff_100%)] pt-[92px] text-[#071837]">
      <section className="px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 text-[12px] text-[#64748B] sm:text-[13px]">
          <a href="/" className="transition-colors hover:text-[#1260ff]">Home</a>
          <span className="text-[#a8b7d3]">/</span>
          <a href="/platform" className="transition-colors hover:text-[#1260ff]">Platform</a>
          <span className="text-[#a8b7d3]">/</span>
          <span>{title}</span>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[.92fr_1.08fr] lg:items-start">
          <div className="max-w-[620px]">
            <p className="mb-4 inline-flex h-9 items-center rounded-full bg-[#eef6ff] px-4 text-[11px] font-bold tracking-[0.08em] text-[#1260ff]">
              {eyebrow}
            </p>
            <h1 className="max-w-[620px] text-[clamp(34px,4.2vw,54px)] font-extrabold leading-[1.05] tracking-[-.06em] text-[#081837]">
              {title}
            </h1>
            <p className="mt-5 max-w-[620px] text-[15px] leading-[1.8] text-[#5b677f] sm:text-[16px]">
              {description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/contact-us" className="h-11 px-5 text-[12px]">
                Get in Touch
              </Button>
              <Button href="/book-demo" variant="outline" className="h-11 px-5 text-[12px]">
                Book a Demo
              </Button>
            </div>
          </div>

          <section className="rounded-[24px] border border-[#dbe6fb] bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,.05)] sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">Overview</p>
            <div className="mt-4 space-y-4">
              {introLines.map((line) => (
                <p key={line} className="text-[13px] leading-[1.8] text-[#5b677f]">
                  {line}
                </p>
              ))}
            </div>
            {note && (
              <p className="mt-5 rounded-[16px] border border-[#e4efff] bg-[#f8fbff] px-4 py-3 text-[12px] leading-[1.7] text-[#45607f]">
                {note}
              </p>
            )}
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-5 lg:grid-cols-2">
          <InfoList title={capabilitiesTitle} items={capabilities} />
          <InfoList title={audienceTitle} items={audience} />
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="rounded-[24px] border border-[#dbe6fb] bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,.05)] sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">{stepsTitle}</p>
            <ol className="mt-4 grid gap-4 lg:grid-cols-3">
              {steps.map((step, index) => (
                <NumberedStep
                  key={step.title}
                  number={`${index + 1}`.padStart(2, '0')}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px] rounded-[24px] border border-[#dbe6fb] bg-[linear-gradient(180deg,#f7fbff_0%,#eef6ff_100%)] p-5 shadow-[0_12px_32px_rgba(15,23,42,.05)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[22px] font-bold leading-[1.15] text-[#081837] sm:text-[26px]">Ready to see it in action?</h2>
              <p className="mt-1 max-w-[680px] text-[13px] leading-[1.7] text-[#5b677f]">
                Connect the module to your day-to-day logistics workflow and keep every team aligned in one place.
              </p>
            </div>
            <a
              href="/book-demo"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#1260ff] px-5 text-[12px] font-bold text-white transition-colors hover:bg-[#0f56e8]"
            >
              Book a Demo <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
