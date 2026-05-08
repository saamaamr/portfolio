(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let id = null;
  let blobs = [];

  const PALETTES = {
    light: [
      [139, 92, 246, 0.18],
      [34, 211, 238, 0.14],
      [167, 139, 250, 0.12],
      [34, 211, 238, 0.10],
      [196, 181, 253, 0.08],
    ],
    dark: [
      [139, 92, 246, 0.20],
      [34, 211, 238, 0.14],
      [167, 139, 250, 0.10],
      [34, 211, 238, 0.08],
      [196, 181, 253, 0.06],
    ],
  };

  function isDark() {
    return document.documentElement.classList.contains("dark");
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  }

  function initBlobs() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    blobs = [];
    for (let i = 0; i < 5; i++) {
      const t = i / 4;
      blobs.push({
        baseX: w * (0.1 + 0.8 * t),
        baseY: h * (0.1 + 0.8 * Math.sin(t * Math.PI)),
        baseR: Math.min(w, h) * (0.18 + 0.12 * Math.sin(i * 1.3 + 1)),
        sx: 0.0003 + 0.00015 * i,
        sy: 0.00025 + 0.0002 * (i % 3),
        px: i * 2.1,
        py: i * 2.7 + 1,
        pr: i * 1.3,
        ci: i,
      });
    }
  }

  function draw() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const t = Date.now();
    const palette = isDark() ? PALETTES.dark : PALETTES.light;

    ctx.clearRect(0, 0, w, h);

    for (const b of blobs) {
      const x = b.baseX + Math.sin(t * b.sx + b.px) * w * 0.12;
      const y = b.baseY + Math.cos(t * b.sy + b.py) * h * 0.12;
      const r = b.baseR + Math.sin(t * 0.0004 + b.pr) * 40;
      const c = palette[b.ci];

      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`);
      grad.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    id = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    initBlobs();
    draw();
  }

  function stop() {
    if (id) {
      cancelAnimationFrame(id);
      id = null;
    }
  }

  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      stop();
      start();
    }, 200);
  });

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : draw();
  });

  start();
})();
