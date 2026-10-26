import Lenis from 'lenis';

/**
 * KUNJ SODHI — BRIGHT & VIBRANT EDITORIAL SCRAPBOOK
 * Master Interaction & Animation Engine:
 * - Signature Eye Sunglasses Tracking & Laser Glint
 * - Scroll-Driven Light Table Zoom-In & Elevation
 * - Lenis Momentum Smooth Scroll Engine
 * - Interactive AI Triage Simulator Sandbox
 * - DaVinci Resolve Film LUT Grade Switcher
 * - Hacker Developer CLI Terminal Drawer (~ Kunj CLI)
 * - Procedural Web Audio Synthesizer
 */

let lenisInstance = null;

// ============================================================================
// 1. PROCEDURAL SOUND SYNTHESIZER (ZERO EXTERNAL AUDIO ASSETS)
// ============================================================================
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.init();
    this.enabled = !this.enabled;
    if (this.enabled) this.playScan();
    return this.enabled;
  }

  playClick(pitch = 900) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.045, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (_) {}
  }

  playScan() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch (_) {}
  }

  playSnap() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (_) {}
  }
}

const sfx = new SoundEffects();

// ============================================================================
// 2. LENIS MOMENTUM SMOOTH SCROLL ENGINE
// ============================================================================
function initSmoothScroll() {
  lenisInstance = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // luxury easeOutExpo
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.15,
    touchMultiplier: 1.5,
    infinite: false,
  });

  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Smooth scroll for all hash navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenisInstance.scrollTo(target, { offset: -40, duration: 1.35 });
        sfx.playClick(620);
      }
    });
  });

  return lenisInstance;
}

// ============================================================================
// 3. SCRUB PROGRESS BAR & ACTIVE SECTION INDICATOR
// ============================================================================
function initScrubAndChapters() {
  const scrubFill = document.getElementById('scrubFill');
  const scrubTime = document.getElementById('scrubTime');
  const scrubChapter = document.getElementById('scrubChapter');
  const navLinks = document.querySelectorAll('.hud-nav .hud-link');

  const SECTIONS = [
    { id: 'hero', name: '01 · Hero' },
    { id: 'about', name: '02 · About' },
    { id: 'projects', name: '03 · Projects' },
    { id: 'skills', name: '04 · Skills' },
    { id: 'editing', name: '05 · Video Editing' },
    { id: 'humor', name: '06 · Status' },
    { id: 'contact', name: '07 · Contact' }
  ];

  const TOTAL_DURATION_SEC = 252; // 04:12

  function onScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(window.scrollY / (docHeight || 1), 0), 1);

    if (scrubFill) {
      scrubFill.style.transform = `scaleX(${progress})`;
    }

    if (scrubTime) {
      const currentSec = Math.floor(progress * TOTAL_DURATION_SEC);
      const m = String(Math.floor(currentSec / 60)).padStart(2, '0');
      const s = String(currentSec % 60).padStart(2, '0');
      scrubTime.textContent = `${m}:${s} / 04:12`;
    }

    let currentSecName = '01 · Hero';
    let currentId = 'hero';

    SECTIONS.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
          currentSecName = sec.name;
          currentId = sec.id;
        }
      }
    });

    if (scrubChapter) {
      scrubChapter.textContent = currentSecName;
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('is-active', href === `#${currentId}`);
    });
  }

  if (lenisInstance) {
    lenisInstance.on('scroll', onScroll);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================================================
// 4. INTERACTIVE STANDALONE CHARACTER CURSOR GAZE & FOCUS ENGINE
// ONLY the eyes move and follow the cursor; the character remains completely static.
// ============================================================================
function initCharacterCursorFocus() {
  const leftEye = document.getElementById('leftPupilGlint');
  const rightEye = document.getElementById('rightPupilGlint');
  const figure = document.getElementById('characterFigure');
  const gazeStatus = document.getElementById('gazeStatus');

  if (!leftEye || !rightEye || !figure) return;

  // Character body and head remain completely still
  figure.style.transform = 'none';

  let targetEyeX = 0;
  let targetEyeY = 0;
  let currentEyeX = 0;
  let currentEyeY = 0;

  function onPointerMove(e) {
    const rect = figure.getBoundingClientRect();
    // Center point between the sunglasses lenses
    const eyeCenterX = rect.left + rect.width * 0.505;
    const eyeCenterY = rect.top + rect.height * 0.405;

    const dx = e.clientX - eyeCenterX;
    const dy = e.clientY - eyeCenterY;

    // Normalized offset across the viewport [-1.15, 1.15]
    const normX = Math.min(Math.max(dx / (window.innerWidth * 0.45), -1.15), 1.15);
    const normY = Math.min(Math.max(dy / (window.innerHeight * 0.45), -1.15), 1.15);

    // Eye pupil travel bounds within each sunglass lens
    const maxRangeX = 14; // pixels horizontal
    const maxRangeY = 9;  // pixels vertical

    targetEyeX = normX * maxRangeX;
    targetEyeY = normY * maxRangeY;
  }

  // Smooth render loop for eye pupil gliding
  function renderEyes() {
    currentEyeX += (targetEyeX - currentEyeX) * 0.16;
    currentEyeY += (targetEyeY - currentEyeY) * 0.16;

    const eyeTransform = `translate(calc(-50% + ${currentEyeX.toFixed(1)}px), calc(-50% + ${currentEyeY.toFixed(1)}px))`;

    leftEye.style.transform = eyeTransform;
    rightEye.style.transform = eyeTransform;

    if (gazeStatus) {
      const degX = Math.round((currentEyeX / 14) * 35);
      const degY = Math.round((currentEyeY / 9) * 25);
      const signX = degX >= 0 ? `+${degX}` : `${degX}`;
      const signY = degY >= 0 ? `+${degY}` : `${degY}`;
      gazeStatus.textContent = `EYES: [${signX}°, ${signY}°] · TRACKING CURSOR`;
    }

    requestAnimationFrame(renderEyes);
  }
  renderEyes();

  window.addEventListener('mousemove', onPointerMove, { passive: true });

  // Natural blink animation on click
  figure.addEventListener('click', () => {
    sfx.playSnap();
    leftEye.style.opacity = '0';
    rightEye.style.opacity = '0';
    setTimeout(() => {
      leftEye.style.opacity = '0.95';
      rightEye.style.opacity = '0.95';
    }, 140);
  });
}

// ============================================================================
// 5. PROJECTS LIGHT TABLE ZOOM-IN ON SCROLL
// ============================================================================
function initProjectsZoom() {
  const sheets = document.querySelectorAll('.project-sheet');
  if (!sheets.length) return;

  function setActiveSheet(index) {
    sheets.forEach((sheet, i) => {
      sheet.classList.toggle('is-active', i === index);
    });
  }

  sheets.forEach((sheet, idx) => {
    sheet.addEventListener('mouseenter', () => {
      setActiveSheet(idx);
      sfx.playClick(440 + idx * 80);
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          const idx = parseInt(entry.target.getAttribute('data-project-idx') || '0', 10);
          setActiveSheet(idx);
        }
      });
    }, { threshold: [0.35, 0.6] });

    sheets.forEach(sheet => observer.observe(sheet));
  }
}

