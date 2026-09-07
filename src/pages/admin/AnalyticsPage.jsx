export default function AnalyticsPage() {
  return (
    <div className="space-y-6 text-white">
      {/* 🔥 Header */}
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-gray-400">
          Track platform performance and growth
        </p>
      </div>

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Views", value: "89,200", change: "+18%" },
          { label: "Users", value: "12,430", change: "+12%" },
          { label: "Shows", value: "120", change: "+3%" },
          { label: "Episodes", value: "1,240", change: "+24%" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white/[0.055] border border-white/10 rounded-[var(--rt-radius-control)] p-4 hover:bg-white/5 transition"
          >
            <p className="text-xs text-gray-400">{item.label}</p>
            <h2 className="text-xl font-semibold mt-1">{item.value}</h2>
            <p className="text-green-400 text-xs mt-1">{item.change}</p>
          </div>
        ))}
      </div>

      {/* 📈 Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64 rounded-[var(--rt-radius-control)] bg-white/[0.055] border border-white/10 flex items-center justify-center text-gray-400">
          Traffic Chart Coming Soon 📊
        </div>

        <div className="h-64 rounded-[var(--rt-radius-control)] bg-white/[0.055] border border-white/10 flex items-center justify-center text-gray-400">
          User Growth Chart Coming Soon 📈
        </div>
      </div>

      {/* 🏆 Top Shows Table */}
      <div className="rounded-[var(--rt-radius-control)] bg-white/[0.055] border border-white/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="text-sm font-medium">Top Performing Shows</h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="text-left px-4 py-3">Show</th>
              <th className="text-left px-4 py-3">Views</th>
              <th className="text-left px-4 py-3">Growth</th>
            </tr>
          </thead>

          <tbody>
            {[
              { name: "Ben 10", views: "12,000", growth: "+12%" },
              { name: "Doraemon", views: "9,500", growth: "+8%" },
              { name: "Mr. Bean", views: "8,200", growth: "+6%" },
            ].map((show, i) => (
              <tr key={i} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-3">{show.name}</td>
                <td className="px-4 py-3">{show.views}</td>
                <td className="px-4 py-3 text-green-400">{show.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
