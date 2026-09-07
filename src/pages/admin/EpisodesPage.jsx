import { useState, useEffect } from "react";
import showsData from "../../services/contentService.js";

import {
  PencilEdit01Icon,
  Delete02Icon,
  Add01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function EpisodesPage() {
  const shows = Array.isArray(showsData) ? showsData : showsData.allShows || [];

  // Extract episodes from shows
  const initialEpisodes = shows.flatMap((show) =>
    (show.seasons || []).flatMap((season) =>
      (season.episodes || []).map((ep, index) => ({
        id: ep.episodeId || `${show.id}-${season.seasonNumber}-${index}`,
        showId: show.id,
        showTitle: show.title,
        season: season.seasonNumber,
        episode: ep.episodeNumber,
        title: ep.title,
      })),
    ),
  );

  const [episodes, setEpisodes] = useState(initialEpisodes);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);

  const [formData, setFormData] = useState({
    showId: "",
    showTitle: "",
    season: "",
    episode: "",
    title: "",
    video: "",
  });

  const [showDropdownOpen, setShowDropdownOpen] = useState(false);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = () => setShowDropdownOpen(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Search filter
  const filteredEpisodes = episodes.filter((ep) =>
    `${ep.title} ${ep.showTitle}`.toLowerCase().includes(search.toLowerCase()),
  );

  // Add
  const handleAdd = () => {
    setEditingEpisode(null);
    setFormData({
      showId: "",
      showTitle: "",
      season: "",
      episode: "",
      title: "",
      video: "",
    });
    setIsModalOpen(true);
  };

  // Edit
  const handleEdit = (ep) => {
    setEditingEpisode(ep);

    setFormData({
      showId: ep.showId || "",
      showTitle: ep.showTitle || "",
      season: ep.season || "",
      episode: ep.episode || "",
      title: ep.title || "",
      video: ep.video || "",
    });

    setIsModalOpen(true);
  };

  // Delete
  const handleDelete = (id) => {
    setEpisodes(episodes.filter((e) => e.id !== id));
  };

  // Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  // Submit
  const handleSubmit = () => {
    if (editingEpisode) {
      setEpisodes(
        episodes.map((e) =>
          e.id === editingEpisode.id ? { ...e, ...formData } : e,
        ),
      );
    } else {
      setEpisodes([{ id: Date.now(), ...formData }, ...episodes]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-white">
      {/* 🔥 Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Episodes</h1>
          <p className="text-sm text-gray-400">Manage all episodes</p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-[var(--rt-radius-control)] text-sm"
        >
          <HugeiconsIcon icon={Add01Icon} size={16} />
          Add Episode
        </button>
      </div>

      {/* 🔍 Search + Count */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by show or episode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/[0.055] border border-white/10 px-3 py-2 rounded-[var(--rt-radius-control)] text-sm w-72 focus:outline-none focus:border-indigo-500"
        />

        <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-[var(--rt-radius-control)]">
          Total: {filteredEpisodes.length}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-[var(--rt-radius-control)] bg-white/[0.055] border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Show</th>
              <th className="px-4 py-3 text-left">Season</th>
              <th className="px-4 py-3 text-left">Episode</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEpisodes.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No episodes found
                </td>
              </tr>
            ) : (
              filteredEpisodes.map((ep, index) => (
                <tr
                  key={ep.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-4 text-gray-400">{index + 1}</td>

                  <td className="px-4 py-4 font-medium text-indigo-300">
                    {ep.showTitle}
                  </td>

                  <td className="px-4 py-4">S{ep.season}</td>

                  <td className="px-4 py-4">E{ep.episode}</td>

                  <td className="px-4 py-4">{ep.title}</td>

                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(ep)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--rt-radius-control)] text-xs 
                        bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
                      >
                        <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(ep.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--rt-radius-control)] text-xs 
                        bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-[#0B0F19] border border-white/10 rounded-[var(--rt-radius-control)] p-6 w-full max-w-lg space-y-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold">
              {editingEpisode ? "Update Episode" : "Create Episode"}
            </h2>

            {/* 🎬 Custom Dropdown */}
            <div className="relative">
              <label className="text-xs text-gray-400 mb-1 block">Show</label>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdownOpen(!showDropdownOpen);
                }}
                className="w-full bg-white/5 border border-white/10 px-3 py-2 rounded-[var(--rt-radius-control)] text-sm cursor-pointer flex justify-between"
              >
                {formData.showTitle || "Select show"}
                <span className="text-xs text-gray-500">▼</span>
              </div>

              {showDropdownOpen && (
                <div className="absolute w-full mt-2 bg-[#0B0F19] border border-white/10 rounded-[var(--rt-radius-control)] max-h-48 overflow-y-auto z-50">
                  {shows.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          showId: s.id,
                          showTitle: s.title,
                        });
                        setShowDropdownOpen(false);
                      }}
                      className="px-3 py-2 text-sm hover:bg-indigo-500/10 cursor-pointer"
                    >
                      {s.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Season + Episode */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Season</label>
                <input
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  className="w-full bg-white/5 border border-white/10 px-3 py-2 rounded-[var(--rt-radius-control)] text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400">Episode</label>
                <input
                  name="episode"
                  value={formData.episode}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  className="w-full bg-white/5 border border-white/10 px-3 py-2 rounded-[var(--rt-radius-control)] text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Episode Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter episode title"
                className="w-full bg-white/5 border border-white/10 px-3 py-2 rounded-[var(--rt-radius-control)] text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">Episode Video</p>

              <div
                className="border border-dashed bg-white/5 border-white/10 rounded-[var(--rt-radius-control)] p-4 text-center cursor-pointer hover:border-indigo-500 transition"
                onClick={() =>
                  document.getElementById("episodeVideoInput").click()
                }
              >
                {formData.video ? (
                  <video
                    src={formData.video}
                    className="w-full h-40 rounded-[var(--rt-radius-control)] object-cover"
                    controls
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    Drag & drop or click to upload episode
                  </p>
                )}
              </div>

              <input
                id="episodeVideoInput"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file) {
                    const url = URL.createObjectURL(file);

                    setFormData({
                      ...formData,
                      video: url,
                    });
                  }
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white/10 rounded-[var(--rt-radius-control)] text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 rounded-[var(--rt-radius-control)] text-sm"
              >
                {editingEpisode ? "Update Episode" : "Create Episode"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
