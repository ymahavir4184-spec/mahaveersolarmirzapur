export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-brand-primary rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading AuraSun Solar...
        </span>
      </div>
    </div>
  );
}
