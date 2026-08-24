export default function TeacherLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="h-24 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" />

        {/* Filter bar skeleton */}
        <div className="h-16 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800" />

        {/* Score cards skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800"
            />
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="h-12 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
