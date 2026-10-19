export default function Badge({
  children,
  variant = "primary",
  className = "",
  size = "md",
  icon: Icon,
}) {
  const variantStyles = {
    primary: "bg-blue-50 text-brand-primary border border-blue-200/60",
    secondary: "bg-sky-50 text-sky-700 border border-sky-200/60",
    navy: "bg-brand-navy/10 text-brand-navy border border-brand-navy/20",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    outline: "border border-brand-border text-brand-muted bg-white",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3.5 py-1 text-xs md:text-sm",
    lg: "px-4 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide uppercase ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />}
      {children}
    </span>
  );
}
