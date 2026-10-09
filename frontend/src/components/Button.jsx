import { ArrowRight } from 'lucide-react';

const Button = ({ children, variant = 'primary', className = '', href = '#', ...props }) => {
  const baseClasses = 'inline-flex h-14 max-w-full min-w-0 items-center justify-center gap-2 rounded-[8px] px-[clamp(1rem,2vw,2rem)] text-sm font-bold transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1260ff] focus-visible:ring-offset-2';
  const variants = {
    primary: 'bg-[#ffe800] text-black hover:bg-[#ffdc00] border-none',
    secondary: 'border border-white/80 bg-white/10 text-white backdrop-blur-sm',
    light: 'bg-white text-[#2563EB] border border-gray-100',
    outline: 'border border-[#2563EB] bg-white text-[#2563EB]',
  };

  return (
    <a
      href={href}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="min-w-0">{children}</span>
      <ArrowRight size={16} className="shrink-0" />
    </a>
  );
};

export default Button;
