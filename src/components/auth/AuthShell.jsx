import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function AuthShell({ title, subtitle, children, footer }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0b132b] text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/media/branding/confetti-doodles.svg')] bg-cover bg-center opacity-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[18%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#ef476f]/20 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-28 bottom-[-8rem] h-[360px] w-[360px] rounded-full bg-[#6495ed]/10 blur-[120px]"
        aria-hidden="true"
      />

      <span
        className="pointer-events-none absolute left-8 top-16 text-3xl text-[#ff6b6b]/75 sm:left-10 sm:top-10"
        aria-hidden="true"
      >
        ▲
      </span>
      <span
        className="pointer-events-none absolute bottom-20 right-10 text-2xl text-[#ffd166]/70 sm:right-20"
        aria-hidden="true"
      >
        ■
      </span>
      <span
        className="pointer-events-none absolute bottom-24 left-1/3 hidden text-4xl text-white/50 sm:block"
        aria-hidden="true"
      >
        ~
      </span>

      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Close and return home"
        className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-colors duration-150 hover:bg-white/12 sm:right-6 sm:top-6 sm:h-12 sm:w-12"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={22} />
      </button>

      <main className="relative z-10 flex flex-1 items-center px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-[1fr_420px] md:items-center md:gap-14 lg:gap-20">
          <motion.section
            className="text-center text-gray-100 md:pl-4 md:text-left"
            {...enter}
          >
            <h1 className="text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
              RetroToonz
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-300 sm:text-base md:mx-0 md:mt-4 md:text-lg md:leading-relaxed">
              Relive the magic of classic cartoons — anytime, anywhere.
            </p>
          </motion.section>

          <motion.section
            className="mx-auto w-full max-w-md rounded-[var(--rt-radius-control)] border border-white/10 bg-[#1b1f3a]/20 p-6 text-white shadow-[0_8px_28px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8 md:max-w-none"
            {...enter}
            transition={reduceMotion ? undefined : { ...enter.transition, delay: 0.04 }}
          >
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-emerald-100">{title}</h2>
              {subtitle && (
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-300/75">
                  {subtitle}
                </p>
              )}
            </div>

            {children}

            {footer && (
              <div className="mt-6 text-center text-sm text-gray-300">{footer}</div>
            )}
          </motion.section>
        </div>
      </main>

      <footer className="relative z-10 px-4 pb-5 text-center text-xs text-gray-400/70 sm:text-sm">
        <p>
          © {new Date().getFullYear()} {" "}
          <span className="font-semibold text-[#ffd166]">RetroToonz</span>. All rights reserved.
        </p>
        <div className="mt-1 flex justify-center gap-4 text-gray-500">
          <Link to="/about-us" className="transition-colors duration-150 hover:text-[#ffd166]">
            About RetroToonz
          </Link>
          <a
            href="https://buymeachai.ezee.li/Samyak005"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-white"
          >
            Help with chai ☕
          </a>
        </div>
      </footer>
    </div>
  );
}
