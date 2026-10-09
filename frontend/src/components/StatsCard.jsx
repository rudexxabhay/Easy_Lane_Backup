import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value, className = '' }) => {
  return (
    <motion.div
      className={`stats-card rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${className}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#2563EB]/10 text-[#2563EB]">
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
