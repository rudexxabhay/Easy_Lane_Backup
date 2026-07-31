import PublicLayout from './components/PublicLayout.jsx';
import Home from './pages/Home.jsx';
import BookDemo from './pages/BookDemo.jsx';
import Platform from './pages/Platform.jsx';
import Solutions from './pages/Solutions.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Resources from './pages/Resources.jsx';
import Company from './pages/Company.jsx';
import Pricing from './pages/Pricing.jsx';
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
    '/solutions': <Solutions />,
    '/about-us': <AboutUs />,
    '/contact-us': <ContactUs />,
    '/resources': <Resources />,
    '/company': <Company />,
    '/pricing': <Pricing />,
    '/book-demo': <BookDemo />,
  };
  return <PublicLayout>{pages[path] || <Home />}</PublicLayout>;
}

export default App;
