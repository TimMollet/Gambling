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

  // Sparkles effect with mobile support
  let lastX = null;
  let lastY = null;

  const sparkleSrc = 'particles/sparkle.gif';
  const velocityMultiplier = 5;

  function handleSparkles(x, y) {
    if (sceneIndex > 2) return;

    if (lastX === null || lastY === null) {
      lastX = x;
      lastY = y;
      return;
    }

    const dx = x - lastX;
    const dy = y - lastY;

    lastX = x;
    lastY = y;

    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

    const baseAngle = Math.atan2(dy, dx);
    const speedBase = Math.sqrt(dx * dx + dy * dy) * velocityMultiplier;

    const maxSparkles = 6;
    const numSparkles = Math.max(0, maxSparkles - sceneIndex);
    const baseScale = Math.max(0.3, 1 - sceneIndex * 0.1);

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
      sparkle.style.transform = `translate(0, 0) scale(${baseScale}) rotate(${Math.random() * 360}deg)`;
      sparkle.style.opacity = '1';

      document.body.appendChild(sparkle);

      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(${dxSpark}px, ${dySpark}px) scale(${baseScale * 0.5}) rotate(${Math.random() * 360}deg)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => {
        sparkle.remove();
      }, 900);
    }
  }

  document.addEventListener('mousemove', e => {
    handleSparkles(e.clientX, e.clientY);
  });

  document.addEventListener('touchmove', e => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleSparkles(touch.clientX, touch.clientY);
    }
  }, { passive: true });
})();
