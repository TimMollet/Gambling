(() => {
  const videoPlayer = document.getElementById('videoPlayer');
  const nextBtn = document.getElementById('nextBtn');
  const btnImage = document.getElementById('btnImage');
  const bgMusic = document.getElementById('bgMusic');

  const totalScenes = 8;
  let sceneIndex = 0;
  let currentNarration = null;
  let started = false;

  const videos = Array.from({ length: totalScenes }, (_, i) => `videos/video${i}.mp4`);
  const buttons = Array.from({ length: totalScenes }, (_, i) => `buttons/button${i}.png`);
  const narrations = Array.from({ length: totalScenes }, (_, i) => `audio/scene${i}.mp3`);

  // Preload first video and button image
  videoPlayer.src = videos[sceneIndex];
  videoPlayer.loop = false;
  btnImage.src = buttons[sceneIndex];

  nextBtn.disabled = true;
  nextBtn.classList.remove('enabled');
  nextBtn.style.display = 'none';

  function playNarration(index) {
    if (currentNarration) {
      currentNarration.pause();
      currentNarration.currentTime = 0;
    }

    currentNarration = new Audio(narrations[index]);
    currentNarration.play().catch(e => console.log("Narration error:", e));

    nextBtn.disabled = true;
    nextBtn.classList.remove('enabled');
    nextBtn.style.display = 'none';

    currentNarration.onended = () => {
      nextBtn.disabled = false;
      nextBtn.classList.add('enabled');
      nextBtn.style.display = 'block';
    };
  }

  function playScene(index) {
    videoPlayer.src = videos[index];
    videoPlayer.loop = false;
    videoPlayer.play().catch(e => console.log("Video play error:", e));

    btnImage.src = buttons[index];
    playNarration(index);

    // Preload next video
    if (index + 1 < totalScenes) {
      const preload = document.createElement('video');
      preload.src = videos[index + 1];
      preload.preload = 'auto';
      preload.muted = true;
      preload.playsInline = true;
    }
  }

  function startExperience() {
    if (started) return;
    started = true;

    bgMusic.play().catch(e => console.log("bgMusic error:", e));
    playScene(sceneIndex);
  }

  document.addEventListener('click', startExperience, { once: true });
  document.addEventListener('touchstart', startExperience, { once: true });

  nextBtn.addEventListener('click', () => {
    if (sceneIndex < totalScenes - 1) {
      sceneIndex++;
      playScene(sceneIndex);
    }
  });

  // Sparkle effect
  let lastX = null;
  let lastY = null;

  const sparkleSrc = 'particles/sparkle.gif';
  const velocityMultiplier = 5;

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
    const sparkleScale = Math.max(0, 1 - sceneIndex / maxSparkles);

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
      sparkle.style.transform = `translate(0, 0) scale(${sparkleScale}) rotate(${Math.random() * 360}deg)`;
      sparkle.style.opacity = '1';

      document.body.appendChild(sparkle);

      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(${dxSpark}px, ${dySpark}px) scale(${sparkleScale * 0.5}) rotate(${Math.random() * 360}deg)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => sparkle.remove(), 900);
    }
  });
})();
