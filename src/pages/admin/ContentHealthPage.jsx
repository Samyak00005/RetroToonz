import showsData from "../../services/contentService.js";

export default function ContentHealthPage() {
  const shows = Array.isArray(showsData)
    ? showsData
    : Array.isArray(showsData.allShows)
      ? showsData.allShows
      : [];

  // 🔍 Checks
  const missingThumbnails = shows.filter((show) => !show.thumbnail);
  const noEpisodes = shows.filter(
    (show) => !show.episodes || show.episodes.length === 0,
  );

  return (
    <div className="space-y-6 text-white">
      {/* 🔥 Header */}
      <div>
        <h1 className="text-2xl font-semibold">Content Health</h1>
        <p className="text-sm text-gray-400">
          Monitor issues in your content library
        </p>
      </div>

      {/* 📊 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/[0.055] border border-white/10 rounded-[var(--rt-radius-control)] p-4">
          <p className="text-sm text-gray-400">Missing Thumbnails</p>
          <h2 className="text-xl font-semibold mt-1 text-red-400">
            {missingThumbnails.length}
          </h2>
        </div>

        <div className="bg-white/[0.055] border border-white/10 rounded-[var(--rt-radius-control)] p-4">
          <p className="text-sm text-gray-400">No Episodes</p>
          <h2 className="text-xl font-semibold mt-1 text-yellow-400">
            {noEpisodes.length}
          </h2>
        </div>
      </div>

      {/* 🔴 Missing Thumbnails Table */}
      <div className="rounded-[var(--rt-radius-control)] bg-white/[0.055] border border-white/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="text-sm font-medium text-red-400">
            Shows Missing Thumbnails
          </h2>
        </div>

        {missingThumbnails.length === 0 ? (
          <div className="p-6 text-gray-400 text-sm">No issues found ✅</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Show</th>
              </tr>
            </thead>

            <tbody>
              {missingThumbnails.map((show, index) => (
                <tr
                  key={show.id || index}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{show.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🟡 No Episodes Table */}
      <div className="rounded-[var(--rt-radius-control)] bg-white/[0.055] border border-white/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="text-sm font-medium text-yellow-400">
            Shows Without Episodes
          </h2>
        </div>

        {noEpisodes.length === 0 ? (
          <div className="p-6 text-gray-400 text-sm">No issues found ✅</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">Show</th>
              </tr>
            </thead>

            <tbody>
              {noEpisodes.map((show, index) => (
                <tr
                  key={show.id || index}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-5 py-3 text-gray-400">{index + 1}</td>
                  <td className="px-5 py-3 font-medium">{show.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
