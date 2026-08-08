(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('bg-canvas');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const context = canvas.getContext('2d');
  if (!context) return;

  const blobs = [
    { x: 0.12, y: 0.18, radius: 0.34, speed: 0.00016, phase: 0, color: [49, 87, 200] },
    { x: 0.82, y: 0.28, radius: 0.3, speed: 0.00013, phase: 2.1, color: [124, 58, 237] },
    { x: 0.58, y: 0.86, radius: 0.28, speed: 0.00011, phase: 4.2, color: [14, 165, 233] },
  ];
  let animationId;
  let lastFrame = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const draw = (timestamp) => {
    animationId = requestAnimationFrame(draw);
    if (timestamp - lastFrame < 33) return;
    lastFrame = timestamp;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dark = document.documentElement.classList.contains('dark');
    context.clearRect(0, 0, width, height);
    blobs.forEach((blob) => {
      const x = width * blob.x + Math.sin(timestamp * blob.speed + blob.phase) * width * 0.06;
      const y = height * blob.y + Math.cos(timestamp * blob.speed + blob.phase) * height * 0.05;
      const radius = Math.min(width, height) * blob.radius;
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
      const opacity = dark ? 0.11 : 0.075;
      gradient.addColorStop(0, `rgba(${blob.color.join(',')},${opacity})`);
      gradient.addColorStop(1, `rgba(${blob.color.join(',')},0)`);
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    });
  };

  const start = () => {
    if (!animationId) animationId = requestAnimationFrame(draw);
  };
  const stop = () => {
    cancelAnimationFrame(animationId);
    animationId = undefined;
  };

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  resize();
  start();
})();
