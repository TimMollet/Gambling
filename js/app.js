(() => {
  const videoPlayer = document.getElementById('videoPlayer');
  const nextBtn = document.getElementById('nextBtn');
  const btnImage = document.getElementById('btnImage');
  const bgMusic = document.getElementById('bgMusic');

  const totalScenes = 8;
  let sceneIndex = 0;
  let currentNarration = null;
  let firstInteractionHandled = false;

  const videos = Array.from({ length: totalScenes }, (_, i) => `videos/video${i}.mp4`);
  const buttons = Array.from({ length: totalScenes }, (_, i) => `buttons/button${i}.png`);
  const narrations = Array.from({ length: totalScenes }, (_, i) => `audio/scene${i}.mp3`);

  // Preload next video element
  const videoPreload = document.createElement('video');
  videoPreload.setAttribute('preload', 'auto');
  videoPreload.setAttribute('playsinline', '');
  videoPreload.setAttribute('muted', '');

  // Init UI states
  videoPlayer.src = ''; // no video at start
  nextBtn.disabled = true;
  nextBtn.classList.remove('enabled');
  btnImage.src = buttons[sceneIndex];

  // Start BG music, first video & narration on first user interaction
  function handleFirstInteraction() {
    if (firstInteractionHandled) return;
    firstInteractionHandled = true;

    bgMusic.play().catch(e => console.log("bgMusic play error:", e));
    playScene(sceneIndex);
  }

  document.addEventListener('click', handleFirstInteraction);
  document.addEventListener('touchstart', handleFirstInteraction);

  // Play given scene (video + narration)
  function playScene(index) {
    if (currentNarration) {
      currentNarration.pause();
      currentNarration.currentTime = 0;
    }

    videoPlayer.src = videos[index];
    videoPlayer.loop = false;
    videoPlayer.play().catch(e => console.log("videoPlayer play error:", e));

    preloadNextVideo(index + 1);

    currentNarration = new Audio(narrations[index]);
    currentNarration.play().catch(e => console.log("Narration play error:", e));

    nextBtn.disabled = true;
    nextBtn.classList.remove('enabled');
    btnImage.src = buttons[index];

    currentNarration.onended = () => {
      nextBtn.disabled = false;
      nextBtn.classList.add('enabled');
    };
  }

  // Preload upcoming video
  function preloadNextVideo(index) {
    if (index >= totalScenes) return;
    videoPreload.src = videos[index];
    videoPreload.load();
  }

  // Next button click: advance scene
  nextBtn.addEventListener('click', () => {
    if (sceneIndex < totalScenes - 1) {
      sceneIndex++;
      playScene(sceneIndex);
    }
  });

  // Sparkles effect code

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

    // Calculate scale factor for sparkles: goes from 1 down to 0 as numSparkles goes from maxSparkles to 0
    const sparkleScaleStart = numSparkles / maxSparkles;
    const sparkleScaleEnd = sparkleScaleStart / 3;

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

      sparkle.style.transform = `translate(0, 0) scale(${sparkleScaleStart.toFixed(2)}) rotate(${Math.random() * 360}deg)`;
      sparkle.style.opacity = '1';

      document.body.appendChild(sparkle);

      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(${dxSpark}px, ${dySpark}px) scale(${sparkleScaleEnd.toFixed(2)}) rotate(${Math.random() * 360}deg)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => {
        sparkle.remove();
      }, 900);
    }
  });

  // Touch sparkle effect — taps only
  document.addEventListener('touchstart', (e) => {
    if (sceneIndex > 2) return;

    const touch = e.touches[0];
    if (!touch) return;

    const x = touch.clientX;
    const y = touch.clientY;

    const maxSparkles = 3;
    const numSparkles = Math.max(0, maxSparkles - sceneIndex);

    const sparkleScaleStart = numSparkles / maxSparkles;
    const sparkleScaleEnd = sparkleScaleStart / 3;

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
      sparkle.style.transform = `translate(0, 0) scale(${sparkleScaleStart.toFixed(2)}) rotate(${Math.random() * 360}deg)`;
      sparkle.style.opacity = '1';

      document.body.appendChild(sparkle);

      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(${dxSpark}px, ${dySpark}px) scale(${sparkleScaleEnd.toFixed(2)}) rotate(${Math.random() * 360}deg)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => {
        sparkle.remove();
      }, 900);
    }
  });

})();
