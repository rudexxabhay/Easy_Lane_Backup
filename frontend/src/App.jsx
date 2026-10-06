import { lazy, Suspense } from 'react';
import PublicLayout from './components/PublicLayout.jsx';
import { usePathname } from './lib/router.js';

const Home = lazy(() => import('./pages/Home.jsx'));
const BookDemo = lazy(() => import('./pages/BookDemo.jsx'));
const Platform = lazy(() => import('./pages/Platform.jsx'));
const TMS = lazy(() => import('./pages/TMS.jsx'));
const FleetManagement = lazy(() => import('./pages/FleetManagement.jsx'));
const ControlTower = lazy(() => import('./pages/ControlTower.jsx'));
const LiveTracking = lazy(() => import('./pages/LiveTracking.jsx'));
const Maintenance = lazy(() => import('./pages/Maintenance.jsx'));
const FuelManagement = lazy(() => import('./pages/FuelManagement.jsx'));
const TyreManagement = lazy(() => import('./pages/TyreManagement.jsx'));
const DriverManagement = lazy(() => import('./pages/DriverManagement.jsx'));
const Compliance = lazy(() => import('./pages/Compliance.jsx'));
const BillDiscounting = lazy(() => import('./pages/BillDiscounting.jsx'));
const VendorPayments = lazy(() => import('./pages/VendorPayments.jsx'));
const InvoiceManagement = lazy(() => import('./pages/InvoiceManagement.jsx'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard.jsx'));
const VendorDashboard = lazy(() => import('./pages/VendorDashboard.jsx'));
const DriverApp = lazy(() => import('./pages/DriverApp.jsx'));
const OperationsDashboard = lazy(() => import('./pages/OperationsDashboard.jsx'));
const Solutions = lazy(() => import('./pages/Solutions.jsx'));
const AboutUs = lazy(() => import('./pages/AboutUs.jsx'));
const ContactUs = lazy(() => import('./pages/ContactUs.jsx'));
const Resources = lazy(() => import('./pages/Resources.jsx'));
const Company = lazy(() => import('./pages/Company.jsx'));
const Pricing = lazy(() => import('./pages/Pricing.jsx'));
const Careers = lazy(() => import('./pages/Careers.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

function App() {
  const path = usePathname();
  if (path === '/admin/login') return <Suspense fallback={null}><AdminLogin /></Suspense>;
  if (path === '/admin' || path.startsWith('/admin/')) return <Suspense fallback={null}><AdminDashboard /></Suspense>;
  const pages = {
    '/': <Home />,
    '/home': <Home />,
    '/platform': <Platform />,
    '/platform/tms': <TMS />,
    '/platform/fleet-management': <FleetManagement />,
    '/platform/control-tower': <ControlTower />,
    '/platform/live-tracking': <LiveTracking />,
    '/platform/maintenance': <Maintenance />,
    '/platform/fuel-management': <FuelManagement />,
    '/platform/tyre-management': <TyreManagement />,
    '/platform/driver-management': <DriverManagement />,
    '/platform/compliance': <Compliance />,
    '/platform/bill-discounting': <BillDiscounting />,
    '/platform/vendor-payments': <VendorPayments />,
    '/platform/invoice-management': <InvoiceManagement />,
    '/client-dashboard': <ClientDashboard />,
    '/vendor-dashboard': <VendorDashboard />,
    '/driver-app': <DriverApp />,
    '/operations-dashboard': <OperationsDashboard />,
    '/solutions': <Solutions />,
    '/about-us': <AboutUs />,
    '/contact-us': <ContactUs />,
    '/careers': <Careers />,
    '/privacy-policy': <PrivacyPolicy />,
    '/resources': <Resources />,
    '/company': <Company />,
    '/pricing': <Pricing />,
    '/book-demo': <BookDemo />,
  };
  return <PublicLayout><Suspense fallback={null}>{pages[path] || <Home />}</Suspense></PublicLayout>;
}

export default App;
