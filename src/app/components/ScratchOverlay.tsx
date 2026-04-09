import { useEffect, useRef } from "react";

export function ScratchOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const scratches: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      opacity: number;
      thickness: number;
    }> = [];

    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const length = 50 + Math.random() * 200;
      const x1 = Math.random() * canvas.width;
      const y1 = Math.random() * canvas.height;

      scratches.push({
        x1,
        y1,
        x2: x1 + Math.cos(angle) * length,
        y2: y1 + Math.sin(angle) * length,
        opacity: 0.05 + Math.random() * 0.15,
        thickness: 0.5 + Math.random() * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      scratches.forEach((scratch) => {
        ctx.beginPath();
        ctx.moveTo(scratch.x1, scratch.y1);
        ctx.lineTo(scratch.x2, scratch.y2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${scratch.opacity})`;
        ctx.lineWidth = scratch.thickness;
        ctx.stroke();
      });

      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`;
        ctx.fillRect(x, y, size, size);
      }
    };

    draw();

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const scratch = scratches[Math.floor(Math.random() * scratches.length)];
        scratch.opacity = 0.05 + Math.random() * 0.15;
      }
      draw();
    }, 2000);

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(interval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
