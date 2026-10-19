export default function Section({
  children,
  className = "",
  variant = "white", // 'white' | 'ice' | 'navy'
  id,
  ...props
}) {
  const variantStyles = {
    white: "bg-brand-background text-brand-text",
    ice: "bg-brand-ice text-brand-text border-y border-brand-border/40",
    navy: "bg-brand-navy text-white",
  };

  return (
    <section
      id={id}
      className={`py-16 md:py-24 transition-colors ${variantStyles[variant] || variantStyles.white} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
