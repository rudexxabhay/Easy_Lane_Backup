import PlatformDetailPage from '../components/PlatformDetailPage.jsx';

export default function TMS() {
  return (
    <PlatformDetailPage
      eyebrow="TRANSPORTATION MANAGEMENT SYSTEM"
      title="TMS"
      description="Easy Lane TMS helps teams plan, assign and monitor transportation operations from one place. It brings order booking, load planning, freight execution and delivery progress into a single workflow with real-time visibility."
      introLines={[
        'The transportation layer is built to reduce manual coordination and keep dispatch, vendors and execution aligned.',
        'Teams can follow every trip from assignment to delivery without switching between disconnected tools.',
      ]}
      capabilitiesTitle="What TMS covers"
      capabilities={[
        'Order booking and load planning for day-to-day trip execution.',
        'Freight execution with live status updates and operational visibility.',
        'Vendor coordination and trip-level communication in one workflow.',
        'Document handling and proof of delivery support.',
        'Exception handling so issues are tracked before they slow operations down.',
      ]}
      stepsTitle="How teams use it"
      steps={[
        { title: 'Create the trip', description: 'Capture the load, route and delivery requirement in one place.' },
        { title: 'Assign and dispatch', description: 'Share the movement with the right vehicle, driver or vendor.' },
        { title: 'Track the execution', description: 'Monitor progress, documents and exceptions until delivery closes.' },
      ]}
      audienceTitle="Built for"
      audience={[
        'Transport operators managing multiple trips and vendors.',
        'Shippers who need clearer execution visibility.',
        'Operations teams that want fewer manual follow-ups and better control.',
      ]}
    />
  );
}
