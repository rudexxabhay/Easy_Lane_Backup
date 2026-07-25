export const EASY_AI_KNOWLEDGE = [
  {
    id: 'easy-lane-overview',
    category: 'General',
    primaryQuestion: 'What is Easy Lane?',
    alternativeQuestions: ['Tell me about Easy Lane', 'What does Easy Lane do?', 'Explain Easy Lane'],
    keywords: ['easy lane', 'platform', 'logistics platform', 'overview'],
    answer: 'Easy Lane is an AI-enabled logistics platform that brings transportation, fleet operations, live visibility and finance workflows into one connected system. It helps teams reduce manual work, respond faster and manage logistics with clearer operational control.',
    ctaLabel: 'Explore Easy Lane',
    ctaTarget: '#solutions',
    priority: 90,
    isEnabled: true,
  },
  {
    id: 'tms',
    category: 'TMS',
    primaryQuestion: 'Explain TMS',
    alternativeQuestions: ['What is TMS?', 'How does transport management work?', 'Tell me about transportation management'],
    keywords: ['tms', 'transport', 'transportation management', 'dispatch', 'trip management'],
    answer: 'Easy Lane TMS helps plan, assign and monitor transportation operations from one place. Teams can manage trips, dispatching, vendors, costs, documents and delivery progress with real-time operational visibility.',
    ctaLabel: 'Explore TMS',
    ctaTarget: '#solutions',
    priority: 100,
    isEnabled: true,
  },
  {
    id: 'fleet-management',
    category: 'Fleet',
    primaryQuestion: 'Explain Fleet Management',
    alternativeQuestions: ['What is fleet management?', 'How can I manage my fleet?', 'Tell me about the fleet module'],
    keywords: ['fleet', 'vehicles', 'maintenance', 'fuel', 'drivers', 'compliance'],
    answer: 'Fleet Management centralizes vehicles, drivers, maintenance, fuel and compliance records. It gives operations teams a clearer view of fleet health, upcoming service needs and the information required to keep vehicles productive.',
    ctaLabel: 'Explore Fleet',
    ctaTarget: '#solutions',
    priority: 95,
    isEnabled: true,
  },
  {
    id: 'ams',
    category: 'AMS',
    primaryQuestion: 'Explain AMS',
    alternativeQuestions: ['What is AMS?', 'Tell me about AMS', 'How does AMS work?'],
    keywords: ['ams', 'asset management', 'assets'],
    answer: 'Easy Lane AMS supports structured asset visibility and lifecycle management. It helps teams organize asset records, monitor status and maintenance needs, and keep operational information accessible in one place.',
    ctaLabel: 'Explore AMS',
    ctaTarget: '#solutions',
    priority: 85,
    isEnabled: true,
  },
  {
    id: 'finance',
    category: 'Finance',
    primaryQuestion: 'Explain Finance Module',
    alternativeQuestions: ['What is the finance module?', 'How does bill discounting work?', 'Tell me about logistics finance'],
    keywords: ['finance', 'invoice', 'bill discounting', 'cash flow', 'payment', 'funding'],
    answer: 'The Finance Module improves invoice and payment visibility and supports bill discounting. Approved invoices can be converted into working capital, helping logistics businesses strengthen cash flow while keeping the process clear and traceable.',
    ctaLabel: 'Explore Finance',
    ctaTarget: '#services',
    priority: 80,
    isEnabled: true,
  },
  {
    id: 'industries',
    category: 'Industries',
    primaryQuestion: 'What industries do you serve?',
    alternativeQuestions: ['Which industries use Easy Lane?', 'Who is Easy Lane for?', 'What sectors do you support?'],
    keywords: ['industries', 'industry', 'fmcg', 'retail', 'manufacturing', 'pharma', 'cold chain', '3pl'],
    answer: 'Easy Lane supports FMCG, retail, manufacturing, pharmaceutical, cold-chain, 3PL and aggregator operations. The platform is designed to adapt to businesses coordinating fleets, shipments, partners and logistics finance.',
    ctaLabel: 'View Solutions',
    ctaTarget: '#solutions',
    priority: 75,
    isEnabled: true,
  },
  {
    id: 'live-tracking',
    category: 'Tracking',
    primaryQuestion: 'How does live tracking work?',
    alternativeQuestions: ['Explain live tracking', 'Can I track vehicles?', 'How do I track a shipment?', 'Can vehicles be tracked in real time?', 'Mere trucks live track ho sakte hain?'],
    keywords: ['tracking', 'live tracking', 'gps', 'vehicle location', 'shipment', 'eta', 'visibility', 'truck location', 'real time tracking'],
    answer: 'Live tracking brings vehicle locations, route progress, ETAs and delivery updates into the Control Tower. Operations teams can monitor active movement, identify exceptions and respond without switching between disconnected tools.',
    ctaLabel: 'Explore Control Tower',
    ctaTarget: '#contact',
    priority: 100,
    isEnabled: true,
  },
  {
    id: 'integrations',
    category: 'Integrations',
    primaryQuestion: 'What integrations are supported?',
    alternativeQuestions: ['Can Easy Lane integrate with my systems?', 'Tell me about integrations', 'Do you support API integrations?'],
    keywords: ['integration', 'integrations', 'api', 'erp', 'system', 'connect'],
    answer: 'Easy Lane can be aligned with the systems involved in your logistics workflows. Integration scope depends on your operational setup, so the team can review your ERP, tracking, finance and partner-system requirements during a solution discussion.',
    ctaLabel: 'Contact Sales',
    ctaTarget: '#contact',
    priority: 70,
    isEnabled: true,
  },
  {
    id: 'book-demo',
    category: 'Demo',
    primaryQuestion: 'Can I book a demo?',
    alternativeQuestions: ['Book a demo', 'I want a demo', 'How can I see the platform?', 'Talk to sales'],
    keywords: ['demo', 'book', 'sales', 'contact', 'meeting'],
    answer: 'Yes. You can request a tailored Easy Lane walkthrough based on your logistics operations, priorities and the modules you want to explore.',
    ctaLabel: 'Book Demo',
    ctaTarget: '#contact',
    priority: 60,
    isEnabled: true,
  },
];

export const EASY_AI_SUGGESTIONS = [
  'What is Easy Lane?',
  'Explain TMS',
  'Explain Fleet Management',
  'Explain AMS',
  'Explain Finance Module',
  'What industries do you serve?',
  'How does live tracking work?',
  'Can I book a demo?',
];

export const EASY_AI_FALLBACK = `I don't have a verified answer for that yet.

You can ask about:

• TMS
• Fleet
• AMS
• Finance
• Tracking
• Integrations
• Book Demo`;

