// Use only left-facing gifs (stand_l.gif, walk_l.gif).
// 'A' / ArrowLeft => left (no flip). 'D' / ArrowRight => right (flip horizontally).
(() => {
  const root = document.getElementById('game-root');
  const player = document.getElementById('player');
  const sprite = document.getElementById('player-sprite');
  if (!root || !player || !sprite) return;

  // only-left assets
  const LEFT_IDLE = './character/stand.gif';
  const LEFT_RUN  = './character/walk.gif';

  // center handling
  player.style.position = 'absolute';
  player.style.transform = 'translateX(-50%)';

  // state
  let x = root.clientWidth / 2;
  const speed = 260; // px/sec
  let movingLeft = false;
  let movingRight = false;
  let facingLeft = true; // when true show left-as-is; when false flip for right
  let lastTime = null;
  let lastSrc = '';

  // keyboard
  function keyDown(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      movingLeft = true;
      movingRight = false;
      facingLeft = true;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      movingRight = true;
      movingLeft = false;
      facingLeft = false;
    }
  }
  function keyUp(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') movingLeft = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') movingRight = false;
  }
  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);

  // simple touch: press left/right half to move
  function onTouchStart(e) {
    if (!e.touches || !e.touches[0]) return;
    const tx = e.touches[0].clientX;
    if (tx < window.innerWidth / 2) { movingLeft = true; movingRight = false; facingLeft = true; }
    else { movingRight = true; movingLeft = false; facingLeft = false; }
  }
  function onTouchEnd() { movingLeft = movingRight = false; }
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd);

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function setSpriteIfNeeded(src, flipped) {
    if (lastSrc !== src) {
      sprite.src = src;
      lastSrc = src;
    }
    // apply flip for right-facing (facingLeft === false)
    sprite.style.transform = flipped ? 'scaleX(-1)' : '';
  }

  function loop(ts) {
    if (lastTime == null) lastTime = ts;
    const dt = (ts - lastTime) / 1000;
    lastTime = ts;

    let moving = false;
    if (movingLeft && !movingRight) {
      x -= speed * dt;
      moving = true;
      facingLeft = true;
    } else if (movingRight && !movingLeft) {
      x += speed * dt;
      moving = true;
      facingLeft = false;
    }

    const halfW = Math.max(1, player.clientWidth / 2);
    const minX = 16 + halfW;
    const maxX = root.clientWidth - halfW - 16;
    x = clamp(x, minX, maxX);

    // choose sprite and flip: use LEFT_RUN/LEFT_IDLE and flip when facingRight
    const flipped = !facingLeft;
    const src = moving ? LEFT_RUN : LEFT_IDLE;
    setSpriteIfNeeded(src, flipped);

    player.classList.toggle('idle', !moving);
    player.style.left = x + 'px';

    requestAnimationFrame(loop);
  }

  function init() {
    x = root.clientWidth / 2;
    player.style.left = x + 'px';
    // preload images (optional)
    new Image().src = LEFT_IDLE;
    new Image().src = LEFT_RUN;
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    const halfW = Math.max(1, player.clientWidth / 2);
    x = clamp(x, halfW + 16, root.clientWidth - halfW - 16);
  });

  init();
})();