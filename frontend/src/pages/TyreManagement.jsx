import FeatureDetailPage from '../components/FeatureDetailPage.jsx';

export default function TyreManagement() {
  return (
    <FeatureDetailPage
      eyebrow="FLEET OPERATIONS"
      title="Tyre Management"
      description="Tyre Management helps fleets keep track of one of the most important physical assets on the vehicle. It supports better visibility into tyre life, replacement planning and operational readiness without turning the page into a cluttered dashboard."
      note={[
        'Tyres influence safety, uptime and operating cost at the same time. When the record is vague, teams usually feel the impact much later, after wear has already affected performance.',
        'Easy Lane keeps tyre information in the fleet workflow so teams can look at condition, timing and replacement needs in a cleaner and more disciplined way.',
      ]}
      overviewTitle="What Tyre Management covers"
      overviewParagraphs={[
        'The module is built to keep tyre-related information organized and usable. Rather than treating tyres as a loose maintenance note, it helps the fleet team connect them to the vehicle record and understand what still has usable life left.',
        'That makes the page useful for both planning and control. It supports a better view of replacement timing, rotation planning and wear-related decision-making without forcing the user into a heavy interface.',
      ]}
      overviewItems={[
        'Tyre visibility attached to the fleet record.',
        'Replacement and wear planning support.',
        'A cleaner understanding of what needs attention soon.',
        'Operational context for better safety and readiness.',
      ]}
      valueTitle="Operational value"
      valueParagraphs={[
        'The main value of tyre management is consistency. When the fleet team has a visible record, it is easier to keep replacement timing aligned with actual usage instead of reacting after a problem appears on the road.',
        'It also helps managers talk about tyre cost in a more informed way. Instead of treating tyre spend as a random expense, the team can track it as part of fleet readiness and control the lifecycle with more confidence.',
      ]}
      valueItems={[
        'Reduce the chance of avoidable tyre-related disruption.',
        'Plan replacement work with better visibility.',
        'Keep tyre records close to the rest of the fleet workflow.',
      ]}
      processTitle="How teams use it"
      processSteps={[
        { title: 'Track the lifecycle', description: 'Keep the tyre record connected to the vehicle so usage is easier to understand.' },
        { title: 'Review the wear pattern', description: 'Look for tyres that are approaching service or replacement needs.' },
        { title: 'Act before disruption', description: 'Use the visibility to plan replacement work before it becomes an operational issue.' },
      ]}
      audienceTitle="Who it helps"
      audienceParagraphs={[
        'Tyre Management is useful for fleet owners, workshop coordinators and operations teams that need a clear and practical way to keep tyre records visible without building a separate process around it.',
        'It is especially relevant for fleets that want better safety discipline and a more predictable maintenance rhythm tied to actual use.',
      ]}
      audienceItems={[
        'Fleet teams that need tyre lifecycle visibility.',
        'Operations groups that want fewer road surprises.',
        'Managers looking for cleaner replacement planning.',
      ]}
    />
  );
}
