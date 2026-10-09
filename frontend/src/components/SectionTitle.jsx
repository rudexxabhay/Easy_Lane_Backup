const SectionTitle = ({ eyebrow, title, description, align = 'left', className = '' }) => {
  const alignmentClass = align === 'center' ? 'mx-auto text-center' : 'text-left';

  return (
    <div className={`max-w-2xl ${alignmentClass} ${className}`}>
      {eyebrow ? (
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#1260ff] sm:text-[11px]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="home-section-title__heading text-[28px] font-extrabold leading-[1.14] tracking-[-0.045em] text-inherit sm:text-[34px]">
        {title}
      </h2>
      {description ? (
        <p className="home-section-title__description mt-4 text-[12px] leading-5 text-slate-500 sm:text-[13px]">
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default SectionTitle;
