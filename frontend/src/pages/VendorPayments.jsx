import FeatureDetailPage from '../components/FeatureDetailPage.jsx';

export default function VendorPayments() {
  return (
    <FeatureDetailPage
      eyebrow="FINANCE & INVOICING"
      title="Vendor Payments"
      description="Vendor Payments keeps settlement visibility, payment coordination and financial follow-up organized inside the Easy Lane workflow. It is meant to reduce manual chasing and give transport vendors clearer visibility into what has been processed, what is pending and what is ready to move."
      note={[
        'Vendor payments work best when they are easy to track. A logistics business should not have to search through multiple threads, spreadsheets or disconnected tools to understand the status of a settlement.',
        'Easy Lane treats payment visibility as an operational need, not just a back-office task, because vendors and transporters depend on timely settlement to keep the network moving.',
      ]}
      overviewTitle="What Vendor Payments covers"
      overviewParagraphs={[
        'The module brings payment status into a cleaner and more usable view. Instead of relying on separate follow-ups, the team can see where the payment stands and how it relates to the invoice or delivery that created it.',
        'That creates a more reliable connection between operations and finance. Once the work is complete, the payment trail remains visible so the vendor side of the business knows what has been acknowledged, processed or still requires attention.',
      ]}
      overviewItems={[
        'Payment visibility connected to invoice and shipment records.',
        'Cleaner settlement communication with vendors and transport partners.',
        'A practical way to reduce repeated follow-ups.',
        'Better operational awareness around what is pending and what is complete.',
      ]}
      valueTitle="Operational value"
      valueParagraphs={[
        'Vendor Payments matters because settlement speed and visibility shape trust. When partners can see what is happening, they are less likely to keep asking for updates and more likely to stay aligned with the operating rhythm of the business.',
        'It also helps internal teams stay organized. Finance, operations and vendor-facing teams can look at the same status instead of managing separate conversations that slow the process down.',
      ]}
      valueItems={[
        'Reduce manual payment chasing and status confusion.',
        'Improve transparency between internal teams and vendors.',
        'Keep settlements tied to the same logistics workflow as the invoice.',
      ]}
      processTitle="How teams use it"
      processSteps={[
        { title: 'Review the status', description: 'Check what has been processed, what is pending and what still needs follow-up.' },
        { title: 'Coordinate internally', description: 'Keep finance and operations aligned on the same settlement trail.' },
        { title: 'Close the loop', description: 'Use payment visibility to reduce repeated vendor follow-ups and maintain trust.' },
      ]}
      audienceTitle="Who it helps"
      audienceParagraphs={[
        'Vendor Payments is useful for transport businesses, logistics teams and finance operations that need a clearer way to handle settlement communication.',
        'It is especially relevant when multiple vendors or partners rely on the same payment flow and the business wants to avoid loose, manual tracking.',
      ]}
      audienceItems={[
        'Vendor-facing teams that handle settlement communication.',
        'Finance teams managing payment progress and follow-up.',
        'Transport businesses that want clearer trust and transparency with partners.',
      ]}
    />
  );
}
