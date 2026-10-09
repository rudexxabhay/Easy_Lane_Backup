import { motion } from 'framer-motion';

const FloatingCard = ({ icon: Icon, title, value, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`floating-card absolute min-w-0 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-[0_18px_40px_rgba(17,24,39,0.12)] backdrop-blur-md ${className}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0057FF]/10 text-[#0057FF]">
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</p>
          <p className="text-sm font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FloatingCard;
