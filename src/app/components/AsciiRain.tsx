import { useEffect, useRef } from "react";

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  opacity: number;
}

export function AsciiRain() {
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

    const chars = "01";
    const hexChars = "0123456789ABCDEF";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
    const allChars = chars + hexChars + symbols;

    const fontSize = 14;
    const columnWidth = fontSize;
    const numColumns = Math.floor(canvas.width / columnWidth);

    const columns: Column[] = [];
    for (let i = 0; i < numColumns; i++) {
      if (Math.random() > 0.7) {
        columns.push({
          x: i * columnWidth,
          y: Math.random() * -canvas.height,
          speed: 1 + Math.random() * 2,
          chars: Array(30)
            .fill(0)
            .map(() => allChars[Math.floor(Math.random() * allChars.length)]),
          opacity: 0.3 + Math.random() * 0.4,
        });
      }
    }

    const animate = () => {
      ctx.fillStyle = "rgba(10, 10, 15, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      columns.forEach((column) => {
        column.chars.forEach((char, idx) => {
          const y = column.y + idx * fontSize;

          if (y > 0 && y < canvas.height + fontSize * column.chars.length) {
            const distanceFromHead = idx * fontSize;
            const fadeOpacity = Math.max(0, 1 - distanceFromHead / (fontSize * 15));

            if (idx === 0) {
              ctx.fillStyle = `rgba(0, 255, 136, ${column.opacity})`;
            } else {
              ctx.fillStyle = `rgba(0, 255, 136, ${column.opacity * fadeOpacity * 0.6})`;
            }

            ctx.fillText(char, column.x, y);
          }
        });

        column.y += column.speed;

        if (column.y > canvas.height + column.chars.length * fontSize) {
          column.y = Math.random() * -200 - 100;
          column.speed = 1 + Math.random() * 2;
          column.opacity = 0.3 + Math.random() * 0.4;
          column.chars = Array(30)
            .fill(0)
            .map(() => allChars[Math.floor(Math.random() * allChars.length)]);
        }

        if (Math.random() > 0.98) {
          const randomIdx = Math.floor(Math.random() * column.chars.length);
          column.chars[randomIdx] = allChars[Math.floor(Math.random() * allChars.length)];
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}
