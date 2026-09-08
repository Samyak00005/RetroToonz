import { Delete02Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useState } from "react";
import showsData from "../../services/contentService.js";

export default function ShowsPage() {
  const initialShows = Array.isArray(showsData)
    ? showsData
    : showsData.allShows || [];

  const [shows, setShows] = useState(initialShows);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    desktopPoster: "",
    mobilePoster: "",
  });

  // Add Modal
  const handleAdd = () => {
    setEditingShow(null);
    setFormData({
      title: "",
      description: "",
      thumbnail: "",
      desktopPoster: "",
      mobilePoster: "",
    });
    setIsModalOpen(true);
  };

  // Edit Modal
  const handleEdit = (show) => {
    setEditingShow(show);
    setFormData({
      title: show.title || "",
      description: show.description || "",
      thumbnail: show.thumbnail || "",
      desktopPoster: show.desktopPoster || "",
      mobilePoster: show.mobilePoster || "",
    });
    setIsModalOpen(true);
  };

  // Handle Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Save / Update
  const handleSubmit = () => {
    if (editingShow) {
      // Update
      const updated = shows.map((s) =>
        s.id === editingShow.id ? { ...s, ...formData } : s,
      );
      setShows(updated);
    } else {
      // Create
      const newShow = {
        id: Date.now(),
        ...formData,
      };
      setShows([newShow, ...shows]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Shows</h1>
          <p className="text-sm text-gray-400">
            Manage all shows in your platform
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-[var(--rt-radius-control)] text-sm font-medium"
        >
          + Add Show
        </button>
      </div>

      {/* Table */}
      <div className="rounded-[var(--rt-radius-control)] bg-white/[0.055] border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Show</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {shows.map((show, index) => (
              <tr
                key={show.id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="px-4 py-4 text-gray-400">{index + 1}</td>

                {/* Thumbnail + Title */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={show.backdrop || "/media/defaults/image.jpg"}
                      className="w-20 h-12 object-cover rounded-[var(--rt-radius-control)] border border-white/10"
                    />
                    <span className="font-medium text-md">{show.title}</span>
                  </div>
                </td>

                {/* Description */}
                <td className="px-4 py-4 max-w-xl text-gray-400 text-sm line-clamp-2">
                  {show.description}
                </td>

                {/* Actions */}
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(show)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--rt-radius-control)] text-xs 
      bg-blue-500/10 text-blue-400 border border-blue-500/20 
      hover:bg-blue-500/20 transition"
                    >
                      <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                      Edit
                    </button>

                    {/* 🗑 Delete */}
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--rt-radius-control)] text-xs 
      bg-red-500/10 text-red-400 border border-red-500/20 
      hover:bg-red-500/20 transition"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/90 border border-white/10 rounded-[var(--rt-radius-control)] p-6 w-full max-w-lg space-y-6 shadow-xl">
            {/* Title */}
            <h2 className="text-xl font-semibold tracking-tight">
              {editingShow ? "Update Show" : "Create New Show"}
            </h2>

            {/* 🖼 THUMBNAIL UPLOAD */}

            <div>
              <p className="text-sm text-gray-400 mb-2">Desktop Poster</p>

              <div
                className="border border-dashed bg-gray-950 border-white/20 rounded-[var(--rt-radius-control)] p-4 text-center cursor-pointer hover:border-indigo-400 transition"
                onClick={() =>
                  document.getElementById("desktopPosterInput").click()
                }
              >
                {formData.desktopPoster ? (
                  <img
                    src={formData.desktopPoster}
                    alt="Desktop Poster"
                    className="w-full h-32 object-cover rounded-[var(--rt-radius-control)]"
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    Drag & drop or click to upload
                  </p>
                )}
              </div>

              <input
                id="desktopPosterInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const url = URL.createObjectURL(file);

                    setFormData({
                      ...formData,
                      desktopPoster: url,
                    });
                  }
                }}
              />
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Mobile Poster</p>

              <div
                className="border border-dashed bg-gray-950 border-white/20 rounded-[var(--rt-radius-control)] p-4 text-center cursor-pointer hover:border-indigo-400 transition"
                onClick={() =>
                  document.getElementById("mobilePosterInput").click()
                }
              >
                {formData.mobilePoster ? (
                  <img
                    src={formData.mobilePoster}
                    alt="Mobile Poster"
                    className="w-full h-32 object-cover rounded-[var(--rt-radius-control)]"
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    Drag & drop or click to upload
                  </p>
                )}
              </div>

              <input
                id="mobilePosterInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const url = URL.createObjectURL(file);

                    setFormData({
                      ...formData,
                      mobilePoster: url,
                    });
                  }
                }}
              />
            </div>

            {/* SHOW NAME */}
            <div>
              <label className="text-sm text-gray-400 block mb-1">
                Show Name
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-gray-950 border border-white/10 px-3 py-2 rounded-[var(--rt-radius-control)] text-sm focus:outline-none focus:border-indigo-500"
                placeholder="Enter show name"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm text-gray-400 block mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-950 border border-white/10 px-3 py-2 rounded-[var(--rt-radius-control)] text-sm resize-none focus:outline-none focus:border-indigo-500"
                placeholder="Enter description"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm bg-white/10 rounded-[var(--rt-radius-control)] hover:bg-white/20 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-[var(--rt-radius-control)] transition font-medium"
              >
                {editingShow ? "Update Show" : "Create Show"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
