import { useEffect, useRef } from "react";

export function AsciiImageBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preCanvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const preCanvas = preCanvasRef.current;
    if (!canvas || !preCanvas) return;

    const ctx = canvas.getContext("2d");
    const preCtx = preCanvas.getContext("2d");
    if (!ctx || !preCtx) return;

    const img = new Image();
    img.src = "/src/imports/image-0.png";

    let animationActive = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener("resize", resize);

    img.onload = () => {
      const startAnimation = () => {
        const fontSize = 8;
        const cols = Math.floor(canvas.width / (fontSize * 0.6));
        const rows = Math.floor(canvas.height / fontSize);

        // Ensure valid dimensions
        if (cols <= 0 || rows <= 0 || canvas.width <= 0 || canvas.height <= 0) {
          requestAnimationFrame(startAnimation);
          return;
        }

        if (animationActive) return;
        animationActive = true;

        preCanvas.width = cols;
        preCanvas.height = rows;

        const asciiChars = " .:-=+*#%@";

        const animate = () => {
          timeRef.current += 0.02;
          const time = timeRef.current;
          
          // Double-check dimensions before getImageData
          if (preCanvas.width <= 0 || preCanvas.height <= 0) return;
          
          preCtx.drawImage(img, 0, 0, cols, rows);
          const imageData = preCtx.getImageData(0, 0, cols, rows);

          ctx.fillStyle = "#0a0a0f";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
              const i = (y * cols + x) * 4;
              const r = imageData.data[i];
              const g = imageData.data[i + 1];
              const b = imageData.data[i + 2];

              const brightness = (r + g + b) / 3;
              const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
              const char = asciiChars[charIndex];

              const alpha = 0.4 + brightness / 300;
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

              // Wave/wind effect calculation
              const wave1 = Math.sin(x * 0.05 + time) * 3;
              const wave2 = Math.sin(y * 0.03 + time * 0.7) * 4;
              const wave3 = Math.cos(x * 0.02 + y * 0.02 + time * 1.2) * 2.5;
              const windOffset = wave1 + wave2 + wave3;
              
              const shouldGlitch = Math.random() > 0.995;
              const offsetX = shouldGlitch ? (Math.random() - 0.5) * 4 : windOffset;
              const offsetY = shouldGlitch ? (Math.random() - 0.5) * 4 : windOffset * 0.5;

              ctx.fillText(char, x * fontSize * 0.6 + offsetX, y * fontSize + offsetY);
            }
          }

          animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();
      };

      startAnimation();
    };

    img.onerror = () => {
      console.error("Failed to load monk image");
    };

    return () => {
      window.removeEventListener("resize", resize);
      animationActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas ref={preCanvasRef} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.8 }}
      />
    </>
  );
}