import { useState, useEffect } from "react";
import showsData from "../../services/contentService.js";

import {
  Add01Icon,
  PencilEdit01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function HomepageSectionsPage() {
  const shows = Array.isArray(showsData) ? showsData : showsData.allShows || [];

  const [collections, setCollections] = useState([
    {
      id: 1,
      name: "Trending Now",
      shows: ["Ben 10", "Doraemon", "Oggy and the Cockroaches"],
    },
    {
      id: 2,
      name: "Top Picks For You",
      shows: ["Kick Buttowski", "Kid vs Kat", "Ninja Hattori"],
    },
    {
      id: 3,
      name: "Comedy Cartoons",
      shows: ["Mr. Bean", "Oggy and the Cockroaches"],
    },
    {
      id: 4,
      name: "Action & Adventure",
      shows: ["Ben 10", "Kick Buttowski"],
    },
    {
      id: 5,
      name: "Kids Favorites",
      shows: ["Chhota Bheem", "Doraemon", "Kiteretsu"],
    },
    {
      id: 6,
      name: "Nostalgia Zone",
      shows: ["Ben 10", "Doraemon", "Mr. Bean"],
    },
    {
      id: 7,
      name: "Recently Added",
      shows: ["Ninja Hattori", "Kiteretsu"],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    selectedShows: [],
  });

  // 🔒 Lock scroll
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  // ➕ Add
  const handleAdd = () => {
    setEditingCollection(null);
    setFormData({ name: "", selectedShows: [] });
    setIsModalOpen(true);
  };

  // ✏️ Edit
  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      selectedShows: collection.shows,
    });
    setIsModalOpen(true);
  };

  // 🗑 Delete
  const handleDelete = (id) => {
    setCollections(collections.filter((c) => c.id !== id));
  };

  // 🔄 Multi-select toggle
  const toggleShow = (title) => {
    setFormData((prev) => ({
      ...prev,
      selectedShows: prev.selectedShows.includes(title)
        ? prev.selectedShows.filter((s) => s !== title)
        : [...prev.selectedShows, title],
    }));
  };

  // ✅ Submit
  const handleSubmit = () => {
    if (editingCollection) {
      setCollections(
        collections.map((c) =>
          c.id === editingCollection.id
            ? { ...c, name: formData.name, shows: formData.selectedShows }
            : c,
        ),
      );
    } else {
      setCollections([
        {
          id: Date.now(),
          name: formData.name,
          shows: formData.selectedShows,
        },
        ...collections,
      ]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-white">
      {/* 🔥 Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Collections</h1>
          <p className="text-sm text-gray-400">Manage homepage sections</p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-[var(--rt-radius-control)] text-sm"
        >
          <HugeiconsIcon icon={Add01Icon} size={16} />
          New Collection
        </button>
      </div>

      {/* 📊 Count */}
      <div className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-[var(--rt-radius-control)] w-fit">
        Total Collections: {collections.length}
      </div>

      {/* 📋 Table */}
      <div className="rounded-[var(--rt-radius-control)] bg-white/[0.055] border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Collection</th>
              <th className="px-4 py-3 text-left">Shows</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {collections.map((c, index) => (
              <tr
                key={c.id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="px-4 py-4 text-gray-400">{index + 1}</td>

                <td className="px-4 py-4 font-medium text-indigo-300">
                  {c.name}
                </td>

                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1 text-sm text-gray-300">
                    {c.shows.length === 0 ? (
                      <span className="text-gray-500 text-xs">No shows</span>
                    ) : (
                      c.shows.map((show, index) => (
                        <span key={index} className="truncate">
                          {show}
                        </span>
                      ))
                    )}
                  </div>
                </td>

                <td className="px-4 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--rt-radius-control)] text-xs 
                      bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--rt-radius-control)] text-xs 
                      bg-red-500/10 text-red-400 border border-red-500/20"
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

      {/* 🔥 MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-[#0B0F19] border border-white/10 rounded-[var(--rt-radius-control)] p-6 w-full max-w-lg space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold">
              {editingCollection ? "Update Collection" : "Create Collection"}
            </h2>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Collection Name</label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 px-3 py-2 rounded-[var(--rt-radius-control)] text-sm"
              />
            </div>

            {/* 🔥 Multi Select */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-400">Select Shows</label>

                {formData.selectedShows.length > 0 && (
                  <button
                    onClick={() =>
                      setFormData({ ...formData, selectedShows: [] })
                    }
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Clear
                  </button>
                )}
              </div>

              {formData.selectedShows.length > 0 && (
                <p className="text-xs text-gray-500 mb-2">
                  {formData.selectedShows.length} selected
                </p>
              )}

              <div className="max-h-44 overflow-y-auto space-y-2">
                {shows.map((show) => (
                  <div
                    key={show.id}
                    onClick={() => toggleShow(show.title)}
                    className={`px-3 py-2 rounded-[var(--rt-radius-control)] cursor-pointer text-sm border flex justify-between items-center ${
                      formData.selectedShows.includes(show.title)
                        ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {show.title}

                    {formData.selectedShows.includes(show.title) && (
                      <span className="text-xs">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white/5 border border-white/10 rounded-[var(--rt-radius-control)] p-4">
              <p className="text-xs text-gray-400 mb-2">Preview</p>

              <p className="text-sm font-medium text-indigo-300">
                {formData.name || "Collection Name"}
              </p>

              <p className="text-xs text-gray-400">
                {formData.selectedShows.length > 0
                  ? `${formData.selectedShows.length} shows selected`
                  : "No shows selected"}
              </p>
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
                {editingCollection ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
