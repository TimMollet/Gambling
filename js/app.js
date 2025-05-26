(() => {
  const videoA = document.getElementById('videoA');
  const videoB = document.getElementById('videoB');
  const nextBtn = document.getElementById('nextBtn');
  const btnImage = document.getElementById('btnImage');
  const bgMusic = document.getElementById('bgMusic');
  bgMusic.volume = 0.3;

  const totalScenes = 9;
  let sceneIndex = 0;
  let currentNarration = null;
  let firstInteraction = true;

  const videos = Array.from({ length: totalScenes }, (_, i) => `videos/video${i + 1}.mp4`);
  const buttons = Array.from({ length: totalScenes }, (_, i) => `buttons/button${i + 1}.png`);
  const narrations = Array.from({ length: totalScenes }, (_, i) => `audio/scene${i + 1}.mp3`);

  let currentVideo = videoA;
  let nextVideo = videoB;

  // Start with video0 muted and looping
  currentVideo.src = videos[0];
  currentVideo.loop = true;
  currentVideo.muted = true;
  currentVideo.autoplay = true;
  currentVideo.style.opacity = '1';
  nextVideo.style.opacity = '0';
  currentVideo.play();

  btnImage.src = buttons[0];
  nextBtn.disabled = true;
  nextBtn.classList.remove('enabled');

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

  function crossfadeTo(index) {
    const newSrc = videos[index];
    const newButton = buttons[index];
    const isFinal = index === totalScenes - 1;

    nextVideo.src = newSrc;
    nextVideo.loop = isFinal;
    nextVideo.muted = false;
    nextVideo.autoplay = true;
    nextVideo.load();

    nextVideo.oncanplay = () => {
      nextVideo.play();
      currentVideo.style.opacity = '0';
      nextVideo.style.opacity = '1';

      // Swap references
      [currentVideo, nextVideo] = [nextVideo, currentVideo];

      btnImage.src = newButton;
      playNarration(index);
    };
  }

  // On first interaction: start bgm, narration, and jump to video1
  function handleFirstInteraction() {
    if (!firstInteraction) return;
    firstInteraction = false;

    currentVideo.muted = false;
    currentVideo.loop = false;

    sceneIndex = 1;
    crossfadeTo(sceneIndex);

    bgMusic.currentTime = 7;
    bgMusic.play().catch(e => console.log("bgMusic error:", e));
    document.removeEventListener('click', handleFirstInteraction);
  }
  document.addEventListener('click', handleFirstInteraction);

  nextBtn.addEventListener('click', () => {
    if (sceneIndex < totalScenes - 1) {
      sceneIndex++;
      crossfadeTo(sceneIndex);
    }
  });

  // Sparkles effect
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
