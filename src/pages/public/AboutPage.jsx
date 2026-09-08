import {
  FavouriteIcon,
  Film02Icon,
  Home01Icon,
  InstagramIcon,
  Mail01Icon,
  StarsIcon,
  Tv01Icon,
  TwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

const logoSrc = "/media/branding/retrotoonz-full.png";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-[#e2e8f0] font-sans selection:bg-[#3b82f6] selection:text-[#ffffff]">
      {/* --- Navigation --- */}
      <nav className="w-full py-6 px-4 md:px-12 flex justify-between items-center border-b border-[#1e293b]/50 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-50">
        <Link to="/">
          <div className="text-2xl md:text-4xl font-royal font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8f84c0] via-[#eba550] to-[#b7ce88] hover:opacity-80 transition-opacity">
            RetroToonz
          </div>
        </Link>

        <div className="flex items-center gap-3 md:gap-5 text-sm font-medium tracking-[0.2em] uppercase px-5">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#94a3b8] hover:text-[#60a5fa] transition-all group"
          >
            <HugeiconsIcon
              icon={Home01Icon}
              size={20}
              className="group-hover:scale-125 transition-transform"
            />
            <span className="font-semibold text-base md:text-lg">Home</span>
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative w-full pt-10 pb-16 md:pt-6 md:pb-32 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-[#020617]"></div>

        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_90%)] pointer-events-none"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#15419f] rounded-full blur-[200px] opacity-25 z-0"></div>

        <div className="relative z-10 mb-12 transform hover:scale-[1.02] transition-transform duration-1000 ease-out w-full md:w-auto">
          <img
            src={logoSrc}
            alt="RetroToonz Emblem"
            className="w-full md:w-[500px] md:rounded-2xl mx-auto drop-shadow-[0_25px_50px_rgba(29,78,216,0.35)] cursor-pointer"
          />
        </div>

        <h1 className="relative z-10 text-3xl md:text-4xl font-royal font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#d4af37] mb-8 drop-shadow-xl leading-tight">
          RESTORING <br />
          <span className="text-transparent text-4xl md:text-5xl bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#f5eea4] to-[#bf953f] drop-shadow-[0_2px_2px_rgba(191,149,63,0.4)]">
            The Golden Age
          </span>
        </h1>

        <p className="relative z-10 max-w-2xl px-8 text-base md:text-lg leading-relaxed text-slate-400 font-body font-medium tracking-wide">
          We don't just preserve the past; we remix it.{" "}
          <br className="hidden md:block" />
          Welcome to the home of nostalgia, vintage animation, and digital art
          reimagined.
        </p>
      </section>

      {/* --- The Story Section --- */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-16 md:gap-24 items-center relative">
        <div className="space-y-8 relative z-10">
          <div className="flex items-center gap-4 text-[#60a5fa] font-royal text-lg tracking-widest uppercase font-bold">
            <div className="h-[1px] w-12 bg-[#60a5fa]/50"></div>
            <span>Who We Are</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-royal font-bold leading-tight text-white">
            CLASSIC VIBES. <br />
            <span className="text-[#93c5fd] italic">MODERN SOUL.</span>
          </h2>

          <div className="space-y-6 font-body text-lg text-[#cbd5e1] leading-relaxed font-light">
            <p>
              RetroToonz was born from a love of Saturday morning cartoons,
              8-bit adventures, and the vibrant ink-and-paint aesthetic of the
              20th century. We exist to keep that spirit alive.
            </p>
          </div>
        </div>

        {/* Decorative Graphic Side */}
        <div className="relative border border-[#334155]/30 bg-[#0f172a]/30 backdrop-blur-sm p-3 rounded-tr-3xl rounded-bl-3xl shadow-[0_0_60px_-15px_rgba(30,58,138,0.2)]">
          <div className="grid grid-cols-2 gap-3 relative z-10">
            {/* VINTAGE */}
            <div className="bg-[#0b1121] hover:bg-[#111827] border border-[#1e293b] hover:border-[#60a5fa]/40 rounded-2xl flex flex-col items-center justify-center text-center gap-4 h-48 transition-all duration-500 group cursor-pointer shadow-lg">
              <HugeiconsIcon
                icon={Film02Icon}
                size={40}
                className="text-[#64748b] group-hover:text-[#93c5fd] group-hover:scale-110 transition-all duration-500"
              />
              <span className="font-royal text-lg text-[#cbd5e1] group-hover:text-white tracking-widest">
                VINTAGE
              </span>
            </div>

            {/* TOONZ */}
            <div className="bg-[#0b1121] hover:bg-[#111827] border border-[#1e293b] hover:border-[#60a5fa]/40 rounded-2xl flex flex-col items-center justify-center text-center gap-4 h-48 transition-all duration-500 group cursor-pointer shadow-lg">
              <HugeiconsIcon
                icon={Tv01Icon}
                size={34}
                className="text-[#64748b] group-hover:text-[#93c5fd] group-hover:scale-110 transition-all duration-500"
              />
              <span className="font-royal text-lg text-[#cbd5e1] group-hover:text-white tracking-widest">
                TOONZ
              </span>
            </div>

            {/* REMIX */}
            <div className="bg-[#0b1121] hover:bg-[#111827] border border-[#1e293b] hover:border-[#60a5fa]/40 rounded-2xl flex flex-col items-center justify-center text-center gap-4 h-48 transition-all duration-500 group cursor-pointer shadow-lg">
              <HugeiconsIcon
                icon={StarsIcon}
                size={34}
                className="text-[#64748b] group-hover:text-[#93c5fd] group-hover:scale-110 transition-all duration-500"
              />
              <span className="font-royal text-lg text-[#cbd5e1] group-hover:text-white tracking-widest">
                REMIX
              </span>
            </div>

            {/* NOSTALGIA */}
            <div className="bg-[#0b1121] hover:bg-[#111827] border border-[#1e293b] hover:border-[#60a5fa]/40 rounded-2xl flex flex-col items-center justify-center text-center gap-4 h-48 transition-all duration-500 group cursor-pointer shadow-lg">
              <HugeiconsIcon
                icon={FavouriteIcon}
                size={40}
                className="text-[#64748b] group-hover:text-[#93c5fd] group-hover:scale-110 transition-all duration-500"
              />
              <span className="font-royal text-lg text-[#cbd5e1] group-hover:text-white tracking-widest">
                NOSTALGIA
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- Premium Divider --- */}
      <div className="w-full flex justify-center items-center gap-6 opacity-40 py-12">
        <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-[#78abeb] to-transparent"></div>
        <HugeiconsIcon
          icon={StarsIcon}
          size={24}
          className="text-[#93c5fd] animate-pulse"
        />
        <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-[#78abeb] to-transparent"></div>
      </div>

      {/* --- Mission / Values --- */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-10 text-center">
        <h3 className="text-2xl md:text-4xl font-royal font-bold text-[#f1f5f9] mb-16 tracking-wide">
          "STAY CURIOUS.{" "}
          <span className="text-[#60a5fa]">STAY ADVENTUROUS.</span>"
        </h3>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              title: "THE LEGACY",
              desc: "Honoring the bold lines, wacky characters, and 'anything is possible' attitude of vintage animation.",
            },
            {
              title: "THE CRAFT",
              desc: "Blending old-school aesthetics with modern design tools to create something entirely unique.",
            },
            {
              title: "THE COMMUNITY",
              desc: "Building a tribe of people who still believe that cartoons are cool at any age.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0b1121] p-10 border border-[#1e293b] hover:border-[#60a5fa]/40 transition-all duration-500 rounded-lg group hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(30,58,138,0.2)]"
            >
              <h4 className="text-xl font-royal font-bold text-[#e2e8f0] mb-4 group-hover:text-[#93c5fd] transition-colors">
                {item.title}
              </h4>
              <p className="text-[#94a3b8] font-body text-sm md:text-base leading-relaxed group-hover:text-[#cbd5e1] transition-colors">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Support Section --- */}
      <section className="w-full max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-[#0b1121] border border-[#1e293b] rounded-2xl p-10 md:p-12 shadow-[0_0_60px_-20px_rgba(30,58,138,0.3)] backdrop-blur-sm">
          <h3 className="text-2xl md:text-3xl font-royal font-bold text-white mb-4">
            Enjoying RetroToonz?
          </h3>
          <p className="text-[#94a3b8] font-body mb-8 max-w-xl mx-auto">
            If this project brings back memories or makes you smile, you can
            support us with a chai ☕
          </p>
          <a
            href="https://buymeachai.ezee.li/Samyak005"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-md hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200"
          >
            <img
              src="https://buymeachai.ezee.li/assets/images/chai.png"
              alt="chai"
              className="w-7 h-7"
            />
            <span
              className="text-black text-xl"
              style={{ fontFamily: "'Cookie', cursive" }}
            >
              Buy me a chai
            </span>
          </a>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="w-full mt-20 border-t border-[#1e293b] bg-[#020617] py-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#1d4ed8] to-transparent opacity-50"></div>

        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
          <div className="text-center md:text-left">
            <h5 className="text-2xl font-royal font-bold text-[#f8fafc] tracking-widest">
              RetroToonz
            </h5>
            <p className="text-sm font-body text-[#64748b] mt-3 tracking-wide">
              © 2025 RetroToonz. All Rights Reserved.
            </p>
          </div>

          <div className="flex gap-6">
            <a
              href="#"
              className="p-3 bg-[#0f172a] border border-[#1e293b] rounded-full hover:border-[#60a5fa] hover:text-[#93c5fd] transition-all duration-300 text-[#64748b]"
            >
              <HugeiconsIcon icon={InstagramIcon} size={20} />
            </a>
            <a
              href="#"
              className="p-3 bg-[#0f172a] border border-[#1e293b] rounded-full hover:border-[#60a5fa] hover:text-[#93c5fd] transition-all duration-300 text-[#64748b]"
            >
              <HugeiconsIcon icon={TwitterIcon} size={20} />
            </a>
            <a
              href="#"
              className="p-3 bg-[#0f172a] border border-[#1e293b] rounded-full hover:border-[#60a5fa] hover:text-[#93c5fd] transition-all duration-300 text-[#64748b]"
            >
              <HugeiconsIcon icon={Mail01Icon} size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
