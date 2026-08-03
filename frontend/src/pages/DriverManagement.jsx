import FeatureDetailPage from '../components/FeatureDetailPage.jsx';

export default function DriverManagement() {
  return (
    <FeatureDetailPage
      eyebrow="FLEET OPERATIONS"
      title="Driver Management"
      description="Driver Management keeps the people behind the wheel connected to the same operational picture as the fleet. It supports better assignment clarity, communication, performance awareness and daily execution without adding visual clutter."
      note={[
        'Easy Lane already treats the driver layer as part of the wider logistics workflow, not as a disconnected add-on.',
        'The goal of this page is to keep driver coordination simple: clear updates, better visibility and more disciplined operational follow-through.',
      ]}
      overviewTitle="What Driver Management covers"
      overviewParagraphs={[
        'The module helps operations teams keep driver-related information organized in a way that matches the pace of live logistics work. That includes assignment awareness, route communication and a clearer record of who is responsible for which movement.',
        'It also supports the practical side of driver operations. When performance, updates and trip context stay visible together, it becomes easier to manage the day without a chain of manual follow-ups.',
      ]}
      overviewItems={[
        'Driver assignment visibility.',
        'Trip communication and status awareness.',
        'Performance and safety context for operational review.',
        'A cleaner connection between the driver app and fleet operations.',
      ]}
      valueTitle="Operational value"
      valueParagraphs={[
        'Good driver management reduces confusion. When the team can see who is assigned, what the trip context is and how execution is progressing, daily operations become easier to coordinate and less dependent on repeated manual checking.',
        'It also supports better consistency across the network. Drivers stay connected to the same operational structure, which makes updates, navigation, trip handling and accountability easier to manage.',
      ]}
      valueItems={[
        'Improve assignment clarity and communication.',
        'Support safer, more disciplined trip execution.',
        'Keep driver activity aligned with the wider platform workflow.',
      ]}
      processTitle="How teams use it"
      processSteps={[
        { title: 'Assign the trip', description: 'Match the driver to the movement and keep the responsibility visible.' },
        { title: 'Share the context', description: 'Use the operational record to keep the driver informed and aligned.' },
        { title: 'Review the execution', description: 'Check how the trip went and what should be improved next time.' },
      ]}
      audienceTitle="Who it helps"
      audienceParagraphs={[
        'Driver Management is valuable for dispatchers, fleet managers and operations teams that need cleaner driver coordination and less manual chasing.',
        'It also supports teams that rely on the driver app, because the driver side and the control side stay connected inside the same platform instead of living in separate systems.',
      ]}
      audienceItems={[
        'Dispatch teams that assign vehicles and trips every day.',
        'Fleet managers who need clearer driver visibility.',
        'Operations teams that want better trip coordination and follow-through.',
      ]}
    />
  );
}
