import heroDashboard from '../assets/hero.png';

const HeroDashboard = () => (
  <div className="relative mx-auto w-full max-w-[860px]">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-4 rounded-[40px] bg-[radial-gradient(circle_at_68%_38%,rgba(18,96,255,.12),transparent_42%)] blur-2xl"
    />
    <img
      src={heroDashboard}
      alt="EasyLane Control Tower dashboard"
      className="relative block h-auto w-full object-contain"
    />
  </div>
);

export default HeroDashboard;
