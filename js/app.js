(() => {
  const videoPlayer = document.getElementById('videoPlayer');
  const nextBtn = document.getElementById('nextBtn');
  const btnImage = document.getElementById('btnImage');
  const bgMusic = document.getElementById('bgMusic');

  const totalScenes = 8;
  let sceneIndex = -1; // start before first scene
  let currentNarration = null;

  const videos = Array.from({ length: totalScenes }, (_, i) => `videos/video${i}.mp4`);
  const buttons = Array.from({ length: totalScenes }, (_, i) => `buttons/button${i}.png`);
  const narrations = Array.from({ length: totalScenes }, (_, i) => `audio/scene${i}.mp3`);

  nextBtn.disabled = true;
  nextBtn.classList.remove('enabled');

  // Start background music and first video on first user interaction
  function startExperience() {
    document.removeEventListener('click', startExperience);
    document.removeEventListener('touchstart', startExperience);

    bgMusic.play().catch(e => console.log("bgMusic error:", e));

    sceneIndex++;
    videoPlayer.src = videos[sceneIndex];
    videoPlayer.play().catch(e => console.log("video play error:", e));

    playNarration(sceneIndex);
    preloadNextVideo();
  }

  document.addEventListener('click', startExperience);
  document.addEventListener('touchstart', startExperience);

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

  function preloadNextVideo() {
    const nextIndex = sceneIndex + 1;
    if (nextIndex < totalScenes) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = videos[nextIndex];
      document.head.appendChild(link);
    }
  }

  nextBtn.addEventListener('click', () => {
    if (sceneIndex < totalScenes - 1) {
      sceneIndex++;
      videoPlayer.src = videos[sceneIndex];
      videoPlayer.loop = false;
      videoPlayer.play().catch(e => console.log("video play error:", e));

      btnImage.src = buttons[sceneIndex];
      playNarration(sceneIndex);
      preloadNextVideo();
    }
  });

  // Sparkles effect
  let lastX = null;
  let lastY = null;

  const sparkleSrc = 'particles/sparkle.gif';
  const velocityMultiplier = 5;

  function createSparkle(x, y, dxSpark, dySpark, initialScale, finalScale) {
    const sparkle = document.createElement('img');
    sparkle.src = sparkleSrc;
    sparkle.className = 'sparkle';

    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.transform = `translate(0, 0) scale(${initialScale}) rotate(${Math.random() * 360}deg)`;
    sparkle.style.opacity = '1';

    document.body.appendChild(sparkle);

    requestAnimationFrame(() => {
      sparkle.style.transform = `translate(${dxSpark}px, ${dySpark}px) scale(${finalScale}) rotate(${Math.random() * 360}deg)`;
      sparkle.style.opacity = '0';
    });

    setTimeout(() => {
      sparkle.remove();
    }, 900);
  }

  document.addEventListener('mousemove', (e) => {
    if (sceneIndex > 2) return;

    if (lastX === null || lastY === null) {
      lastX = e.clientX;
      lastY = e.clientY;
      return;
    }

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    lastX = e.clientX;
    lastY = e.clientY;

    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

    const baseAngle = Math.atan2(dy, dx);
    const speedBase = Math.sqrt(dx * dx + dy * dy) * velocityMultiplier;

    const maxSparkles = 3;
    const numSparkles = Math.max(0, maxSparkles - sceneIndex);
    const scale = numSparkles / maxSparkles;

    for (let i = 0; i < numSparkles; i++) {
      const angleOffset = (Math.random() - 0.5) * (Math.PI / 4);
      const angle = baseAngle + angleOffset;

      const speed = speedBase * (0.8 + Math.random() * 0.4);
      const dxSpark = Math.cos(angle) * speed;
      const dySpark = Math.sin(angle) * speed;

      createSparkle(e.clientX, e.clientY, dxSpark, dySpark, 0.6 * scale, 0.2 * scale);
    }
  });

  document.addEventListener('touchstart', (e) => {
    if (sceneIndex > 2) return;

    const touch = e.touches[0];
    if (!touch) return;

    const x = touch.clientX;
    const y = touch.clientY;

    const maxSparkles = 3;
    const numSparkles = Math.max(0, maxSparkles - sceneIndex);
    const scale = numSparkles / maxSparkles;

    for (let i = 0; i < numSparkles; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * 2;
      const speed = 50 + Math.random() * 50;

      const dxSpark = Math.cos(angle) * speed;
      const dySpark = Math.sin(angle) * speed;

      createSparkle(x, y, dxSpark, dySpark, 1.0 * scale, 0.5 * scale);
    }
  });
})();
