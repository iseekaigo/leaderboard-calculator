import React, { useEffect, useRef, useState } from "react";

const FireworksCanvas = ({ theme, triggerFireworks }) => {
  const canvasRef = useRef(null);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  // Keep trigger fireworks in a ref to call it inside the animation loop if needed,
  // but we can also trigger them on prop change.
  const triggerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class
    class Particle {
      constructor(x, y, color, isSparkler = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isSparkler = isSparkler;

        // Random angle and speed
        const angle = Math.random() * Math.PI * 2;
        const speed = isSparkler
          ? Math.random() * 2 + 1
          : Math.random() * 5 + 2;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.gravity = 0.04;
        this.friction = 0.98;
        this.alpha = 1;
        // Fade rate: faster for low-power mode, slower for high quality
        this.decay = Math.random() * 0.015 + (isLowPowerMode ? 0.015 : 0.008);
        this.size = Math.random() * 2.5 + (isSparkler ? 0.8 : 1.2);
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;

        // Dynamic neon shadow/glow in dark mode
        if (theme === "dark") {
          ctx.shadowBlur = this.isSparkler ? 4 : 10;
          ctx.shadowColor = this.color;
        }

        ctx.fill();
        ctx.restore();
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
    }

    // Rocket class (flies up and explodes)
    class Rocket {
      constructor(targetX, targetY, color) {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;

        // Speed and angles
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = Math.random() * 4 + 10;

        this.vx = (dx / distance) * speed;
        this.vy = (dy / distance) * speed;

        this.alpha = 1;
        this.size = 2.5;
        this.trail = [];
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        if (theme === "dark") {
          ctx.shadowBlur = 8;
          ctx.shadowColor = this.color;
        }
        ctx.fill();
        ctx.restore();

        // Draw trail
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < this.trail.length; i++) {
          const pt = this.trail[i];
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      update() {
        // Record trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 8) this.trail.shift();

        this.x += this.vx;
        this.y += this.vy;

        // If close to target height or falling down, explode
        if (this.vy >= 0 || this.y <= this.targetY) {
          return true; // explode
        }
        return false;
      }
    }

    let rockets = [];
    let particles = [];

    // Helper to launch a firework
    const launchFirework = (tx, ty) => {
      const targetX =
        tx !== undefined ? tx : Math.random() * width * 0.8 + width * 0.1;
      const targetY =
        ty !== undefined ? ty : Math.random() * height * 0.4 + height * 0.1;

      // Theme-specific colors
      const darkColors = [
        "#ff79c6", // Neon pink
        "#00f0ff", // Electric cyan
        "#ffb86c", // Neon orange
        "#bd93f9", // Neon purple
        "#50fa7b", // Neon green
        "#ff5555", // Neon red
      ];

      const lightColors = [
        "#ff5e8c", // Soft cherry pink
        "#3b82f6", // Sky blue
        "#f59e0b", // Warm amber
        "#ff7597", // Rose pink
        "#8b5cf6", // Soft violet
        "#10b981", // Soft emerald
      ];

      const colors = theme === "dark" ? darkColors : lightColors;
      const color = colors[Math.floor(Math.random() * colors.length)];

      rockets.push(new Rocket(targetX, targetY, color));
    };

    // Store trigger ref
    triggerRef.current = (tx, ty) => {
      launchFirework(tx, ty);
    };

    // Auto launcher interval
    let lastLaunch = 0;
    const launchInterval = isLowPowerMode ? 4000 : 2500; // Launch less frequently on low power

    // Animation Loop
    const tick = (timestamp) => {
      // Clear with a trail effect
      ctx.fillStyle =
        theme === "dark"
          ? "rgba(10, 11, 16, 0.12)"
          : "rgba(252, 249, 242, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Auto-launch
      if (timestamp - lastLaunch > launchInterval) {
        launchFirework();
        lastLaunch = timestamp;
      }

      // Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];
        rocket.update();
        rocket.draw();

        if (rocket.update()) {
          // Explode rocket into particles
          const particleCount = isLowPowerMode ? 25 : 60;
          for (let p = 0; p < particleCount; p++) {
            particles.push(
              new Particle(rocket.x, rocket.y, rocket.color, false),
            );
          }
          // Add some micro-sparklers
          if (!isLowPowerMode) {
            for (let s = 0; s < 15; s++) {
              particles.push(new Particle(rocket.x, rocket.y, "#ffffff", true));
            }
          }
          rockets.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      // Performance cap: drop particles if frame drops or count is too high
      const maxParticles = isLowPowerMode ? 150 : 500;
      if (particles.length > maxParticles) {
        particles.splice(0, particles.length - maxParticles);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    // Handle Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme, isLowPowerMode]);

  // Handle manual trigger prop changes
  useEffect(() => {
    if (triggerFireworks && triggerRef.current) {
      // Launch 3 rapid-fire fireworks for a celebration!
      triggerRef.current();
      setTimeout(() => triggerRef.current && triggerRef.current(), 200);
      setTimeout(() => triggerRef.current && triggerRef.current(), 400);
    }
  }, [triggerFireworks]);

  // Allow clicking background to launch fireworks
  const handleCanvasClick = (e) => {
    if (triggerRef.current) {
      triggerRef.current(e.clientX, e.clientY);
    }
  };

  return (
    <div
      className="bg-canvas-container"
      onClick={handleCanvasClick}
      style={{ cursor: "pointer" }}
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />

      {/* Subtle performance toggle in bottom left */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsLowPowerMode(!isLowPowerMode);
        }}
        style={{
          position: "fixed",
          bottom: "12px",
          left: "12px",
          background: "var(--bg-glass)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-sm)",
          padding: "4px 8px",
          fontSize: "0.65rem",
          color: "var(--text-secondary)",
          cursor: "pointer",
          zIndex: 100,
          backdropFilter: "blur(4px)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontWeight: 600,
          transition: "all var(--transition-fast)",
        }}
        title="Toggle animations density for better performance on weaker devices"
      >
        {isLowPowerMode ? "⚡ Low Power: ON" : "✨ High FX"}
      </button>
    </div>
  );
};

export default FireworksCanvas;
