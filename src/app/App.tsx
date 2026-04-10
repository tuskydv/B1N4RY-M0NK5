import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AsciiImageBackground } from "./components/AsciiImageBackground";
import { ScratchOverlay } from "./components/ScratchOverlay";
import { CursorEffect } from "./components/CursorEffect";

const hexValues = [
  { value: "0x4E4F4E45", x: 12, y: 15, delay: 0.5 },
  { value: "0x57494E", x: 78, y: 22, delay: 1.0 },
  { value: "0xDEADBEEF", x: 25, y: 65, delay: 0.8 },
  { value: "0x1337", x: 85, y: 75, delay: 1.2 },
  { value: "0xCAFEBABE", x: 45, y: 35, delay: 0.6 },
  { value: "0xFACEFEED", x: 65, y: 50, delay: 1.4 },
  { value: "0x8BADF00D", x: 18, y: 80, delay: 0.9 },
  { value: "0xBAADF00D", x: 72, y: 12, delay: 1.1 },
];

const teamNames = [
  "B1N4RY\nM0NK5",
  "N1RV4N4",
  "R00T_M0NK",
  "SH4D0W",
  "S1L3NT_0N3",
  "V01D_S4GE",
  "3V1L\nM0NK5",
  "3V1L_M0NK5",
];

