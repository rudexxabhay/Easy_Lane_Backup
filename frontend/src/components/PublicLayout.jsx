import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import EasyAiAssistant from './EasyAiAssistant.jsx';

export default function PublicLayout({ children }) {
  return <div className="flex min-h-screen flex-col bg-white"><Navbar /><div className="flex-1">{children}</div><Footer /><EasyAiAssistant /></div>;
}
