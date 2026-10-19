import Badge from "./Badge";

export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
  invert = false,
  className = "",
}) {
  const isCenter = align === "center";

  return (
    <div
      className={`mb-12 md:mb-16 ${
        isCenter ? "text-center max-w-3xl mx-auto" : "max-w-2xl"
      } ${className}`}
    >
      {badge && (
        <div className={`mb-4 ${isCenter ? "flex justify-center" : ""}`}>
          <Badge variant={invert ? "outline" : "primary"}>{badge}</Badge>
        </div>
      )}
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-display ${
          invert ? "text-white" : "text-brand-navy"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            invert ? "text-slate-300" : "text-brand-muted"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