// ============================================================================
// 6. INTERACTIVE AI TRIAGE SIMULATOR SANDBOX (MEDITRIAGE AI)
// ============================================================================
function initTriageSimulator() {
  const pills = document.querySelectorAll('.triage-pill');
  const badge = document.getElementById('urgencyBadge');
  const vitals = document.getElementById('triageVitals');
  const reason = document.getElementById('triageReason');

  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');

      const urgency = pill.getAttribute('data-urgency');
      const badgeText = pill.getAttribute('data-badge');
      const reasonText = pill.getAttribute('data-reason');
      const vitalsText = pill.getAttribute('data-vitals');

      if (badge) {
        badge.className = `urgency-badge urgency-badge--${urgency}`;
        badge.textContent = badgeText;
      }
      if (vitals) vitals.textContent = vitalsText;
      if (reason) reason.textContent = reasonText;

      sfx.playClick(urgency === 'critical' ? 420 : urgency === 'urgent' ? 620 : 840);
    });
  });
}

// ============================================================================
// 7. DAVINCI RESOLVE LUT COLOR GRADE SWITCHER
// ============================================================================
function initLutSwitcher() {
  const lutBtns = document.querySelectorAll('.davinci-btn');
  const screen = document.getElementById('davinciScreen');

  if (!lutBtns.length || !screen) return;

  lutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lutBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const lut = btn.getAttribute('data-lut');
      screen.classList.remove('is-log', 'is-grade', 'is-koda');

      if (lut === 'log') {
        screen.classList.add('is-log');
      } else if (lut === 'koda') {
        screen.classList.add('is-koda');
      } else {
        screen.classList.add('is-grade');
      }

      sfx.playClick(680);
    });
  });
}

