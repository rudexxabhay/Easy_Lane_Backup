import { motion } from 'framer-motion';
import { CircleDollarSign, CircleDot, Truck, UsersRound } from 'lucide-react';
import Button from './Button.jsx';
import HeroDashboard from './HeroDashboard.jsx';

const stats = [
  ['12,000+', 'Vehicles Managed', Truck],
  ['8,500+', 'Active Trips', UsersRound],
  ['₹250Cr+', 'Invoice Volume', CircleDollarSign],
  ['99.9%', 'Tracking Accuracy', CircleDot],
];

const Hero = ({ hero }) => {
  return (
    <section id="home" className="hero-section relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_42%,rgba(18,96,255,.08),transparent_28%),radial-gradient(circle_at_16%_28%,rgba(18,96,255,.04),transparent_24%),radial-gradient(circle_at_74%_78%,rgba(255,232,0,.05),transparent_20%)]"
      />
      <div
        aria-hidden="true"
        className="hero-section__grid pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(18,96,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(18,96,255,.35)_1px,transparent_1px)]"
      />
      <div className="hero-section__shell relative mx-auto flex items-center">
        <div className="hero-section__layout grid w-full items-center">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="hero-section__copy relative z-10">
            <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#dbe8fb] bg-[#f3f7ff] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1260ff] shadow-[0_8px_20px_rgba(18,96,255,.06)] sm:text-[9px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1260ff]" />
              AI-ENABLED LOGISTICS PLATFORM
            </p>
            <h1 className="hero-section__heading mt-4 font-extrabold leading-[1.03] tracking-[-0.055em] text-[#061638]">
              {hero?.title || 'Smarter Logistics'}
              <br />
              <span className="text-[#1558ff]">{hero?.highlightedTitle || 'Stronger Business'}</span>
            </h1>
            <p className="hero-section__description mt-4 font-medium leading-[1.68] tracking-[-.01em] text-[#53627d]">
              {hero?.description || 'One intelligent platform to manage fleets, operations, finance and people, in real time.'}
            </p>
            <div className="hero-section__actions mt-5 flex flex-col sm:flex-row sm:items-center">
              <Button href="/book-demo" className="hero-section__cta w-full sm:w-auto">
                Book a Demo
              </Button>
              <Button href="/solutions" variant="outline" className="hero-section__cta hero-section__cta--secondary w-full sm:w-auto">
                Explore Platform
              </Button>
            </div>
            <div className="hero-section__stats mt-7 grid grid-cols-2 sm:grid-cols-4">
              {stats.map(([value, label, Icon]) => (
                <div
                  key={label}
                  className="hero-section__stat min-w-0 rounded-[12px] border border-[#e6eef9] bg-white shadow-[0_10px_22px_rgba(15,23,42,.045)]"
                >
                  <Icon size={14} strokeWidth={2.1} className="hero-section__stat-icon text-[#1358ff]" />
                  <p className="hero-section__stat-value mt-2.5 whitespace-nowrap font-extrabold tracking-[-.045em] text-[#0a1a3c]">
                    {value}
                  </p>
                  <p className="hero-section__stat-label mt-0.5 font-medium tracking-[-.015em] text-[#5d6b84]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="hero-section__visual relative flex justify-center lg:justify-end"
          >
            <HeroDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
