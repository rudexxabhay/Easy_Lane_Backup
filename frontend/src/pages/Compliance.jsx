import FeatureDetailPage from '../components/FeatureDetailPage.jsx';

export default function Compliance() {
  return (
    <FeatureDetailPage
      eyebrow="FLEET OPERATIONS"
      title="Compliance"
      description="Compliance keeps permits, documents and operational requirements visible so the fleet does not lose time to missing records. It is designed to support cleaner document discipline and a more reliable operating rhythm across the network."
      note={[
        'In logistics, compliance is most useful when it is simple to follow. Teams should be able to see what is valid, what needs attention and what should be renewed without searching through disconnected files.',
        'Easy Lane uses the compliance view to keep document control aligned with fleet operations, which makes readiness easier to manage and audit trails easier to trust.',
      ]}
      overviewTitle="What Compliance covers"
      overviewParagraphs={[
        'The module provides a place to keep the operational record of documents, permits and validity-related checks. That reduces the chance of the fleet discovering a missing item at the wrong moment and keeps the team better prepared for daily movement.',
        'It also helps create a more consistent document process. Instead of treating compliance as a last-minute check, the team can use the platform to keep visibility on what is current and what needs to be updated.',
      ]}
      overviewItems={[
        'Document visibility attached to the fleet record.',
        'Permit and validity awareness for daily operations.',
        'A cleaner path for renewals and follow-up action.',
        'Support for audit-ready operational discipline.',
      ]}
      valueTitle="Operational value"
      valueParagraphs={[
        'Compliance matters because missing documents can interrupt trips, create avoidable risk and slow down operations. When the record is easier to see, teams can act earlier and reduce the chance of a vehicle being held up for something that should have been caught sooner.',
        'It also gives the operations team a more dependable view of readiness. The platform keeps the information close to the fleet workflow so everyone is working from the same source of truth instead of managing a separate compliance trail.',
      ]}
      valueItems={[
        'Keep readiness checks visible instead of reactive.',
        'Reduce the risk of avoidable document-related disruption.',
        'Support a simpler and more reliable audit trail.',
      ]}
      processTitle="How teams use it"
      processSteps={[
        { title: 'Review what is current', description: 'See which documents and permits are valid before the vehicle is moved.' },
        { title: 'Flag what needs renewal', description: 'Keep the attention list visible so the team can act before expiry causes disruption.' },
        { title: 'Keep a traceable record', description: 'Maintain a cleaner document history for operations and review.' },
      ]}
      audienceTitle="Who it helps"
      audienceParagraphs={[
        'Compliance is useful for fleet teams, operations managers and administrators who need a reliable way to keep document control practical and visible.',
        'It is especially valuable for businesses that want operational readiness to be part of the daily workflow rather than a separate administrative task.',
      ]}
      audienceItems={[
        'Fleet teams that manage permits and documents.',
        'Operations managers who need readiness visibility.',
        'Administrators responsible for renewals and follow-up.',
      ]}
    />
  );
}
