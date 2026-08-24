export default function RootLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 animate-pulse">
      {/* Navbar skeleton */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="h-14 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
      </div>

      {/* Hero skeleton */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="h-32 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" />

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-52 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
