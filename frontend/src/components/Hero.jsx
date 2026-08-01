import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CircleDollarSign, CircleDot, Truck, UsersRound } from 'lucide-react';
import Button from './Button.jsx';
import HeroDashboard from './HeroDashboard.jsx';
import { api } from '../lib/api.js';

const stats = [
  ['12,000+', 'Vehicles Managed', Truck],
  ['8,500+', 'Active Trips', UsersRound],
  ['₹250Cr+', 'Invoice Volume', CircleDollarSign],
  ['99.9%', 'Tracking Accuracy', CircleDot],
];

const Hero = () => {
  const [content, setContent] = useState(null);
  useEffect(() => { api('/content').then(setContent).catch(() => {}); }, []);
  const hero = content?.hero;
  return (
    <section id="home" className="relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_42%,rgba(18,96,255,.08),transparent_28%),radial-gradient(circle_at_16%_28%,rgba(18,96,255,.04),transparent_24%),radial-gradient(circle_at_74%_78%,rgba(255,232,0,.05),transparent_20%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(18,96,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(18,96,255,.35)_1px,transparent_1px)] [background-size:62px_62px]"
      />
      <div className="relative mx-auto flex min-h-[620px] w-[calc(100%-24px)] max-w-[1500px] items-center px-4 py-10 sm:w-[calc(100%-32px)] sm:px-6 lg:min-h-[660px] lg:px-8 lg:py-11">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[44%_56%] lg:gap-8 xl:gap-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="relative z-10 max-w-[640px]">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#dbe8fb] bg-[#f3f7ff] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1260ff] shadow-[0_8px_20px_rgba(18,96,255,.06)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1260ff]" />
              AI-ENABLED LOGISTICS PLATFORM
            </p>
            <h1 className="mt-6 max-w-[560px] text-[clamp(38px,4.4vw,58px)] font-extrabold leading-[1.05] tracking-[-0.055em] text-[#061638]">
              {hero?.title || 'Smarter Logistics'}
              <br />
              <span className="text-[#1558ff]">{hero?.highlightedTitle || 'Stronger Business'}</span>
            </h1>
            <p className="mt-5 max-w-[540px] text-[clamp(13px,1.15vw,16px)] font-medium leading-[1.8] tracking-[-.01em] text-[#53627d]">
              {hero?.description || 'One intelligent platform to manage fleets, operations, finance and people, in real time.'}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/book-demo" className="h-[46px] rounded-[10px] px-5 text-[12px] sm:h-[50px]">
                Book a Demo
              </Button>
              <Button href="#solutions" variant="outline" className="h-[46px] rounded-[10px] border-[#2e67ff] px-5 text-[12px] sm:h-[50px]">
                Explore Platform
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3">
              {stats.map(([value, label, Icon]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-[12px] border border-[#e6eef9] bg-white px-3 py-3.5 shadow-[0_10px_22px_rgba(15,23,42,.045)]"
                >
                  <Icon size={15} strokeWidth={2.1} className="text-[#1358ff]" />
                  <p className="mt-3 whitespace-nowrap text-[clamp(16px,1.4vw,20px)] font-extrabold tracking-[-.045em] text-[#0a1a3c]">
                    {value}
                  </p>
                  <p className="mt-1 whitespace-nowrap text-[10px] font-medium tracking-[-.015em] text-[#5d6b84]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.975, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center lg:justify-end lg:pt-2 xl:pt-3"
          >
            <HeroDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
