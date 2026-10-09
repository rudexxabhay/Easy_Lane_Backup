import { Component, lazy, Suspense, useLayoutEffect } from 'react';
import PublicLayout from './components/PublicLayout.jsx';
import { usePathname } from './lib/router.js';

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
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

class RouteErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto grid min-h-[55vh] max-w-xl content-center gap-3 px-6 text-center" role="alert">
          <h1 className="text-xl font-bold text-slate-900">This page could not be loaded.</h1>
          <p className="text-sm text-slate-600">Please try again.</p>
          <button type="button" className="mx-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}

function App() {
  const path = usePathname();

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  if (path === '/admin/login') return <RouteErrorBoundary key={path}><Suspense fallback={null}><AdminLogin /></Suspense></RouteErrorBoundary>;
  if (path === '/admin' || path.startsWith('/admin/')) return <RouteErrorBoundary key={path}><Suspense fallback={null}><AdminDashboard /></Suspense></RouteErrorBoundary>;
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
  const page = pages[path] || <Home />;
  const isHome = path === '/' || path === '/home' || !pages[path];
  return <PublicLayout><RouteErrorBoundary key={path}>{isHome ? page : <div className="public-page">{page}</div>}</RouteErrorBoundary></PublicLayout>;
}

export default App;
