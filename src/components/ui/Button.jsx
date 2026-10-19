import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary", // 'primary' | 'secondary' | 'ghost' | 'outline' | 'white'
  size = "md", // 'sm' | 'md' | 'lg'
  href,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  icon: Icon,
  iconPosition = "left",
  external = false,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 min-h-[44px] min-w-[44px] active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-brand-primary text-white hover:bg-brand-primary-dark shadow-sm hover:shadow-md active:bg-brand-primary-dark disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed",
    secondary:
      "bg-brand-ice text-brand-primary hover:bg-blue-100/80 border border-blue-200/80 disabled:opacity-60 disabled:cursor-not-allowed",
    ghost:
      "bg-transparent text-brand-navy hover:bg-slate-100 hover:text-brand-primary disabled:opacity-50 disabled:cursor-not-allowed",
    outline:
      "bg-transparent border border-brand-border text-brand-navy hover:border-brand-primary hover:text-brand-primary hover:bg-blue-50/40 disabled:opacity-50 disabled:cursor-not-allowed",
    white:
      "bg-white text-brand-primary hover:bg-slate-50 shadow-sm hover:shadow border border-slate-200/60 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-xs md:text-sm gap-1.5",
    md: "px-6 py-2.5 text-sm md:text-base gap-2",
    lg: "px-8 py-3.5 text-base md:text-lg gap-2.5 font-bold",
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`;

  const content = (
    <>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" aria-hidden="true" />
      ) : Icon && iconPosition === "left" ? (
        <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      ) : null}
      <span>{children}</span>
      {!loading && Icon && iconPosition === "right" && (
        <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      )}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
          {...props}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  );
}
