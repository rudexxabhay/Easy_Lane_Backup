import PlatformDetailPage from '../components/PlatformDetailPage.jsx';

export default function ControlTower() {
  return (
    <PlatformDetailPage
      eyebrow="CONTROL TOWER"
      title="Control Tower"
      description="Control Tower brings real-time tracking, exception handling and operational alerts into one command view. It helps teams monitor movement, spot delays and respond with better visibility across the network."
      introLines={[
        'The Control Tower is the operations command center for teams that need one place to see what is moving, what is delayed and what needs attention.',
        'It is designed to bring live movement and exception awareness together instead of scattering updates across messages and dashboards.',
      ]}
      capabilitiesTitle="What Control Tower covers"
      capabilities={[
        'Real-time tracking across active shipments and vehicles.',
        'Exception center for delays and operational issues.',
        'Alerts and notifications that surface exceptions quickly.',
        'SLA monitoring for better service control.',
        'Exception handling so the right team can act faster.',
      ]}
      stepsTitle="How teams use it"
      steps={[
        { title: 'Monitor live movement', description: 'See active trips and route progress from a single view.' },
        { title: 'Spot exceptions early', description: 'Track delays or deviations before they become larger issues.' },
        { title: 'Coordinate action', description: 'Use the same control view to guide follow-up and resolution.' },
      ]}
      audienceTitle="Built for"
      audience={[
        'Operations teams needing one live command view.',
        'Businesses that monitor delays, SLAs and active movement.',
        'Teams that want faster decisions without jumping between tools.',
      ]}
    />
  );
}
