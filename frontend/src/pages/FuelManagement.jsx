import FeatureDetailPage from '../components/FeatureDetailPage.jsx';

export default function FuelManagement() {
  return (
    <FeatureDetailPage
      eyebrow="FLEET OPERATIONS"
      title="Fuel Management"
      description="Fuel Management gives logistics teams a clearer way to understand fuel cost, consumption and operational impact. It is designed to make fuel visibility part of the working fleet record, not a separate afterthought."
      note={[
        'Fuel is one of the most visible operating costs in transport. When teams can track it clearly, they can make better decisions about usage, planning and route discipline.',
        'Easy Lane keeps fuel information close to the fleet and trip context so the conversation moves from guesswork to actual operational visibility.',
      ]}
      overviewTitle="What Fuel Management covers"
      overviewParagraphs={[
        'The module is focused on making fuel movement understandable in a practical operating environment. That includes the ability to keep fuel records connected to the fleet, support cleaner cost visibility and help the team see where the major spend is happening.',
        'Instead of reviewing fuel in isolation, the platform keeps it attached to the wider logistics workflow. That means managers can interpret the cost in relation to the vehicles, trips and usage patterns that created it.',
      ]}
      overviewItems={[
        'Fuel visibility tied to the fleet record.',
        'Clearer cost awareness for operations and finance teams.',
        'Better support for usage and consumption review.',
        'A practical record for monitoring operating spend over time.',
      ]}
      valueTitle="Operational value"
      valueParagraphs={[
        'When fuel management is visible, it becomes easier to identify costly patterns early. A route, vehicle or operating habit that looks fine on paper can quickly become expensive when the fuel record is reviewed in context.',
        'That visibility helps teams keep decisions grounded in actual movement and usage rather than assumptions. Over time, it supports better planning, more disciplined cost control and a more accountable fleet operation.',
      ]}
      valueItems={[
        'Bring fuel cost into the same workflow as fleet operations.',
        'Support better usage review and operational discipline.',
        'Help teams focus on cost control without losing day-to-day clarity.',
      ]}
      processTitle="How teams use it"
      processSteps={[
        { title: 'Record fuel clearly', description: 'Keep the fuel picture attached to the vehicle and operational context.' },
        { title: 'Review spend patterns', description: 'Check where cost is accumulating and whether the pattern matches expectations.' },
        { title: 'Act on the insight', description: 'Use the information to improve planning, accountability and route discipline.' },
      ]}
      audienceTitle="Who it helps"
      audienceParagraphs={[
        'Fuel Management is useful for fleet owners, operations heads and finance teams that need one reliable place to understand spend and support planning decisions.',
        'It is especially valuable when the same team that runs the fleet also needs to watch cost, because the module removes the gap between movement data and financial awareness.',
      ]}
      audienceItems={[
        'Fleet teams looking for clearer operating cost visibility.',
        'Finance teams that need a practical fuel record.',
        'Operators who want cost control connected to fleet usage.',
      ]}
    />
  );
}