// ============================================================================
// 8. CASE FILE BRIEFING & DYNAMIC EMAIL DISPATCH
// ============================================================================
function initCaseFileForm() {
  const roleChips = document.querySelectorAll('#roleChips .chip-btn');
  const intentChips = document.querySelectorAll('#intentChips .chip-btn');
  const siteInput = document.getElementById('clientSiteInput');
  const dispatchBtn = document.getElementById('dispatchEmailBtn');
  const copyBtn = document.getElementById('copyEmailBtn');

  let currentRole = "Founder";
  let currentIntent = "Build an AI product";
  let currentSite = "";

  function updateDispatchLink() {
    if (!dispatchBtn) return;
    const subject = encodeURIComponent(`Project Collaboration: ${currentRole} — ${currentIntent}`);
    const body = encodeURIComponent(
      `Hi Kunj,\n\nI'm a ${currentRole} and I'd like to collaborate with you on: ${currentIntent}.\n\n` +
      `My Name / Website: ${currentSite || '(Not provided)'}\n\n` +
      `Let me know when we can connect.\n`
    );
    dispatchBtn.href = `mailto:kunjsodhi1@gmail.com?subject=${subject}&body=${body}`;
  }

  roleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      roleChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      currentRole = chip.getAttribute('data-val');
      sfx.playClick(640);
      updateDispatchLink();
    });
  });

  intentChips.forEach(chip => {
    chip.addEventListener('click', () => {
      intentChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      currentIntent = chip.getAttribute('data-val');
      sfx.playClick(720);
      updateDispatchLink();
    });
  });

  if (siteInput) {
    siteInput.addEventListener('input', (e) => {
      currentSite = e.target.value.trim();
      updateDispatchLink();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('kunjsodhi1@gmail.com').then(() => {
        copyBtn.textContent = "✓ Email copied!";
        sfx.playSnap();
        setTimeout(() => { copyBtn.textContent = "Copy email instead"; }, 2500);
      }).catch(() => {
        window.location.href = 'mailto:kunjsodhi1@gmail.com';
      });
    });
  }
}

// ============================================================================
// 9. SOUND TOGGLE BUTTON (HUD)
// ============================================================================
function initSoundToggle() {
  const btn = document.getElementById('hudSoundBtn');
  const label = document.getElementById('hudSoundLabel');

  if (!btn) return;

  btn.addEventListener('click', () => {
    const on = sfx.toggle();
    btn.setAttribute('aria-pressed', String(on));
    if (label) label.textContent = on ? 'Sound on' : 'Sound off';
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      sfx.playClick(920);
    });
  });
}

// ============================================================================
// 10. FLOATING COMPANION AVATAR & CONTINUOUS THOUGHT LOOP
// ============================================================================
function initCompanion() {
  const btn = document.getElementById('companionBtn');
  const bubble = document.getElementById('companionBubble');
  const text = document.getElementById('bubbleText');

  const QUOTES = [
    "“Part engineer. Part editor. Full-time debugging my life.”",
    "“Tilt the 3D card above to explore the parallax depth!”",
    "“Rendering timeline at 60 FPS in 4K...”",
    "“Build it. Break it. Debug it. Repeat.”",
    "“Zero CSS frameworks were harmed in this build.”",
    "“Code: A work in progress. As usual.”",
    "“Bugs: Some are features. Allegedly.”",
    "“Ideas: Too many open tabs.”"
  ];

  let quoteIdx = 0;

  if (!btn || !bubble || !text) return;

  function showBubble() {
    bubble.hidden = false;
    bubble.classList.add('is-visible');
  }

  function hideBubble() {
    bubble.classList.remove('is-visible');
  }

  // Initial greeting
  setTimeout(() => {
    showBubble();
  }, 1200);

  // Auto-cycle quips every 7 seconds
  setInterval(() => {
    hideBubble();
    setTimeout(() => {
      quoteIdx = (quoteIdx + 1) % QUOTES.length;
      text.textContent = QUOTES[quoteIdx];
      showBubble();
    }, 450);
  }, 7000);

  btn.addEventListener('click', () => {
    sfx.playSnap();
    quoteIdx = (quoteIdx + 1) % QUOTES.length;
    text.textContent = QUOTES[quoteIdx];
    showBubble();
  });
}

