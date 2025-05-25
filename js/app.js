(() => {
  const videoPlayer = document.getElementById('videoPlayer');
  const nextBtn = document.getElementById('nextBtn');
  const btnImage = document.getElementById('btnImage');
  const bgMusic = document.getElementById('bgMusic');

  const totalScenes = 8;
  let sceneIndex = -1;
  let currentNarration = null;
  let preloadedVideo = null;

  const videos = Array.from({ length: totalScenes }, (_, i) => `videos/video${i + 1}.mp4`);
  const buttons = Array.from({ length: totalScenes }, (_, i) => `buttons/button${i + 1}.png`);
  const narrations = Array.from({ length: totalScenes }, (_, i) => `audio/scene${i + 1}.mp3`);

  nextBtn.disabled = true;
  nextBtn.classList.remove('enabled');

  function startSceneOnInteraction() {
    document.removeEventListener('click', startSceneOnInteraction);

    bgMusic.play().catch(e => console.log("bgMusic error:", e));

    sceneIndex = 0;
    playScene(sceneIndex);
  }
  document.addEventListener('click', startSceneOnInteraction);

  function playScene(index) {
    videoPlayer.src = videos[index];
    videoPlayer.loop = false; // do not loop
    videoPlayer.play().catch(e => console.log("Video play error:", e));

    btnImage.src = buttons[index];

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

    preloadNextVideo(index + 1);
  }

  function preloadNextVideo(index) {
    if (index >= totalScenes) return;

    preloadedVideo = document.createElement('video');
    preloadedVideo.src = videos[index];
    preloadedVideo.preload = 'auto';
    preloadedVideo.load();
  }

  nextBtn.addEventListener('click', () => {
    if (sceneIndex < totalScenes - 1) {
      sceneIndex++;
      playScene(sceneIndex);
    }
  });

  // Sparkles
  let lastX = null;
  let lastY = null;

  const sparkleSrc = 'particles/sparkle.gif';
  const velocityMultiplier = 5;
  const maxSparkles = 3;

  document.addEventListener('mousemove', (e) => {
    const numSparkles = Math.max(0, maxSparkles - sceneIndex);
    if (numSparkles === 0) return;

    const scaleFactor = numSparkles / maxSparkles;

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

    for (let i = 0; i < numSparkles; i++) {
      const sparkle = document.createElement('img');
      sparkle.src = sparkleSrc;
      sparkle.className = 'sparkle';

      const angleOffset = (Math.random() - 0.5) * (Math.PI / 4);
      const angle = baseAngle + angleOffset;

      const speed = speedBase * (0.8 + Math.random() * 0.4);
      const dxSpark = Math.cos(angle) * speed;
      const dySpark = Math.sin(angle) * speed;

      sparkle.style.left = `${e.clientX}px`;
      sparkle.style.top = `${e.clientY}px`;
      sparkle.style.transform = `translate(0, 0) scale(${scaleFactor}) rotate(${Math.random() * 360}deg)`;
      sparkle.style.opacity = '1';

      document.body.appendChild(sparkle);

      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(${dxSpark}px, ${dySpark}px) scale(${scaleFactor * 0.5}) rotate(${Math.random() * 360}deg)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => {
        sparkle.remove();
      }, 900);
    }
  });

  document.addEventListener('touchstart', (e) => {
    const numSparkles = Math.max(0, maxSparkles - sceneIndex);
    if (numSparkles === 0) return;

    const scaleFactor = numSparkles / maxSparkles;

    const touch = e.touches[0];
    if (!touch) return;

    const x = touch.clientX;
    const y = touch.clientY;

    for (let i = 0; i < numSparkles; i++) {
      const sparkle = document.createElement('img');
      sparkle.src = sparkleSrc;
      sparkle.className = 'sparkle';

      const angle = (Math.random() - 0.5) * Math.PI * 2;
      const speed = 50 + Math.random() * 50;

      const dxSpark = Math.cos(angle) * speed;
      const dySpark = Math.sin(angle) * speed;

      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.transform = `translate(0, 0) scale(${scaleFactor}) rotate(${Math.random() * 360}deg)`;
      sparkle.style.opacity = '1';

      document.body.appendChild(sparkle);

      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(${dxSpark}px, ${dySpark}px) scale(${scaleFactor * 0.5}) rotate(${Math.random() * 360}deg)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => {
        sparkle.remove();
      }, 900);
    }
  });
})();
