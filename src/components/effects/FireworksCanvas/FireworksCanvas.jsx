import React, { useEffect, useRef } from "react";
import { createEngine } from "../../../utils/fireworksEngine";
import styles from "./FireworksCanvas.module.css";

/**
 * FireworksCanvas
 * - Canvas2D lightweight fireworks (no WebGL, no heavy libs)
 * - Capped devicePixelRatio (max 2) for consistent performance
 * - Pauses on tab hidden / off-screen
 * - Transparent canvas with destination-out trail fading
 */
const FireworksCanvas = React.memo(function FireworksCanvas() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const rafRef = useRef(null);
  const isVisibleRef = useRef(true);
  const isRunningRef = useRef(true);
  const dimsRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const engine = createEngine();
    engineRef.current = engine;

    function fit() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (dimsRef.current.w === w && dimsRef.current.h === h) return;
      dimsRef.current = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      engine.resize();
    }

    fit();

    const ro = new ResizeObserver(() => fit());
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener("resize", fit);

    function loop() {
      if (!isRunningRef.current) {
        rafRef.current = null;
        return;
      }
      const { w, h } = dimsRef.current;
      engine.step(w, h, ctx);
      rafRef.current = requestAnimationFrame(loop);
    }

    function handleVisibility() {
      if (document.hidden) {
        isRunningRef.current = false;
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else if (isVisibleRef.current) {
        isRunningRef.current = true;
        if (!rafRef.current) rafRef.current = requestAnimationFrame(loop);
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !document.hidden) {
          isRunningRef.current = true;
          if (!rafRef.current) rafRef.current = requestAnimationFrame(loop);
        } else {
          isRunningRef.current = false;
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
        }
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    if (!document.hidden && isVisibleRef.current) {
      isRunningRef.current = true;
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      isRunningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", fit);
      engine.destroy();
    };
  }, []);

  return (
    <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
  );
});

export default FireworksCanvas;