export default function App() {
  const [glitch, setGlitch] = useState(false);
  const [nameIndex, setNameIndex] = useState(0);
  const [nameGlitch, setNameGlitch] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setNameGlitch(true);

        setTimeout(() => {
          setNameIndex((prev) => (prev + 1) % teamNames.length);
        }, 150);

        setTimeout(() => {
          setNameGlitch(false);
        }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleJoinClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsRedirecting(true);

    setTimeout(() => {
      window.open("https://forms.gle/Cfe4s8UEx6GUc2nW9", "_blank");
      setTimeout(() => setIsRedirecting(false), 500);
    }, 1500);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a0f] font-mono">
      {/* Custom cursor style */}
      <style>{`
        * {
          cursor: crosshair !important;
        }
        body {
          cursor: crosshair !important;
        }
      `}</style>

      {/* Cursor effect */}
      <CursorEffect />

      {/* Background layers */}
      <AsciiImageBackground />
      <ScratchOverlay />

      {/* Hex scatter background */}
      <div className="absolute inset-0 pointer-events-none">
        {hexValues.map((hex, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.06 }}
            transition={{ delay: hex.delay, duration: 1.5 }}
            className="absolute text-white whitespace-nowrap"
            style={{
              left: `${hex.x}%`,
              top: `${hex.y}%`,
              fontSize: "clamp(0.7rem, 1.5vw, 1rem)",
            }}
          >
            {hex.value}
          </motion.div>
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(white 1px, transparent 1px),
            linear-gradient(90deg, white 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Top area - Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-8 left-8 md:top-12 md:left-16 z-10"
      >
        <motion.h1
          animate={{
            opacity: (glitch || nameGlitch) ? 0.5 : 1,
            x: (glitch || nameGlitch) ? (nameGlitch ? Math.random() * 10 - 5 : 2) : 0,
            y: nameGlitch ? Math.random() * 6 - 3 : 0,
            filter: nameGlitch ? `hue-rotate(${Math.random() * 360}deg) saturate(3)` : "none",
          }}
          transition={{ duration: 0.05 }}
          className="text-[clamp(2.5rem,8vw,6rem)] tracking-tighter leading-none text-white whitespace-pre-line"
          style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700 }}
        >
          {teamNames[nameIndex]}
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-1 text-[clamp(0.65rem,1vw,0.8rem)] font-bold text-[#ffffff]"
        >
          EST. 2026
        </motion.div>
      </motion.div>

      {/* Top right - CTFtime logo */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-8 right-8 md:top-12 md:right-16 z-10"
      >
        <a
          href="https://ctftime.org/team/431734"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-70 transition-opacity"
        >
          <img
            src="https://ctftime.org/static/images/ct/logo.svg"
            alt="CTFtime"
            className="h-8 md:h-10 w-auto"
          />
        </a>
      </motion.div>


      {/* Bottom left - Join button and About button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-8 left-8 md:bottom-12 md:left-16 z-10 flex items-end gap-4"
      >
        <a
          href="https://forms.gle/Cfe4s8UEx6GUc2nW9"
          onClick={handleJoinClick}
          className="block border-2 border-white px-6 py-3 font-mono text-white text-[clamp(0.75rem,1vw,0.9rem)] hover:bg-white hover:text-black transition-all duration-300 tracking-tight cursor-pointer"
        >
          Join Recruitment CTF
        </a>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={() => setShowAbout(true)}
          className="block border-2 border-white px-6 py-3 font-mono text-white text-[clamp(0.75rem,1vw,0.9rem)] hover:bg-white hover:text-black transition-all duration-300 tracking-tight cursor-pointer"
        >
          About
        </motion.button>
      </motion.div>

      {/* Bottom right - Function calls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-8 right-8 md:bottom-12 md:right-16 z-10 text-white font-mono text-left"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-[clamp(0.75rem,1.1vw,0.95rem)] mb-2"
        >
          while alive:
        </motion.div>
        {[
          { func: "meditate()", indent: "    " },
          { func: "crack()", indent: "    " },
          { func: "leave_no_trace()", indent: "    " }
        ].map((item, i) => (
          <motion.div
            key={item.func}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.15 }}
            className="text-[clamp(0.75rem,1.1vw,0.95rem)]"
          >
            {item.indent}{item.func}
          </motion.div>
        ))}
      </motion.div>

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)",
        }}
      />

      {/* Redirecting Overlay */}
      {isRedirecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <motion.div
              animate={{
                opacity: [1, 0.5, 1],
                x: [0, -5, 5, 0],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="text-white font-mono text-[clamp(1.5rem,4vw,3rem)] tracking-tight"
            >
              REDIRECTING...
            </motion.div>
            <motion.div
              className="mt-6 flex justify-center gap-2"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 bg-white"
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* About Sliding Panel */}
      <AnimatePresence>
        {showAbout && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAbout(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            {/* Sliding Box */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
              className="fixed left-0 top-0 h-full w-full md:w-[600px] z-50 bg-black border-r-2 border-white overflow-y-auto scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {/* Close Button */}
              <button
                onClick={() => setShowAbout(false)}
                className="absolute top-8 right-8 text-white hover:text-white/70 transition-colors text-2xl font-mono"
              >
                ×
              </button>

              {/* Content */}
              <div className="p-8 md:p-12">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[clamp(2rem,5vw,3rem)] font-bold text-white font-mono tracking-tight mb-8"
                >
                  B1N4RY M0NK5
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  {/* Mission */}
                  <div className="border-l-2 border-white pl-4">
                    <h3 className="text-white text-[clamp(1rem,1.5vw,1.2rem)] font-bold mb-2 font-mono">
                      MISSION
                    </h3>
                    <p className="text-white/70 text-[clamp(0.85rem,1vw,0.95rem)] font-mono leading-relaxed">
                      We combine monastic discipline with binary precision. Through meditation,
                      exploitation, and stealth, we pursue mastery in cybersecurity challenges.
                    </p>
                  </div>

                  {/* CTF Team */}
                  <div className="border-l-2 border-white pl-4">
                    <h3 className="text-white text-[clamp(1rem,1.5vw,1.2rem)] font-bold mb-2 font-mono">
                      CTF TEAM
                    </h3>
                    <p className="text-white/70 text-[clamp(0.85rem,1vw,0.95rem)] font-mono leading-relaxed">
                      Competitive CTF team participating in global cybersecurity competitions.
                      We tackle challenges in web exploitation, cryptography, reverse engineering,
                      binary exploitation, and forensics.
                    </p>
                  </div>

                  {/* Training */}
                  <div className="border-l-2 border-white pl-4">
                    <h3 className="text-white text-[clamp(1rem,1.5vw,1.2rem)] font-bold mb-2 font-mono">
                      TRAINING
                    </h3>
                    <p className="text-white/70 text-[clamp(0.85rem,1vw,0.95rem)] font-mono leading-relaxed">
                      Structured learning path for aspiring hackers. Master fundamentals through
                      guided challenges, mentorship, and hands-on practice in a supportive community.
                    </p>
                  </div>

                  {/* Research */}
                  <div className="border-l-2 border-white pl-4">
                    <h3 className="text-white text-[clamp(1rem,1.5vw,1.2rem)] font-bold mb-2 font-mono">
                      RESEARCH
                    </h3>
                    <p className="text-white/70 text-[clamp(0.85rem,1vw,0.95rem)] font-mono leading-relaxed">
                      Deep-dive security research and vulnerability analysis. Pushing boundaries
                      in exploitation techniques and contributing to the cybersecurity community.
                    </p>
                  </div>

                  {/* Recruitment CTF */}
                  <div className="border-l-2 border-white pl-4">
                    <h3 className="text-white text-[clamp(1rem,1.5vw,1.2rem)] font-bold mb-2 font-mono">
                      RECRUITMENT CTF
                    </h3>
                    <p className="text-white/70 text-[clamp(0.85rem,1vw,0.95rem)] font-mono leading-relaxed">
                      Aspiring hackers interested in joining our team can participate in our recruitment CTF.
                      Show your skills and join us on the path to mastery.
                    </p>
                  </div>

                  {/* Contact and Social */}
                  <div className="border-l-2 border-white pl-4 mt-8 pt-8">
                    <h3 className="text-white text-[clamp(1rem,1.5vw,1.2rem)] font-bold mb-4 font-mono">
                      CONNECT
                    </h3>
                    <div className="flex gap-4">
                      <a
                        href="https://ctftime.org/team/431734"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white transition-colors text-[clamp(0.85rem,1vw,0.95rem)] font-mono"
                      >
                        CTFtime
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}