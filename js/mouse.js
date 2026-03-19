// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const spark = document.getElementById('sparkles-cr');
  if (!spark) return;

  spark.style.position = 'absolute';
  spark.style.pointerEvents = 'none';
  spark.style.willChange = 'transform, left, top';
  spark.style.opacity = '1';

  // cursor / target / current positions
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let lastCursorX = cursorX;
  let lastCursorY = cursorY;
  let currentX = cursorX;
  let currentY = cursorY;

  // tweak these to change feel
  const ease = 0.16;        // how fast spark moves toward target (lower = more lag)
  const behindFactor = 0.35; // how far behind based on cursor velocity
  const staticOffsetY = 8;  // small constant offset so it's slightly below the pointer

  // update cursor position from pointer events
  function updateCursor(x, y) {
    cursorX = x;
    cursorY = y;
  }

  window.addEventListener('mousemove', e => updateCursor(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', e => {
    if (e.touches && e.touches[0]) updateCursor(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  // animation loop that creates a trailing ("behind") effect
  function tick() {
    // velocity of pointer since last frame
    const velX = cursorX - lastCursorX;
    const velY = cursorY - lastCursorY;
    lastCursorX = cursorX;
    lastCursorY = cursorY;

    // target = cursor position plus a "behind" offset based on velocity (opposite direction)
    const targetX = cursorX - velX * behindFactor;
    const targetY = cursorY - velY * behindFactor + staticOffsetY;

    // lerp current toward target for smooth trailing
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    // set position; your CSS translate(-50%, -50%) keeps it centered
    spark.style.left = `${currentX}px`;
    spark.style.top = `${currentY}px`;

    requestAnimationFrame(tick);
  }

  // start loop
  requestAnimationFrame(tick);

  // optional: hide when pointer leaves window
  window.addEventListener('mouseleave', () => { spark.style.opacity = '0'; });
});
// ...existing code...