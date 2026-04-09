import { useEffect, useState } from "react";
import { motion } from "motion/react";
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
];

export default function App() {
  const [glitch, setGlitch] = useState(false);
  const [nameIndex, setNameIndex] = useState(0);
  const [nameGlitch, setNameGlitch] = useState(false);

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

      {/* Top right - CTFtime link */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-8 right-8 md:top-12 md:right-16 z-10"
      >
        <div className="bg-white text-black px-4 py-2 font-mono text-[clamp(0.75rem,1vw,0.9rem)] tracking-tight">
          <a
            href="https://ctftime.org/team/431734"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            @ctftime
          </a>
        </div>
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
    </div>
  );
}