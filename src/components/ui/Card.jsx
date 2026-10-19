export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md", // 'none' | 'sm' | 'md' | 'lg'
  as: Component = "div",
  ...props
}) {
  const paddingStyles = {
    none: "p-0",
    sm: "p-4 sm:p-5",
    md: "p-6 sm:p-8",
    lg: "p-8 sm:p-10",
  };

  const hoverStyles = hover
    ? "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-slate-200/70 hover:border-blue-200/60 cursor-pointer"
    : "";

  const hasBg = className.includes("bg-");
  const hasBorder = className.includes("border-");
  const baseBg = hasBg ? "" : "bg-white";
  const baseBorder = hasBorder ? "" : "border border-slate-200/70";

  return (
    <Component
      className={`rounded-2xl shadow-sm ${baseBg} ${baseBorder} ${paddingStyles[padding] || paddingStyles.md} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
