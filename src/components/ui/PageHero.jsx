import Container from "./Container";
import Breadcrumbs from "./Breadcrumbs";
import Badge from "./Badge";

export default function PageHero({
  badge,
  title,
  subtitle,
  breadcrumbs = [],
  variant = "ice", // 'ice' | 'navy' | 'white'
  children,
  className = "",
}) {
  const isNavy = variant === "navy";

  return (
    <div
      className={`relative pt-28 pb-14 sm:pt-36 sm:pb-20 border-b overflow-hidden transition-colors ${
        isNavy
          ? "bg-brand-navy text-white border-slate-800"
          : "border-blue-100/60"
      } ${className}`}
      style={
        isNavy
          ? {}
          : {
              background:
                "radial-gradient(ellipse 90% 80% at 50% -10%, rgba(0, 98, 255, 0.07) 0%, transparent 60%), linear-gradient(180deg, #eef5ff 0%, #f5f9ff 50%, #f8fbff 100%)",
            }
      }
    >
      {/* Decorative grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,98,255,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 0%, black 0%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 50% at 50% 0%, black 0%, transparent 80%)",
        }}
      />

      {isNavy && (
        <>
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(0,98,255,0.2) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 w-60 h-60 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)",
              filter: "blur(32px)",
            }}
          />
        </>
      )}

      <Container className="relative z-10">
        {breadcrumbs.length > 0 && (
          <div className="mb-5">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        <div className="max-w-3xl">
          {badge && (
            <div className="mb-4">
              <Badge variant={isNavy ? "outline" : "primary"}>{badge}</Badge>
            </div>
          )}

          <h1
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight font-display leading-[1.1] text-balance ${
              isNavy ? "text-white" : "text-brand-navy"
            }`}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className={`mt-5 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl ${
                isNavy ? "text-slate-300" : "text-brand-muted"
              }`}
            >
              {subtitle}
            </p>
          )}

          {children && <div className="mt-8">{children}</div>}
        </div>
      </Container>
    </div>
  );
}
