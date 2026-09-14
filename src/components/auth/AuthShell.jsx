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
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0b132b] text-white">
      {/* The original RetroToonz auth artwork is intentionally preserved. */}
      <div
        className="rt-auth-doodles pointer-events-none absolute -inset-[5%] bg-[url('/media/branding/confetti-doodles.svg')] bg-cover bg-center opacity-[0.10]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[14%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#ef476f]/16 blur-[112px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-28 bottom-[-8rem] h-[360px] w-[360px] rounded-full bg-[#6495ed]/9 blur-[112px]"
        aria-hidden="true"
      />

      <span className="rt-auth-float-a pointer-events-none absolute left-8 top-16 text-3xl text-[#ff6b6b]/65 sm:left-10 sm:top-10" aria-hidden="true">
        ▲
      </span>
      <span className="rt-auth-float-b pointer-events-none absolute bottom-20 right-10 text-2xl text-[#ffd166]/62 sm:right-20" aria-hidden="true">
        ■
      </span>
      <span className="rt-auth-float-c pointer-events-none absolute bottom-24 left-1/3 hidden text-4xl text-white/38 sm:block" aria-hidden="true">
        ~
      </span>

      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Close and return home"
        className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#11162b]/80 text-white/78 transition-colors duration-150 hover:bg-[#171d36] hover:text-white sm:right-6 sm:top-6"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={21} />
      </button>

      <main className="relative z-10 flex flex-1 items-center px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto grid w-full max-w-6xl gap-9 md:grid-cols-[minmax(0,1fr)_420px] md:items-center md:gap-14 lg:gap-20">
          <motion.section className="text-center md:pl-4 md:text-left" {...enter}>
            <Link to="/" className="inline-block text-4xl font-bold tracking-[-0.045em] text-white sm:text-5xl">
              RetroToonz
            </Link>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/62 sm:text-base md:mx-0 md:mt-4 md:text-lg md:leading-relaxed">
              Relive the magic of classic cartoons — anytime, anywhere.
            </p>
          </motion.section>

          <motion.section
            className="mx-auto w-full max-w-md rounded-[var(--rt-radius-card)] border border-white/10 bg-[#11162b]/92 p-6 text-white shadow-[0_18px_60px_rgba(0,0,0,0.24)] sm:p-8 md:max-w-none"
            {...enter}
            transition={reduceMotion ? undefined : { ...enter.transition, delay: 0.035 }}
          >
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold tracking-[-0.025em] text-white">{title}</h1>
              {subtitle && (
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/52">{subtitle}</p>
              )}
            </div>

            {children}

            {footer && <div className="mt-6 text-center text-sm text-white/56">{footer}</div>}
          </motion.section>
        </div>
      </main>

      <footer className="relative z-10 px-4 pb-5 text-center text-xs text-white/38 sm:text-sm">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
          <span>© {new Date().getFullYear()} RetroToonz</span>
          <span aria-hidden="true">·</span>
          <Link to="/about-us" className="transition-colors duration-150 hover:text-white/75">About</Link>
          <a
            href="https://buymeachai.ezee.li/Samyak005"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-white/75"
          >
            Help with chai ☕
          </a>
        </div>
      </footer>
    </div>
  );
}
