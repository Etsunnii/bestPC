import { useEffect, useRef } from "react";

export function ShaderBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest(".hero");
    if (!canvas || !hero) return undefined;

    const context = canvas.getContext("2d");
    const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame;
    let width = 1;
    let height = 1;

    const resize = () => {
      const bounds = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointer = (event) => {
      const bounds = hero.getBoundingClientRect();
      pointer.targetX = (event.clientX - bounds.left) / bounds.width;
      pointer.targetY = (event.clientY - bounds.top) / bounds.height;
    };

    const resetPointer = () => {
      pointer.targetX = 0.5;
      pointer.targetY = 0.5;
    };

    const paintGlow = (x, y, radius, inner) => {
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, inner);
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };

    const render = (timestamp = 0) => {
      const time = reduceMotion ? 4 : timestamp * 0.00018;
      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      pointer.y += (pointer.targetY - pointer.y) * 0.035;

      context.globalCompositeOperation = "source-over";
      context.fillStyle = "#01050b";
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "screen";

      paintGlow(
        width * (0.18 + Math.sin(time * 1.25) * 0.08 + (pointer.x - 0.5) * 0.08),
        height * (0.28 + Math.cos(time) * 0.1),
        Math.max(width, height) * 0.55,
        "rgba(0, 52, 190, .76)",
      );
      paintGlow(
        width * (0.78 + Math.cos(time * 0.82) * 0.1 + (pointer.x - 0.5) * 0.1),
        height * (0.2 + Math.sin(time * 1.18) * 0.12),
        Math.max(width, height) * 0.48,
        "rgba(0, 206, 255, .48)",
      );
      paintGlow(
        width * (0.52 + Math.sin(time * 0.7) * 0.16),
        height * (0.9 + Math.cos(time * 0.9) * 0.08 + (pointer.y - 0.5) * 0.12),
        Math.max(width, height) * 0.5,
        "rgba(68, 39, 255, .62)",
      );
      paintGlow(
        width * (0.62 + Math.cos(time * 1.4) * 0.14),
        height * (0.54 + Math.sin(time * 0.75) * 0.18),
        Math.max(width, height) * 0.3,
        "rgba(37, 255, 182, .22)",
      );

      context.globalCompositeOperation = "source-over";
      const vignette = context.createRadialGradient(
        width * 0.5,
        height * 0.48,
        Math.min(width, height) * 0.08,
        width * 0.5,
        height * 0.48,
        Math.max(width, height) * 0.72,
      );
      vignette.addColorStop(0, "rgba(1, 5, 11, .12)");
      vignette.addColorStop(0.58, "rgba(1, 5, 11, .16)");
      vignette.addColorStop(1, "rgba(1, 5, 11, .7)");
      context.fillStyle = vignette;
      context.fillRect(0, 0, width, height);

      if (!reduceMotion) frame = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    hero.addEventListener("pointermove", handlePointer);
    hero.addEventListener("pointerleave", resetPointer);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      hero.removeEventListener("pointermove", handlePointer);
      hero.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return <canvas className="shader-canvas" ref={canvasRef} aria-hidden="true" />;
}
