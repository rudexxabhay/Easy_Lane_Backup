export default function PrivacyPolicy() {
  const sections = [
    {
      title: 'Information we collect',
      body: 'When you use Easy Lane forms or request information from us, we may collect the details you submit such as your name, email address, phone number, company name, subject and message. We also collect basic technical information needed to keep the website secure and functioning properly.',
    },
    {
      title: 'How we use information',
      body: 'We use submitted information to respond to your enquiry, manage business communication, support platform operations, improve the website experience and maintain records related to legitimate business activity.',
    },
    {
      title: 'Sharing and disclosure',
      body: 'We do not sell personal information. We may share information only when it is necessary to operate the business, comply with law, protect our systems, or work with service providers that help us deliver website and platform functionality.',
    },
    {
      title: 'Data retention',
      body: 'Information is retained only for as long as it is needed for operational, legal, security or business purposes. If retention is no longer required, we take steps to delete or anonymize the data according to our internal practices.',
    },
    {
      title: 'Security',
      body: 'We use reasonable technical and organizational measures to protect information from unauthorized access, loss, misuse or disclosure. No online system can be guaranteed to be completely secure, but we work to keep the site and its data handling controlled and protected.',
    },
    {
      title: 'Your choices',
      body: 'If you submit a form and want to ask about the information we hold, you can contact us using the details on our Contact Us page. Where applicable, we will respond in line with our business and legal obligations.',
    },
    {
      title: 'Contact',
      body: 'For privacy-related questions, please reach out through the Contact Us page or email our team at hello@easylane.co.in.',
    },
  ];

  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_80%_12%,rgba(18,96,255,.08),transparent_18%),radial-gradient(circle_at_15%_8%,rgba(18,96,255,.04),transparent_20%),linear-gradient(180deg,#fff_0%,#fbfdff_100%)] pt-[92px] text-[#071837]">
      <section className="px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 text-[12px] text-[#64748B] sm:text-[13px]">
          <a href="/" className="transition-colors hover:text-[#1260ff]">Home</a>
          <span className="text-[#a8b7d3]">/</span>
          <span>Privacy Policy</span>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-start">
          <div className="max-w-[620px]">
            <p className="mb-4 inline-flex h-9 items-center rounded-full bg-[#eef6ff] px-4 text-[11px] font-bold tracking-[0.08em] text-[#1260ff]">
              PRIVACY POLICY
            </p>
            <h1 className="max-w-[620px] text-[clamp(34px,4.4vw,56px)] font-extrabold leading-[1.04] tracking-[-.065em] text-[#081837]">
              Clean, simple and transparent data handling.
            </h1>
            <p className="mt-5 max-w-[620px] text-[15px] leading-[1.85] text-[#5b677f] sm:text-[16px]">
              Easy Lane is committed to handling personal and business information responsibly. This policy explains what we collect, how we use it and how we keep it protected when you use the website or contact our team.
            </p>
          </div>

          <section className="rounded-[24px] border border-[#dbe6fb] bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,.05)] sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1260ff]">Policy summary</p>
            <p className="mt-4 text-[13px] leading-[1.8] text-[#5b677f]">
              We keep this policy intentionally straightforward. If you share information through our forms or email, we use it only for legitimate business communication and operational purposes, and we avoid unnecessary collection where possible.
            </p>
          </section>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-5 lg:grid-cols-2">
          {sections.map((section) => (
            <section key={section.title} className="rounded-[24px] border border-[#dbe6fb] bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,.05)] sm:p-6">
              <h2 className="text-[18px] font-bold leading-[1.2] text-[#081837]">{section.title}</h2>
              <p className="mt-3 text-[13px] leading-[1.85] text-[#5b677f] sm:text-[14px]">{section.body}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
