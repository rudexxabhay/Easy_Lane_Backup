import FeatureDetailPage from '../components/FeatureDetailPage.jsx';

export default function InvoiceManagement() {
  return (
    <FeatureDetailPage
      eyebrow="FINANCE & INVOICING"
      title="Invoice Management"
      description="Invoice Management helps teams keep invoice creation, tracking, reconciliation and related document work in one place. It is built to support a clearer, more reliable billing process across client, vendor and operations workflows."
      note={[
        'Invoices are most useful when they remain connected to the trip, the POD and the settlement path. That is why Easy Lane treats invoice control as part of the broader logistics workflow.',
        'The result is a cleaner financial record that is easier for teams to review, approve and close without losing context along the way.',
      ]}
      overviewTitle="What Invoice Management covers"
      overviewParagraphs={[
        'The module supports a more disciplined invoice workflow by making billing, approval and reconciliation visible in one place. That helps operations and finance stay in sync, especially when invoice details must match delivery and settlement records.',
        'It also reduces the friction that comes from handling documents manually. The user can see invoice context alongside operational data, which makes it easier to confirm what was billed, what was approved and what still needs to be closed.',
      ]}
      overviewItems={[
        'Auto invoicing support for faster billing workflows.',
        'Invoice tracking tied to operational records.',
        'Reconciliation support for cleaner finance control.',
        'TDS / e-invoicing visibility where required by the workflow.',
      ]}
      valueTitle="Operational value"
      valueParagraphs={[
        'Invoice Management becomes valuable when finance and operations need the same truth. A clean invoice workflow reduces back-and-forth, prevents avoidable mismatches and makes settlement processing easier to trust.',
        'It also improves the quality of reporting. When invoice records are structured and visible, the business can look at billing performance, pending items and reconciliation needs with much less effort.',
      ]}
      valueItems={[
        'Keep billing aligned with operational activity.',
        'Reduce friction in approval and reconciliation.',
        'Support cleaner reporting and invoicing discipline.',
      ]}
      processTitle="How teams use it"
      processSteps={[
        { title: 'Create the invoice', description: 'Generate the billing record against the completed logistics work.' },
        { title: 'Track approval and status', description: 'Follow the invoice as it moves through the workflow.' },
        { title: 'Reconcile and close', description: 'Keep the financial record clear for settlement and reporting.' },
      ]}
      audienceTitle="Who it helps"
      audienceParagraphs={[
        'Invoice Management is useful for finance teams, logistics coordinators and vendor operations teams that need cleaner billing discipline and fewer manual follow-ups.',
        'It is especially helpful when invoice activity must stay connected to proof of delivery, payment tracking and reconciliation across the same platform.',
      ]}
      audienceItems={[
        'Finance teams handling billing and reconciliation.',
        'Operations teams that want invoice status visible alongside trip work.',
        'Businesses that need more control over invoice-linked documentation.',
      ]}
    />
  );
}
