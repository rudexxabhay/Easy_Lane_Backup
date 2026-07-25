import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function PublicLayout({ children }) {
  return <div className="public-shell flex min-h-screen flex-col bg-white"><Navbar /><div className="public-content flex-1">{children}</div><Footer /></div>;
}
