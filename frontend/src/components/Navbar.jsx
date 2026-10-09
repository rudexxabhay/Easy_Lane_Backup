import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './Button.jsx';
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
        className="site-nav__bar relative mx-auto mt-2 flex items-center border border-[rgba(15,35,70,0.08)] bg-[rgba(255,255,255,0.42)] backdrop-blur-[30px] backdrop-saturate-150 transition-all duration-300"
        style={{ boxShadow: shellShadow }}
      >
        <a href="/" className="flex items-center gap-3" aria-label="EasyLane home">
          <img src="/easylane-logo.svg" alt="EasyLane Logo" className="site-nav__logo object-contain" />
        </a>

        <div className="site-nav__links hidden flex-1 items-center justify-center lg:flex">
          {displayLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.newTab ? '_blank' : undefined}
              rel={link.newTab ? 'noopener noreferrer' : undefined}
              className={`site-nav__link inline-flex items-center font-bold transition-all duration-[250ms] ease-in-out hover:text-[#2563EB] ${path === link.href ? 'text-[#1260ff]' : 'text-[#071837]'}`}
              aria-current={path === link.href ? 'page' : undefined}
              onClick={(event) => handleNavClick(event, link.href, link.newTab)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="site-nav__action ml-auto hidden items-center lg:flex">
          <a href="/book-demo" className="site-nav__cta inline-flex items-center gap-2 rounded-[7px] bg-[#ffe800] font-bold text-[#071837] transition-colors hover:bg-[#ffdc00]">Book a Demo <span aria-hidden="true">→</span></a>
        </div>

        <button
          type="button"
          className="site-nav__toggle ml-auto rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition-all duration-[250ms] ease-in-out lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {isMenuOpen ? (
        <div className="site-nav__panel mx-auto mt-2 overflow-hidden border border-[rgba(15,35,70,0.08)] bg-[rgba(255,255,255,0.48)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_30px_rgba(15,35,70,0.08),0_2px_8px_rgba(15,35,70,0.04)] backdrop-blur-[30px] backdrop-saturate-150 lg:hidden">
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
