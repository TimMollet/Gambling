(() => {
  const videoPlayer = document.getElementById('videoPlayer');
  const nextBtn = document.getElementById('nextBtn');
  const btnImage = document.getElementById('btnImage');
  const bgMusic = document.getElementById('bgMusic');

  const totalScenes = 8;
  let sceneIndex = 0;
  let currentNarration = null;

  const videos = Array.from({ length: totalScenes }, (_, i) => `videos/video${i + 1}.mp4`);
  const buttons = Array.from({ length: totalScenes }, (_, i) => `buttons/button${i + 1}.png`);
  const narrations = Array.from({ length: totalScenes }, (_, i) => `audio/scene${i + 1}.mp3`);

  // Initialize
  videoPlayer.src = videos[sceneIndex];
  videoPlayer.loop = true;
  btnImage.src = buttons[sceneIndex];

  // Disable button and set scale to 0 initially
  nextBtn.disabled = true;
  nextBtn.classList.remove('enabled');

  // Lock scrolling
  document.body.style.overflow = 'hidden';

  // Start background music on first user interaction
  function startBgMusic() {
    bgMusic.play().catch(e => console.log("bgMusic error:", e));
    document.removeEventListener('click', startBgMusic);
    playNarration(sceneIndex);
  }
  document.addEventListener('click', startBgMusic);

  // Play narration and control button enabling
  function playNarration(index) {
    if (currentNarration) {
      currentNarration.pause();
      currentNarration.currentTime = 0;
    }
    currentNarration = new Audio(narrations[index]);
    currentNarration.play().catch(e => console.log("Narration error:", e));

    nextBtn.disabled = true;
    nextBtn.classList.remove('enabled');

    currentNarration.onended = () => {
      nextBtn.disabled = false;
      nextBtn.classList.add('enabled');
    };
  }

  nextBtn.addEventListener('click', () => {
    if (sceneIndex < totalScenes - 1) {
      sceneIndex++;
      videoPlayer.src = videos[sceneIndex];
      videoPlayer.loop = (sceneIndex === totalScenes - 1);
      videoPlayer.play();

      btnImage.src = buttons[sceneIndex];

      playNarration(sceneIndex);
    }
  });

  // Sparkles effect
  let lastX = null;
  let lastY = null;

  const sparkleSrc = 'particles/sparkle.gif';
  const velocityMultiplier = 5;

  function spawnSparkles(x, y, dx, dy) {
    const baseAngle = Math.atan2(dy, dx);
    const speedBase = Math.sqrt(dx * dx + dy * dy) * velocityMultiplier;

    const maxSparkles = 3;
    const numSparkles = Math.max(0, maxSparkles - sceneIndex);

    for (let i = 0; i < numSparkles; i++) {
      const sparkle = document.createElement('img');
      sparkle.src = sparkleSrc;
      sparkle.className = 'sparkle';

      const angleOffset = (Math.random() - 0.5) * (Math.PI / 4);
      const angle = baseAngle + angleOffset;

      const speed = speedBase * (0.8 + Math.random() * 0.4);
      const dxSpark = Math.cos(angle) * speed;
      const dySpark = Math.sin(angle) * speed;

      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.transform = `translate(0, 0) scale(1) rotate(${Math.random() * 360}deg)`;
      sparkle.style.opacity = '1';

      document.body.appendChild(sparkle);

      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(${dxSpark}px, ${dySpark}px) scale(0.5) rotate(${Math.random() * 360}deg)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => {
        sparkle.remove();
      }, 900);
    }
  }

  function handleMove(x, y) {
    if (lastX === null || lastY === null) {
      lastX = x;
      lastY = y;
      return;
    }

    const dx = x - lastX;
    const dy = y - lastY;

    // Lower threshold to 0.5 for better mobile sensitivity
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

    lastX = x;
    lastY = y;

    spawnSparkles(x, y, dx, dy);
  }

  // Mouse support
  document.addEventListener('mousemove', (e) => {
    if (sceneIndex > 2) return;
    handleMove(e.clientX, e.clientY);
  });

  // Touch support
  document.addEventListener('touchstart', e => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      lastX = touch.clientX;
      lastY = touch.clientY;

      // Spawn sparkles on tap start
      spawnSparkles(lastX, lastY, 0, 0);
    }
  });

  document.addEventListener('touchmove', e => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  }, { passive: false });
})();
