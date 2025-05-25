(() => {
  const videoPlayer = document.getElementById('videoPlayer');
  const nextBtn = document.getElementById('nextBtn');
  const btnImage = document.getElementById('btnImage');
  const bgMusic = document.getElementById('bgMusic');

  const totalScenes = 8;
  let sceneIndex = 0;
  let currentNarration = null;

  const videos = Array.from({ length: totalScenes }, (_, i) => `videos/video${i}.mp4`);
  const buttons = Array.from({ length: totalScenes }, (_, i) => `buttons/button${i}.png`);
  const narrations = Array.from({ length: totalScenes }, (_, i) => `audio/scene${i}.mp3`);

  // Preload video elements cache
  const videoCache = new Array(totalScenes).fill(null).map(() => document.createElement('video'));

  // Initialize button state and UI
  nextBtn.disabled = true;
  nextBtn.classList.remove('enabled');

  // Load first button image but don't load first video yet
  btnImage.src = buttons[sceneIndex];

  // Flag to track if initial play has started
  let started = false;

  function preloadVideo(index) {
    if (index < totalScenes && !videoCache[index].src) {
      videoCache[index].src = videos[index];
      videoCache[index].load();
    }
  }

  function startPlayback() {
    if (started) return;
    started = true;

    // Play first video from cache or fallback to src assignment
    if (videoCache[0].src) {
      videoPlayer.src = videoCache[0].src;
    } else {
      videoPlayer.src = videos[0];
    }
    videoPlayer.loop = false;
    videoPlayer.play().catch(e => console.log("Video play error:", e));

    playNarration(sceneIndex);

    // Preload next video
    preloadVideo(sceneIndex + 1);
  }

  // Background music play on first user interaction
  function startBgMusic() {
    bgMusic.play().catch(e => console.log("bgMusic error:", e));
    document.removeEventListener('click', startBgMusic);
  }
  document.addEventListener('click', startBgMusic);

  // Play narration and manage next button enabling
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
      // Switch video source to preloaded video if possible
      if (videoCache[sceneIndex].src) {
        videoPlayer.src = videoCache[sceneIndex].src;
      } else {
        videoPlayer.src = videos[sceneIndex];
      }
      videoPlayer.loop = false;
      videoPlayer.play().catch(e => console.log("Video play error:", e));

      btnImage.src = buttons[sceneIndex];

      playNarration(sceneIndex);

      // Preload next video if exists
      preloadVideo(sceneIndex + 1);
    }
  });

  // Play first video & narration on any click or tap on the page (excluding button)
  document.addEventListener('click', (e) => {
    if (!started && e.target !== nextBtn) {
      startPlayback();
    }
  }, { once: true });

  // Sparkles effect variables
  let lastX = null;
  let lastY = null;

  const sparkleSrc = 'particles/sparkle.gif';
  const velocityMultiplier = 5;

  // Helper to create sparkles with scaling based on sceneIndex
  function createSparkles(x, y, baseAngle, speedBase, numSparkles) {
    for (let i = 0; i < numSparkles; i++) {
      const sparkle = document.createElement('img');
      sparkle.src = sparkleSrc;
      sparkle.className = 'sparkle';

      const angleOffset = (Math.random() - 0.5) * (Math.PI / 4);
      const angle = baseAngle + angleOffset;

      const speed = speedBase * (0.8 + Math.random() * 0.4);
      const dxSpark = Math.cos(angle) * speed;
      const dySpark = Math.sin(angle) * speed;

      // Scale linearly from 1 down to 0 as sceneIndex goes from 0 to max (3 here)
      const maxSparkles = 3;
      const scaleStart = Math.max(0, (maxSparkles - sceneIndex) / maxSparkles);
      const scaleEnd = scaleStart * 0.33;

      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.transform = `translate(0, 0) scale(${scaleStart}) rotate(${Math.random() * 360}deg)`;
      sparkle.style.opacity = '1';

      document.body.appendChild(sparkle);

      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(${dxSpark}px, ${dySpark}px) scale(${scaleEnd}) rotate(${Math.random() * 360}deg)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => {
        sparkle.remove();
      }, 900);
    }
  }

  // Mouse sparkle effect (desktop)
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

    createSparkles(e.clientX, e.clientY, baseAngle, speedBase, numSparkles);
  });

  // Touch sparkle effect (mobile) — ONLY on taps (no dragging)
  document.addEventListener('touchstart', (e) => {
    if (sceneIndex > 2) return;

    const touch = e.touches[0];
    if (!touch) return;

    const x = touch.clientX;
    const y = touch.clientY;

    const maxSparkles = 3;
    const numSparkles = Math.max(0, maxSparkles - sceneIndex);

    for (let i = 0; i < numSparkles; i++) {
      const sparkle = document.createElement('img');
      sparkle.src = sparkleSrc;
      sparkle.className = 'sparkle';

      const angle = (Math.random() - 0.5) * Math.PI * 2;
      const speed = 50 + Math.random() * 50;

      const dxSpark = Math.cos(angle) * speed;
      const dySpark = Math.sin(angle) * speed;

      const maxScale = Math.max(0, (maxSparkles - sceneIndex) / maxSparkles);
      const endScale = maxScale * 0.5;

      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.transform = `translate(0, 0) scale(${maxScale}) rotate(${Math.random() * 360}deg)`;
      sparkle.style.opacity = '1';

      document.body.appendChild(sparkle);

      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(${dxSpark}px, ${dySpark}px) scale(${endScale}) rotate(${Math.random() * 360}deg)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => {
        sparkle.remove();
      }, 900);
    }
  });

})();
