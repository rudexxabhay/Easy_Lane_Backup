import Button from './Button.jsx';

function TextPanel({ title, paragraphs, items }) {
  return (
    <section className="rounded-[24px] border border-[#dbe6fb] bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,.05)] sm:p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">{title}</p>
      <div className="mt-4 space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={`${title}-paragraph-${index}`} className="text-[13px] leading-[1.8] text-[#5b677f] sm:text-[14px]">
            {paragraph}
          </p>
        ))}
      </div>
      {items?.length ? (
        <ul className="mt-5 space-y-3 border-t border-[#edf2fb] pt-5">
          {items.map((item, index) => (
            <li key={`${title}-item-${index}`} className="text-[13px] leading-[1.7] text-[#5b677f]">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function StepLine({ number, title, description }) {
  return (
    <li className="rounded-[18px] border border-[#dbe6fb] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,.045)] sm:p-5">
      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#eef6ff] px-2 text-[12px] font-bold text-[#1260ff]">
        {number}
      </span>
      <h3 className="mt-3 text-[16px] font-bold leading-[1.2] text-[#081837]">{title}</h3>
      <p className="mt-2 text-[13px] leading-[1.75] text-[#5b677f]">{description}</p>
    </li>
  );
}

export default function FeatureDetailPage({
  eyebrow,
  title,
  description,
  overviewTitle,
  overviewParagraphs,
  overviewItems,
  valueTitle,
  valueParagraphs,
  valueItems,
  processTitle,
  processSteps,
  audienceTitle,
  audienceParagraphs,
  audienceItems,
  note,
}) {
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
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-start">
          <div className="max-w-[640px]">
            <p className="mb-4 inline-flex h-9 items-center rounded-full bg-[#eef6ff] px-4 text-[11px] font-bold tracking-[0.08em] text-[#1260ff]">
              {eyebrow}
            </p>
            <h1 className="max-w-[640px] text-[clamp(34px,4.4vw,56px)] font-extrabold leading-[1.04] tracking-[-.065em] text-[#081837]">
              {title}
            </h1>
            <p className="mt-5 max-w-[640px] text-[15px] leading-[1.85] text-[#5b677f] sm:text-[16px]">
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
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">Why it matters</p>
            <div className="mt-4 space-y-4">
              {note.map((paragraph, index) => (
                <p key={`note-${index}`} className="text-[13px] leading-[1.8] text-[#5b677f] sm:text-[14px]">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-5 lg:grid-cols-2">
          <TextPanel title={overviewTitle} paragraphs={overviewParagraphs} items={overviewItems} />
          <TextPanel title={valueTitle} paragraphs={valueParagraphs} items={valueItems} />
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px] rounded-[24px] border border-[#dbe6fb] bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,.05)] sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">{processTitle}</p>
          <ol className="mt-4 grid gap-4 lg:grid-cols-3">
            {processSteps.map((step, index) => (
              <StepLine
                key={step.title}
                number={`${index + 1}`.padStart(2, '0')}
                title={step.title}
                description={step.description}
              />
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <TextPanel title={audienceTitle} paragraphs={audienceParagraphs} items={audienceItems} />
          <div className="rounded-[24px] border border-[#dbe6fb] bg-[linear-gradient(180deg,#f7fbff_0%,#eef6ff_100%)] p-5 shadow-[0_12px_32px_rgba(15,23,42,.05)] sm:p-6">
            <h2 className="text-[22px] font-bold leading-[1.16] text-[#081837] sm:text-[26px]">Built for clean operations</h2>
            <p className="mt-3 text-[13px] leading-[1.8] text-[#5b677f] sm:text-[14px]">
              These pages stay intentionally minimal. The point is to explain the module clearly, show where it fits inside the Easy Lane platform, and keep the experience useful on mobile and desktop without introducing unnecessary visual noise.
            </p>
            <div className="mt-5 border-t border-[#dbe6fb] pt-5">
              <a href="/platform" className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#1260ff] px-5 text-[12px] font-bold text-white transition-colors hover:bg-[#0f56e8]">
                Back to Platform
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
