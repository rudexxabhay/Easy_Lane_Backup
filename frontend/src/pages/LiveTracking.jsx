import PlatformDetailPage from '../components/PlatformDetailPage.jsx';

export default function LiveTracking() {
  return (
    <PlatformDetailPage
      eyebrow="LIVE TRACKING"
      title="Live Tracking"
      description="Live Tracking brings vehicle locations, route progress, ETAs and delivery updates into the Control Tower. Teams can monitor active movement and respond without switching between disconnected tools."
      introLines={[
        'Live visibility helps teams understand where each vehicle is, how the route is progressing and whether the trip is on schedule.',
        'It is built to keep customers, operations and support aligned around the same live movement data.',
      ]}
      capabilitiesTitle="What Live Tracking shows"
      capabilities={[
        'Vehicle location updates for active movement visibility.',
        'Route progress and ETA monitoring.',
        'Delivery updates for internal teams and customer communication.',
        'Proof of delivery visibility once the trip closes.',
        'Exception awareness when a trip moves off plan.',
      ]}
      stepsTitle="How teams use it"
      steps={[
        { title: 'Track in real time', description: 'Monitor where the vehicle is and how the trip is progressing.' },
        { title: 'Watch ETA changes', description: 'See updates as routes move and conditions change.' },
        { title: 'Close the trip', description: 'Use delivery and POD visibility to complete the record.' },
      ]}
      audienceTitle="Built for"
      audience={[
        'Operations teams that need live trip visibility.',
        'Customer-facing teams that need clearer ETAs and updates.',
        'Businesses that want one source of truth for movement and delivery status.',
      ]}
      note="Live tracking works as part of the same Easy Lane platform, so teams can connect trip visibility with operations and finance workflows."
    />
  );
}
