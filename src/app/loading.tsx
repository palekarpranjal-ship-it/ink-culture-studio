/** Route-level loading skeleton shown while a segment is still resolving. */
export default function Loading() {
  return (
    <div
      className="min-h-[70vh] animate-pulse bg-[#0d0d0d] px-5 py-16 md:px-8"
      role="status"
      aria-label="Loading page"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="h-3 w-24 bg-[#f1ede4]/15" />
        <div className="mt-6 h-14 w-2/3 max-w-xl bg-[#f1ede4]/10" />
        <div className="mt-4 h-6 w-1/2 max-w-lg bg-[#f1ede4]/10" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <div className="h-56 bg-[#f1ede4]/[0.06]" />
          <div className="h-56 bg-[#f1ede4]/[0.06]" />
          <div className="h-56 bg-[#f1ede4]/[0.06]" />
        </div>
      </div>
    </div>
  );
}
