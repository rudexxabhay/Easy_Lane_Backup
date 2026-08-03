import FeatureDetailPage from '../components/FeatureDetailPage.jsx';

export default function BillDiscounting() {
  return (
    <FeatureDetailPage
      eyebrow="FINANCE & INVOICING"
      title="Bill Discounting"
      description="Bill Discounting helps logistics businesses convert approved invoices into faster working capital. It is designed to strengthen cash flow without forcing teams to wait through long payment cycles, so operations can keep moving with less financial friction."
      note={[
        'Easy Lane positions bill discounting as part of the wider logistics workflow, not as a separate finance product. That means the invoice, the trip and the settlement story stay connected.',
        'The goal is to give transporters and vendors faster access to funds while keeping the process clear, traceable and aligned with the approved invoice record.',
      ]}
      overviewTitle="What Bill Discounting covers"
      overviewParagraphs={[
        'The module is focused on approved invoice financing. Once an invoice is validated, the business can unlock a large portion of its value much earlier than a traditional settlement cycle would allow. That makes it easier to manage working capital when operations are active and payment timelines are still open.',
        'The real value is in keeping the finance workflow tied to actual logistics execution. The system helps teams see the invoice, the approval status and the fund release context in one place so there is less uncertainty around where the money stands.',
      ]}
      overviewItems={[
        'Approved invoice financing for faster access to working capital.',
        'A clear path from invoice approval to fund release.',
        'Payment tracking that keeps the finance workflow visible.',
        'A process designed for logistics businesses that need cash flow discipline.',
      ]}
      valueTitle="Operational value"
      valueParagraphs={[
        'Bill discounting is most useful when cash flow speed matters as much as operational speed. When vendors and transport businesses can access funds faster, they can pay for fuel, service, manpower and movement without waiting for the full settlement window to close.',
        'It also reduces the pressure that late payment cycles create on day-to-day logistics work. Instead of letting receivables slow the business down, the platform helps convert approved value into liquidity that can support the next cycle of operations.',
      ]}
      valueItems={[
        'Improve working capital availability against approved invoices.',
        'Reduce dependency on long settlement cycles.',
        'Keep invoice funding visible and tied to operational records.',
      ]}
      processTitle="How teams use it"
      processSteps={[
        { title: 'Raise and approve the invoice', description: 'Use the invoice record that already belongs to the logistics workflow.' },
        { title: 'Review discounting access', description: 'Check the approved invoice context and funding eligibility.' },
        { title: 'Release working capital', description: 'Move the approved value into the cash flow cycle faster.' },
      ]}
      audienceTitle="Who it helps"
      audienceParagraphs={[
        'Bill Discounting is built for transporters, vendors and logistics businesses that need faster liquidity without losing clarity over the invoice lifecycle.',
        'It is especially useful where the invoice is already approved but the business still needs cash to continue serving trips, vendors and operations smoothly.',
      ]}
      audienceItems={[
        'Transporters looking for faster access to approved invoice value.',
        'Vendors who need stronger cash flow between settlement cycles.',
        'Operations-led businesses that want finance tied to the movement record.',
      ]}
    />
  );
}
