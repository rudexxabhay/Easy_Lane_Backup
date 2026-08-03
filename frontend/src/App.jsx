import PublicLayout from './components/PublicLayout.jsx';
import Home from './pages/Home.jsx';
import BookDemo from './pages/BookDemo.jsx';
import Platform from './pages/Platform.jsx';
import TMS from './pages/TMS.jsx';
import FleetManagement from './pages/FleetManagement.jsx';
import ControlTower from './pages/ControlTower.jsx';
import LiveTracking from './pages/LiveTracking.jsx';
import Maintenance from './pages/Maintenance.jsx';
import FuelManagement from './pages/FuelManagement.jsx';
import TyreManagement from './pages/TyreManagement.jsx';
import DriverManagement from './pages/DriverManagement.jsx';
import Compliance from './pages/Compliance.jsx';
import BillDiscounting from './pages/BillDiscounting.jsx';
import VendorPayments from './pages/VendorPayments.jsx';
import InvoiceManagement from './pages/InvoiceManagement.jsx';
import ClientDashboard from './pages/ClientDashboard.jsx';
import VendorDashboard from './pages/VendorDashboard.jsx';
import DriverApp from './pages/DriverApp.jsx';
import OperationsDashboard from './pages/OperationsDashboard.jsx';
import Solutions from './pages/Solutions.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Resources from './pages/Resources.jsx';
import Company from './pages/Company.jsx';
import Pricing from './pages/Pricing.jsx';
import Careers from './pages/Careers.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { usePathname } from './lib/router.js';

function App() {
  const path = usePathname();
  if (path === '/admin/login') return <AdminLogin />;
  if (path === '/admin' || path.startsWith('/admin/')) return <AdminDashboard />;
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
  return <PublicLayout>{pages[path] || <Home />}</PublicLayout>;
}

export default App;
