import { useEffect, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import Button from './Button.jsx';
import logo from '../assets/logo.webp';
import { navigate, usePathname } from '../lib/router.js';
import { api } from '../lib/api.js';

const navigationLinks = [
  { label: 'Platform', href: '/platform' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'About Us', href: '/about-us' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [managedLinks, setManagedLinks] = useState([]);
  const path = usePathname();
  const shellShadow = isScrolled
    ? 'inset 0 1px 0 rgba(255,255,255,0.92), 0 8px 30px rgba(15,35,70,0.08), 0 2px 8px rgba(15,35,70,0.04)'
    : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 26px rgba(15,35,70,0.06), 0 2px 6px rgba(15,35,70,0.03)';
  const displayLinks = (managedLinks.length ? managedLinks : navigationLinks).map((link) => {
    if (link.label === 'Solutions') return { ...link, href: '/solutions' };
    if (link.label === 'About Us') return { ...link, href: '/about-us' };
    if (link.label === 'Contact Us') return { ...link, href: '/contact-us' };
    if (link.label === 'Resources') return { ...link, href: '/resources' };
    return link;
  });
  const handleNavClick = (event, href, newTab) => {
    if (event.defaultPrevented) {
      setIsMenuOpen(false);
      return;
    }
    if (newTab || /^https?:\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    event.preventDefault();
    navigate(href);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    const loadPublicSettings = () => api('/settings/public').then((result) => setManagedLinks((result.navigationLinks || []).filter((link) => link.location === 'header').map((link) => ({ label: link.label, href: link.url, newTab: link.newTab }))));
    loadPublicSettings();
    window.addEventListener('focus', loadPublicSettings);
    window.addEventListener('online', loadPublicSettings);
    return () => {
      window.removeEventListener('focus', loadPublicSettings);
      window.removeEventListener('online', loadPublicSettings);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 overflow-visible bg-transparent">
      <nav
        className="relative mx-auto mt-2 flex h-[64px] w-[calc(100%-20px)] items-center rounded-[14px] border border-[rgba(15,35,70,0.08)] bg-[rgba(255,255,255,0.42)] px-3 backdrop-blur-[30px] backdrop-saturate-150 transition-all duration-300 sm:mt-2 sm:w-[calc(100%-32px)] sm:rounded-[16px] sm:px-4 lg:mt-2 lg:w-[calc(100%-56px)] lg:max-w-[1500px] lg:rounded-[18px] lg:px-6"
        style={{ boxShadow: shellShadow }}
      >
        <a href="/" className="flex items-center gap-3" aria-label="EasyLane home">
          <img src={logo} alt="EasyLane Logo" className="h-[48px] w-[48px] object-contain sm:h-[50px] sm:w-[50px]" />
        </a>

        <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {displayLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.newTab ? '_blank' : undefined}
              rel={link.newTab ? 'noopener noreferrer' : undefined}
              className={`inline-flex items-center gap-1 text-[12px] font-bold transition-all duration-[250ms] ease-in-out hover:text-[#2563EB] ${path === link.href ? 'text-[#1260ff]' : 'text-[#071837]'}`}
              aria-current={path === link.href ? 'page' : undefined}
              onClick={(event) => handleNavClick(event, link.href, link.newTab)}
            >
              {link.label}
              <ChevronDown size={11} strokeWidth={2.5} />
            </a>
          ))}
        </div>

        <div className="ml-auto mr-6 hidden items-center lg:flex">
          <a href="/book-demo" className="inline-flex h-[37px] items-center gap-2 rounded-[7px] bg-[#ffe800] px-4 text-[10px] font-bold text-[#071837] transition-colors hover:bg-[#ffdc00]">Book a Demo <span aria-hidden="true">→</span></a>
        </div>

        <button
          type="button"
          className="ml-auto rounded-full border border-slate-200 bg-white/80 p-2 text-slate-700 shadow-sm transition-all duration-[250ms] ease-in-out lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {isMenuOpen ? (
        <div className="mx-auto mt-2 w-[calc(100%-20px)] overflow-hidden rounded-[14px] border border-[rgba(15,35,70,0.08)] bg-[rgba(255,255,255,0.48)] px-3 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_30px_rgba(15,35,70,0.08),0_2px_8px_rgba(15,35,70,0.04)] backdrop-blur-[30px] backdrop-saturate-150 lg:hidden sm:w-[calc(100%-32px)]">
          <div className="flex flex-col gap-3">
            {displayLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.newTab ? '_blank' : undefined}
              rel={link.newTab ? 'noopener noreferrer' : undefined}
              className={`rounded-xl px-3 py-2 text-sm font-medium hover:bg-slate-50 ${path === link.href ? 'bg-blue-50 text-[#1260ff]' : 'text-slate-700'}`}
              aria-current={path === link.href ? 'page' : undefined}
                onClick={(event) => handleNavClick(event, link.href, link.newTab)}
            >
              {link.label}
            </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button href="/book-demo" className="w-full justify-center bg-[#FACC15] text-[#111827] hover:bg-[#f0bf00]">Book a Demo</Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
