import Lenis from 'lenis';

/**
 * KUNJ SODHI — SENIOR CREATIVE PORTFOLIO SUITE
 * - Interactive Custom Cursor & Magnetic Physics
 * - Signature Eye-Tracking Engine (Static Pose, Dynamic Gaze)
 * - Lenis Momentum Smooth Scroll Engine
 * - Interactive AI Triage Simulator Sandbox
 * - DaVinci Resolve Real-Time LUT Color Grading Engine
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
        lenisInstance.scrollTo(target, { offset: -76, duration: 1.35 });
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
    { id: 'hero', name: 'Prologue · Hero' },
    { id: 'about', name: 'Act 01 · Perspective' },
    { id: 'projects', name: 'Act 02 · Verified Builds' },
    { id: 'skills', name: 'Act 03 · Toolkit' },
    { id: 'editing', name: 'Act 04 · Video Reel' },
    { id: 'humor', name: 'Act 05 · Diagnostics' },
    { id: 'contact', name: 'Act 06 · Dossier' }
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

  let isMouseActive = false;

  function onPointerMove(e) {
    isMouseActive = true;
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

  function onMouseLeave() {
    isMouseActive = false;
    targetEyeX = 0;
    targetEyeY = 0;
  }

  // Smooth render loop for eye pupil gliding
  function renderEyes() {
    currentEyeX += (targetEyeX - currentEyeX) * 0.16;
    currentEyeY += (targetEyeY - currentEyeY) * 0.16;

    const eyeTransform = `translate(calc(-50% + ${currentEyeX.toFixed(1)}px), calc(-50% + ${currentEyeY.toFixed(1)}px))`;

    leftEye.style.transform = eyeTransform;
    rightEye.style.transform = eyeTransform;

    if (gazeStatus) {
      if (isMouseActive && (Math.abs(currentEyeX) > 0.4 || Math.abs(currentEyeY) > 0.4)) {
        const degX = Math.round((currentEyeX / 14) * 35);
        const degY = Math.round((currentEyeY / 9) * 25);
        const signX = degX >= 0 ? `+${degX}` : `${degX}`;
        const signY = degY >= 0 ? `+${degY}` : `${degY}`;
        gazeStatus.textContent = `EYES: [${signX}°, ${signY}°] · TRACKING CURSOR`;
      } else {
        gazeStatus.textContent = `EYES: [0°, 0°] · IDLE / AWAITING CURSOR`;
      }
    }

    requestAnimationFrame(renderEyes);
  }
  renderEyes();

  window.addEventListener('mousemove', onPointerMove, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);

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
// 13. 3D STORYTELLING FRAME ENTRANCE
// ============================================================================
function init3DStoryFrames() {
  const frames = document.querySelectorAll('.story-frame');
  const hero = document.getElementById('hero');

  if (!frames.length) return;

  function updateFrames() {
    const vh = window.innerHeight;
    const scrollY = window.scrollY;

    // Hero subtle fade on scroll
    if (hero) {
      const heroProg = Math.min(Math.max(scrollY / (vh * 0.75), 0), 1);
      const heroOpacity = (1 - heroProg * 0.28).toFixed(2);
      hero.style.opacity = heroOpacity;
    }

    // Each Story Frame 3D Elevation Entrance
    frames.forEach(frame => {
      const rect = frame.getBoundingClientRect();
      const enterStart = vh;
      const enterEnd = vh * 0.25;

      if (rect.top <= enterStart && rect.top >= enterEnd) {
        const progress = Math.min(Math.max((enterStart - rect.top) / (enterStart - enterEnd), 0), 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        const transY = ((1 - ease) * 25).toFixed(1);
        const scale = (0.98 + ease * 0.02).toFixed(3);

        frame.style.transform = `translateY(${transY}px) scale(${scale})`;
      } else if (rect.top < enterEnd) {
        frame.style.transform = '';
      } else {
        frame.style.transform = `translateY(25px) scale(0.98)`;
      }
    });
  }

  if (lenisInstance) {
    lenisInstance.on('scroll', updateFrames);
  }
  window.addEventListener('scroll', updateFrames, { passive: true });
  updateFrames();
}

// ============================================================================
// 14. MAGNETIC BUTTON PHYSICS (SENIOR FRONTEND INTERACTION STANDARD)
// ============================================================================
function initMagneticButtons() {
  const targets = document.querySelectorAll('.btn-main, .btn-alt, .btn-send-case, .hud-cta-btn, .hud-sound-btn, .companion-btn, .chip-btn');

  targets.forEach(el => {
    el.classList.add('btn-magnetic');

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);

      // Magnetic pull damping
      const pullX = (dx * 0.28).toFixed(1);
      const pullY = (dy * 0.28).toFixed(1);

      el.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

// ============================================================================
// 15. INTERACTIVE DUAL-RING CUSTOM CURSOR
// ============================================================================
function initCustomCursor() {
  const cursorWrap = document.getElementById('customCursor');
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const badge = document.getElementById('cursorBadge');

  if (!cursorWrap || !dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }, { passive: true });

  // Spring interpolation loop for smooth trailing ring
  function loop() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.transform = `translate(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  // Contextual cursor badges on hover
  const hoverConfigs = [
    { selector: '.btn-main, .btn-send-case, .hud-cta-btn', badge: 'LAUNCH', ringClass: 'is-hovering' },
    { selector: '.project-sheet', badge: 'EXPLORE', ringClass: 'is-card-hover' },
    { selector: '.skill-box', badge: 'TOOL', ringClass: 'is-card-hover' },
    { selector: '.davinci-btn', badge: 'LUT', ringClass: 'is-hovering' },
    { selector: '.character-stage', badge: 'EYES', ringClass: 'is-hovering' },
    { selector: '.companion-btn', badge: 'POKE', ringClass: 'is-hovering' }
  ];

  hoverConfigs.forEach(cfg => {
    document.querySelectorAll(cfg.selector).forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add(cfg.ringClass);
        if (badge) badge.textContent = cfg.badge;
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('is-hovering', 'is-card-hover');
        if (badge) badge.textContent = '';
      });
    });
  });
}

// ============================================================================
// INITIALIZE APPLICATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Smooth Scrolling & Layout Architecture
  initSmoothScroll();
  initScrubAndChapters();

  // 2. Interactive Systems
  initCustomCursor();
  initCharacterCursorFocus();
  init3DStoryFrames();
  initMagneticButtons();

  // 3. Feature Sandboxes
  initProjectsZoom();
  initTriageSimulator();
  initLutSwitcher();
  initCaseFileForm();
  initSoundToggle();
  initCompanion();
  initLiveTelemetry();
});
