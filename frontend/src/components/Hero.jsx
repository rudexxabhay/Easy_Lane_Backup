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
    <section id="home" className="relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_42%,rgba(18,96,255,.08),transparent_28%),radial-gradient(circle_at_16%_28%,rgba(18,96,255,.04),transparent_24%),radial-gradient(circle_at_74%_78%,rgba(255,232,0,.05),transparent_20%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(18,96,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(18,96,255,.35)_1px,transparent_1px)] [background-size:62px_62px]"
      />
      <div className="relative mx-auto flex min-h-[590px] w-[calc(100%-24px)] max-w-[1500px] items-center px-[18px] py-8 max-md:pt-[96px] max-md:pb-8 sm:w-[calc(100%-32px)] sm:px-6 lg:min-h-[620px] lg:px-8 lg:py-9">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[44%_56%] lg:gap-7 xl:gap-9">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-[620px] max-md:max-w-full">
            <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#dbe8fb] bg-[#f3f7ff] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1260ff] shadow-[0_8px_20px_rgba(18,96,255,.06)] sm:text-[9px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1260ff]" />
              AI-ENABLED LOGISTICS PLATFORM
            </p>
            <h1 className="mt-4 max-w-[540px] text-[clamp(30px,8vw,52px)] font-extrabold leading-[1.03] tracking-[-0.055em] text-[#061638] sm:text-[clamp(35px,4vw,52px)] sm:leading-[1.02]">
              {hero?.title || 'Smarter Logistics'}
              <br />
              <span className="text-[#1558ff]">{hero?.highlightedTitle || 'Stronger Business'}</span>
            </h1>
            <p className="mt-4 max-w-[520px] text-[14px] font-medium leading-[1.68] tracking-[-.01em] text-[#53627d] sm:text-[clamp(13px,1.05vw,15px)]">
              {hero?.description || 'One intelligent platform to manage fleets, operations, finance and people, in real time.'}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2.5">
              <Button href="/book-demo" className="h-[42px] w-full rounded-[10px] px-[18px] text-[12px] sm:h-[46px] sm:w-auto">
                Book a Demo
              </Button>
              <Button href="#solutions" variant="outline" className="h-[42px] w-full rounded-[10px] border-[#2e67ff] px-[18px] text-[12px] sm:h-[46px] sm:w-auto">
                Explore Platform
              </Button>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-2.5">
              {stats.map(([value, label, Icon]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-[12px] border border-[#e6eef9] bg-white px-3 py-3 shadow-[0_10px_22px_rgba(15,23,42,.045)]"
                >
                  <Icon size={14} strokeWidth={2.1} className="text-[#1358ff]" />
                  <p className="mt-2.5 whitespace-nowrap text-[clamp(15px,1.2vw,18px)] font-extrabold tracking-[-.045em] text-[#0a1a3c]">
                    {value}
                  </p>
                  <p className="mt-0.5 whitespace-nowrap text-[9px] font-medium tracking-[-.015em] text-[#5d6b84]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative flex justify-center lg:justify-end lg:pt-6 xl:pt-8"
          >
            <HeroDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
