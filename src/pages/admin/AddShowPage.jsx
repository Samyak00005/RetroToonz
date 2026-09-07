// src/pages/AddShowPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft01Icon,
  Image01Icon,
  PlayIcon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

export default function AddShowPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    language: "English",
    tags: [],
    thumbnail: null,
    thumbnailPreview: "",
    video: null,
    videoPreview: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        video: file,
        videoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = () => {
    console.log("Form Data:", form);
  };

  return (
    <div className="flex flex-col text-white">
      <Header />

      <main className="flex-grow">
        <div className="px-4 sm:px-7 md:px-10 lg:px-16 max-w-[1800px] mx-auto py-6">
          {/* 🔝 Header */}
          <div className="flex items-center gap-4 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="bg-white/5 hover:bg-white/10 p-2.5 rounded-full border border-white/10 transition"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            </button>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              Add New Show
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* 🧾 FORM */}
            <div className="order-1 lg:order-2">
              {/* Title */}
              <label className="block mb-4">
                <span className="text-lg font-semibold mb-4 block">
                  Show Title
                </span>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-[var(--rt-radius-control)] p-3 focus:outline-none focus:border-cyan-500"
                />
              </label>

              {/* Description */}
              <label className="block mb-4">
                <span className="text-lg font-semibold mb-4 block">
                  Description
                </span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-white/5 border border-white/10 rounded-[var(--rt-radius-control)] p-3 focus:outline-none focus:border-cyan-500"
                />
              </label>

              {/* Tags */}
              <div className="mb-4">
                <span className="text-lg font-semibold mb-4 block">Tags</span>

                <div className="flex flex-wrap gap-2">
                  {["Action", "Comedy", "Drama", "Sci-Fi", "Fantasy"].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setForm((prev) => {
                            const exists = prev.tags.includes(tag);
                            return {
                              ...prev,
                              tags: exists
                                ? prev.tags.filter((t) => t !== tag)
                                : [...prev.tags, tag],
                            };
                          });
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition ${
                          form.tags.includes(tag)
                            ? "bg-cyan-500 text-black"
                            : "bg-white/5 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {tag}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="mb-4">
                <span className="text-lg font-semibold mb-4 block">
                  Thumbnail
                </span>

                <label className="flex flex-col items-center justify-center h-40 border border-white/10 rounded-[var(--rt-radius-control)] cursor-pointer hover:bg-white/5 transition overflow-hidden">
                  {form.thumbnailPreview ? (
                    <img
                      src={form.thumbnailPreview}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <HugeiconsIcon icon={Upload01Icon} size={28} />
                      <span className="text-sm text-gray-400 mt-2">
                        Upload Image
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleThumbnailUpload}
                  />
                </label>
              </div>

              {/* Video Upload */}
              <div className="mb-6">
                <span className="text-lg font-semibold mb-4 block">Video</span>

                <label className="flex flex-col items-center justify-center h-40 border border-white/10 rounded-[var(--rt-radius-control)] cursor-pointer hover:bg-white/5 transition overflow-hidden">
                  {form.videoPreview ? (
                    <video
                      src={form.videoPreview}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <>
                      <HugeiconsIcon icon={Upload01Icon} size={28} />
                      <span className="text-sm text-gray-400 mt-2">
                        Upload Video
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </label>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 p-3 my-5 rounded-[var(--rt-radius-control)] font-semibold shadow-lg transition"
              >
                Add Show
              </button>
            </div>

            {/* 👁 PREVIEW */}
            <div className="order-2 lg:order-1">
              <h2 className="text-xl font-semibold mb-4">Live Preview</h2>

              <div className="rounded-[var(--rt-radius-control)] overflow-hidden bg-white/5 border border-white/10 shadow-lg">
                {/* Media */}
                <div className="relative h-48">
                  {form.thumbnailPreview ? (
                    <img
                      src={form.thumbnailPreview}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <HugeiconsIcon icon={Image01Icon} size={40} />
                    </div>
                  )}

                  <button className="absolute bottom-3 right-3 bg-cyan-500 p-3 rounded-full">
                    <HugeiconsIcon icon={PlayIcon} size={18} />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">
                    {form.title || "Untitled Show"}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {form.description || "No description yet."}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {form.tags.join(", ") || "No tags"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
