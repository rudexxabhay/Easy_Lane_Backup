import heroDashboard from '../assets/hero.webp';
import heroDashboardMobile from '../assets/hero-mobile.webp';

const HeroDashboard = () => (
  <div className="relative mx-auto w-full max-w-[860px] lg:w-[95%] lg:max-w-[800px] xl:max-w-[820px]">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-4 rounded-[40px] bg-[radial-gradient(circle_at_68%_38%,rgba(18,96,255,.12),transparent_42%)] blur-2xl"
    />
    <img
      src={heroDashboard}
      srcSet={`${heroDashboardMobile} 900w, ${heroDashboard} 1448w`}
      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 90vw, 48vw"
      alt="EasyLane Control Tower dashboard"
      fetchPriority="high"
      width="1448"
      height="1086"
      className="relative block h-auto w-full object-contain"
    />
  </div>
);

export default HeroDashboard;
