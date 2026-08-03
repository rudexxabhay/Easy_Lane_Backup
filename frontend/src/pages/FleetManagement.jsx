import PlatformDetailPage from '../components/PlatformDetailPage.jsx';

export default function FleetManagement() {
  return (
    <PlatformDetailPage
      eyebrow="FLEET MANAGEMENT"
      title="Fleet Management"
      description="Fleet Management centralizes vehicles, drivers, maintenance, fuel and compliance records. It gives operations teams a clearer view of fleet health, upcoming service needs and the information required to keep vehicles productive."
      introLines={[
        'Easy Lane keeps the fleet record in one place so teams can manage vehicles and drivers without scattered spreadsheets.',
        'Operational data stays connected to service, fuel and compliance needs, which makes it easier to plan ahead.',
      ]}
      capabilitiesTitle="What Fleet Management covers"
      capabilities={[
        'Fleet overview for active vehicles and operational status.',
        'Vehicle tracking and movement visibility.',
        'Driver management for day-to-day assignment and coordination.',
        'Maintenance planning for upcoming service needs.',
        'Fuel and expense records to support clearer cost control.',
      ]}
      stepsTitle="How teams use it"
      steps={[
        { title: 'Maintain records', description: 'Keep vehicles, drivers and servicing information in one system.' },
        { title: 'Monitor health', description: 'See which vehicles need attention before they interrupt operations.' },
        { title: 'Control cost', description: 'Track fuel and expenses to support cleaner fleet decisions.' },
      ]}
      audienceTitle="Built for"
      audience={[
        'Fleet owners managing multiple vehicles and service cycles.',
        'Operations teams that need driver and vehicle visibility.',
        'Businesses that want cleaner records for maintenance and fuel control.',
      ]}
    />
  );
}
