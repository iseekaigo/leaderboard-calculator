/**
 * Lightweight Canvas2D Fireworks Engine
 * - GPU-free, CPU-only 2D particles
 * - Object pooling to reduce GC churn
 * - Cap max particles to maintain 60fps on mid devices
 * - Transparent canvas: uses destination-out for clean trail fading
 * - No external dependencies
 */

const MAX_PARTICLES = 320;
const GRAVITY = 0.06;
const FRICTION = 0.96;
const FADE_AMOUNT = 0.1; // "destination-out" fade per frame

class ParticlePool {
  constructor(capacity) {
    this.pool = [];
    this.active = [];
    for (let i = 0; i < capacity; i++) {
      this.pool.push(this.createBlank());
    }
  }

  createBlank() {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      alpha: 0,
      decay: 0,
      color: "",
      size: 0,
      alive: false,
    };
  }

  spawn(x, y, color, speedMultiplier = 1) {
    const p = this.pool.length > 0 ? this.pool.pop() : this.createBlank();
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 3.5 + 1.2) * speedMultiplier;
    p.x = x;
    p.y = y;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.alpha = 1;
    p.decay = Math.random() * 0.014 + 0.006;
    p.color = color;
    p.size = Math.random() * 2.5 + 2; // larger particles
    p.alive = true;
    this.active.push(p);
  }

  update() {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const p = this.active[i];
      if (!p.alive) continue;
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.vy += GRAVITY;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        p.alive = false;
        this.pool.push(p);
        this.active.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    for (let i = 0; i < this.active.length; i++) {
      const p = this.active[i];
      if (!p.alive) continue;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  count() {
    return this.active.length;
  }

  clear() {
    while (this.active.length) {
      this.pool.push(this.active.pop());
    }
  }
}

class RocketPool {
  constructor(capacity) {
    this.pool = [];
    this.active = [];
    for (let i = 0; i < capacity; i++) {
      this.pool.push(this.createBlank());
    }
  }

  createBlank() {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      targetY: 0,
      color: "",
      trail: [],
      alive: false,
      exploded: false,
      hue: 0,
    };
  }

  spawn(w, h, color) {
    const r = this.pool.length > 0 ? this.pool.pop() : this.createBlank();
    r.x = Math.random() * w * 0.8 + w * 0.1;
    r.y = h;
    const mid = w / 2;
    const spread = w * 0.35;
    r.vx = (mid - r.x + (Math.random() - 0.5) * spread) * 0.005;
    r.vy = -(Math.random() * 3 + 6.5);
    r.targetY = h * 0.12 + Math.random() * h * 0.4;
    r.color = color;
    r.trail = [];
    r.alive = true;
    r.exploded = false;
    r.hue = Math.random() * 360;
    this.active.push(r);
  }

  update(particlePool, w, h) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const r = this.active[i];
      if (!r.alive) continue;

      r.x += r.vx;
      r.y += r.vy;
      r.vy += 0.12;

      r.trail.push({ x: r.x, y: r.y, alpha: 1 });
      if (r.trail.length > 12) r.trail.shift();
      for (let t = 0; t < r.trail.length; t++) {
        r.trail[t].alpha -= 0.08;
      }

      if (r.vy >= 0 || r.y <= r.targetY) {
        if (!r.exploded) {
          r.exploded = true;
          const count = 28 + Math.floor(Math.random() * 32);
          for (let k = 0; k < count; k++) {
            if (particlePool.count() >= MAX_PARTICLES) break;
            particlePool.spawn(r.x, r.y, r.color, 0.9);
          }
        }
        r.alive = false;
        this.pool.push(r);
        this.active.splice(i, 1);
      } else if (r.y > h + 20) {
        r.alive = false;
        this.pool.push(r);
        this.active.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.active.length; i++) {
      const r = this.active[i];
      if (!r.alive) continue;
      // Trail
      ctx.save();
      for (let t = 0; t < r.trail.length; t++) {
        const tr = r.trail[t];
        if (tr.alpha <= 0) continue;
        ctx.globalAlpha = tr.alpha * 0.6;
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(tr.x, tr.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      // Head
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = r.color;
      ctx.shadowBlur = 14;
      ctx.shadowColor = r.color;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  clear() {
    while (this.active.length) {
      this.pool.push(this.active.pop());
    }
  }
}

function hsla(h, s, l, a) {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

const colorSchemes = [
  { base: 270, range: 40 }, // purples
  { base: 330, range: 30 }, // pinks
  { base: 170, range: 30 }, // teals
  { base: 45, range: 20 }, // golds
];

function randomColor() {
  const scheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
  const h = scheme.base + (Math.random() - 0.5) * scheme.range;
  const s = 80 + Math.random() * 20;
  const l = 55 + Math.random() * 20;
  return hsla(h | 0, s | 0, l | 0, 1);
}

export function createEngine() {
  const particles = new ParticlePool(MAX_PARTICLES);
  const rockets = new RocketPool(12);
  let tick = 0;

  function resize() {
    // Intentionally no-op; sizing is done by the canvas consumer
  }

  function step(w, h, ctx) {
    tick++;

    if (tick % 40 === 0 && rockets.active.length < 5) {
      rockets.spawn(w, h, randomColor());
    }

    rockets.update(particles, w, h);
    particles.update();

    // Fade existing pixels to transparent (trails)
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(255,255,255,${FADE_AMOUNT})`;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    rockets.draw(ctx);
    particles.draw(ctx);
    ctx.restore();
  }

  function destroy() {
    rockets.clear();
    particles.clear();
  }

  return { step, resize, destroy };
}
