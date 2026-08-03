import FeatureDetailPage from '../components/FeatureDetailPage.jsx';

export default function Maintenance() {
  return (
    <FeatureDetailPage
      eyebrow="FLEET OPERATIONS"
      title="Maintenance"
      description="Easy Lane Maintenance is built for teams that want service discipline without adding process friction. It helps keep vehicle upkeep visible, planned and connected to fleet operations so breakdowns do not turn into avoidable trip delays."
      note={[
        'Maintenance is not just a reminder system. In logistics, it is what keeps vehicles available, drivers productive and delivery plans intact.',
        'The module supports a more disciplined operating rhythm by keeping service history, future servicing needs and fleet readiness visible inside the same platform that manages trips and assets.',
      ]}
      overviewTitle="What Maintenance covers"
      overviewParagraphs={[
        'The maintenance view keeps service work tied to the actual fleet record instead of scattering information across WhatsApp threads, spreadsheets or paper logs. That makes it easier to understand which vehicle was serviced, when it was serviced and what needs attention next.',
        'It also supports a more practical planning cycle. Operations teams can look at the current vehicle picture, estimate service windows more accurately and avoid sending a vehicle into active duty when the maintenance record says it should be checked first.',
      ]}
      overviewItems={[
        'Planned service visibility so routine work is easier to schedule.',
        'Service history that supports better vehicle decision-making.',
        'Repair and downtime awareness for more realistic dispatch planning.',
        'A cleaner record for workshops, approvals and follow-up work.',
      ]}
      valueTitle="Operational value"
      valueParagraphs={[
        'The real value of maintenance visibility is not only cost control. It is operational stability. When the fleet team can see what is due, what is in progress and what has already been completed, it becomes much easier to keep trucks available and reduce last-minute disruption.',
        'That same visibility also improves communication between operations and service teams. Everyone works from the same record, which reduces rework and lowers the chance of sending a vehicle out before it is ready.',
      ]}
      valueItems={[
        'Reduce unplanned downtime caused by missed servicing.',
        'Improve trip readiness by checking vehicle health earlier.',
        'Keep maintenance work tied to the same fleet workflow used by operations teams.',
      ]}
      processTitle="How teams use it"
      processSteps={[
        { title: 'Review what is due', description: 'Use the fleet record to see upcoming service needs before dispatch decisions are made.' },
        { title: 'Plan the service window', description: 'Schedule maintenance around operations so the vehicle is not unexpectedly unavailable.' },
        { title: 'Close the loop', description: 'Keep service actions, repair notes and completion status visible for the next planning cycle.' },
      ]}
      audienceTitle="Who it helps"
      audienceParagraphs={[
        'This module is useful for fleet owners, transport operators and operations teams that need a practical way to keep vehicles ready without introducing a separate maintenance process.',
        'It is especially helpful when fleet health and trip execution need to stay connected, because the people planning the movement and the people maintaining the asset can rely on the same operating picture.',
      ]}
      audienceItems={[
        'Fleet owners who want better vehicle uptime.',
        'Operations teams that need a visible service schedule.',
        'Service coordinators who manage repairs and workshop follow-up.',
      ]}
    />
  );
}
