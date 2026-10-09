const FeatureCard = ({ title, description, icon: Icon }) => {
  return (
    <article className="feature-card border-t border-white/15 pt-5 text-white first:border-t-0 sm:first:pt-0">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#1260ff]/60 bg-[#1260ff]/10 text-[#5b8aff] shadow-[0_0_22px_rgba(18,96,255,.18)]">
        <Icon size={19} />
      </div>
      <h3 className="mt-4 text-[13px] font-bold">{title}</h3>
      <p className="mt-2 text-[11px] leading-[1.65] text-white/65">{description}</p>
    </article>
  );
};

export default FeatureCard;