// ============================================================================
// 12. CONTINUOUS LIVE TELEMETRY & RUNNING TIMECODE
// ============================================================================
function initLiveTelemetry() {
  const fpsEl = document.getElementById('hudFps');
  const davinciTc = document.getElementById('davinciTc');
  let frameCount = 0;
  let lastTime = performance.now();
  let frames = 0;
  let fps = 60;

  function loop(now) {
    frames++;
    frameCount++;
    if (now - lastTime >= 1000) {
      fps = Math.round((frames * 1000) / (now - lastTime));
      frames = 0;
      lastTime = now;
      if (fpsEl) {
        fpsEl.textContent = `· ${fps} FPS`;
      }
    }

    if (davinciTc && frameCount % 2 === 0) {
      const totalSec = Math.floor(frameCount / 24);
      const ff = String(frameCount % 24).padStart(2, '0');
      const ss = String(totalSec % 60).padStart(2, '0');
      const mm = String(Math.floor(totalSec / 60) % 60).padStart(2, '0');
      davinciTc.innerHTML = `<span class="davinci-rec-dot"></span> REC ● 00:${mm}:${ss}:${ff}`;
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// ============================================================================
// 13. 3D STORYTELLING FRAME ENTRANCE & CARD ELEVATION ENGINE
// ============================================================================
function init3DStoryFrames() {
  const frames = document.querySelectorAll('.story-frame');
  const hero = document.getElementById('hero');

  if (!frames.length) return;

  function updateFrames() {
    const vh = window.innerHeight;
    const scrollY = window.scrollY;

    // Hero 3D Receding Effect
    if (hero) {
      const heroProg = Math.min(Math.max(scrollY / (vh * 0.75), 0), 1);
      const heroScale = (1 - heroProg * 0.05).toFixed(3);
      const heroTilt = (heroProg * -3.5).toFixed(2);
      const heroZ = (heroProg * -60).toFixed(1);
      const heroOpacity = (1 - heroProg * 0.22).toFixed(2);
      hero.style.transform = `perspective(1400px) rotateX(${heroTilt}deg) translateZ(${heroZ}px) scale3d(${heroScale}, ${heroScale}, 1)`;
      hero.style.opacity = heroOpacity;
    }

    // Each Story Frame 3D Elevation Entrance
    frames.forEach(frame => {
      const rect = frame.getBoundingClientRect();
      const enterStart = vh;
      const enterEnd = vh * 0.15;

      if (rect.top <= enterStart && rect.bottom >= 0) {
        // Progress from 0 (just entering bottom) to 1 (comfortably in view)
        const progress = Math.min(Math.max((enterStart - rect.top) / (enterStart - enterEnd), 0), 1);
        
        // Cubic easing for smooth tactile arrival
        const ease = 1 - Math.pow(1 - progress, 3);

        const tiltX = ((1 - ease) * 8.5).toFixed(2);
        const transY = ((1 - ease) * 45).toFixed(1);
        const transZ = ((1 - ease) * -50).toFixed(1);
        const scale = (0.95 + ease * 0.05).toFixed(3);

        const shadowSpread = Math.round(ease * 30 + 10);
        const shadowBlur = Math.round(ease * 55 + 25);
        const shadowAlpha = (0.12 + (1 - ease) * 0.14).toFixed(2);

        frame.style.transform = `perspective(1600px) rotateX(${tiltX}deg) translateY(${transY}px) translateZ(${transZ}px) scale3d(${scale}, ${scale}, 1)`;
        frame.style.boxShadow = `0 -${shadowSpread}px ${shadowBlur}px rgba(22, 21, 20, ${shadowAlpha}), 0 35px 80px rgba(0, 0, 0, 0.12)`;
      } else if (rect.top > enterStart) {
        // Below viewport
        frame.style.transform = `perspective(1600px) rotateX(8.5deg) translateY(45px) translateZ(-50px) scale3d(0.95, 0.95, 1)`;
      } else {
        // Settled in view
        frame.style.transform = `perspective(1600px) rotateX(0deg) translateY(0px) translateZ(0px) scale3d(1, 1, 1)`;
      }
    });
  }

  if (lenisInstance) {
    lenisInstance.on('scroll', updateFrames);
  }
  window.addEventListener('scroll', updateFrames, { passive: true });
  updateFrames();

  // Subtle Interactive Mouse Parallax on Story Frames
  frames.forEach(frame => {
    frame.addEventListener('mousemove', (e) => {
      const rect = frame.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.4 || rect.bottom < window.innerHeight * 0.2) return;
      const xNorm = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const yNorm = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      frame.style.transform = `perspective(1600px) rotateX(${(-yNorm * 1.5).toFixed(2)}deg) rotateY(${(xNorm * 1.5).toFixed(2)}deg) translateZ(0px) scale3d(1, 1, 1)`;
    });

    frame.addEventListener('mouseleave', () => {
      frame.style.transform = `perspective(1600px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)`;
    });
  });
}

// ============================================================================
// INITIALIZE APPLICATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initScrubAndChapters();
  initCharacterCursorFocus();
  init3DStoryFrames();
  initProjectsZoom();
  initTriageSimulator();
  initLutSwitcher();
  initCaseFileForm();
  initSoundToggle();
  initCompanion();
  initLiveTelemetry();
});
