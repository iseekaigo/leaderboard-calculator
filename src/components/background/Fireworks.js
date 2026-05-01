import React, { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

const Fireworks = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    let rockets = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Rocket {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.velocity = {
          x: (Math.random() - 0.5) * 2,
          y: -(Math.random() * 3 + 4 + canvas.height / 200), // Adjust height based on screen
        };
        this.size = 2;
        this.color =
          theme === "dark"
            ? "rgba(255, 255, 255, 0.8)"
            : "rgba(100, 100, 100, 0.8)";
        this.exploded = false;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += 0.05; // Gravity

        if (this.velocity.y >= -1) {
          this.exploded = true;
          this.explode();
        }
      }

      explode() {
        const numParticles = Math.floor(Math.random() * 30 + 50);
        const baseHue = Math.random() * 360;
        for (let i = 0; i < numParticles; i++) {
          particles.push(new Particle(this.x, this.y, baseHue));
        }
      }
    }

    class Particle {
      constructor(x, y, baseHue) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        this.velocity = {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        };
        this.size = Math.random() * 2 + 1;
        this.life = 100;
        this.maxLife = 100;

        // Anime aesthetic colors: bright, slightly pastel or neon
        const hue = baseHue + (Math.random() * 40 - 20);
        const lightness = theme === "dark" ? "60%" : "50%";
        this.color = `hsl(${hue}, 100%, ${lightness})`;
      }

      draw() {
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += 0.03; // Gravity
        this.velocity.x *= 0.98; // Friction
        this.velocity.y *= 0.98;
        this.life -= 1.5;
        this.size *= 0.96;
      }
    }

    const animate = () => {
      // Clear with slight opacity for trail effect
      ctx.fillStyle =
        theme === "dark" ? "rgba(15, 23, 42, 0.2)" : "rgba(248, 250, 252, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Randomly launch rockets
      if (Math.random() < 0.03) {
        rockets.push(new Rocket());
      }

      rockets.forEach((rocket, index) => {
        rocket.draw();
        rocket.update();
        if (rocket.exploded) {
          rockets.splice(index, 1);
        }
      });

      particles.forEach((particle, index) => {
        particle.draw();
        particle.update();
        if (particle.life <= 0 || particle.size <= 0.1) {
          particles.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: theme === "dark" ? "#0f172a" : "#f8fafc" }}
    />
  );
};

export default Fireworks;
