/* ===========================================================
   ପବିତ୍ର ଶ୍ରୀ ଗଣେଶ ପୂଜା — Odia Royal Invitation Logic
   Includes: Instant Background Aarti Audio Playback,
   Real Temple Bell Audio & Shockwave Ring Animation,
   Continuous Pushpa Vrishti (Flowers & Golden Sparkles),
   Scroll Parallax Choreography, Live Odia Countdown Timer,
   and WhatsApp / Calendar Sharing.
   =========================================================== */

(function () {
  'use strict';

  /* --- Configuration --- */
  var CONFIG = {
    targetDate: new Date('2026-09-14T08:00:00+05:30'),
    mapsUrl: 'https://maps.app.goo.gl/wo4zj497SiN2LRAY8',
    venueText: 'କାଦୁଆ, ଶୁଣ୍ଢି ସାହି, କାମାକ୍ଷାନଗର (Kadua, Sundhi Sahi, Kamakhyanagar)',
    showWhatsApp: true,
    showPetals: true,
    soundEnabled: true,
    shareMessage: '🌸 *ଜୟ ଶ୍ରୀ ଗଣେଶ!* 🌸\n\n*ବିଘ୍ନହର୍ତ୍ତା ପୂଜା କମିଟି (VIGHNAHARTA PUJA COMMITTEE)* ତରଫରୁ ଆପଣଙ୍କୁ ଏବଂ ଆପଣଙ୍କ ପରିବାରବର୍ଗଙ୍କୁ ପବିତ୍ର ଶ୍ରୀ ଗଣେଶ ପୂଜା, ଦର୍ଶନ, ଆଳତି ଏବଂ ପ୍ରସାଦ ସେବନ ନିମନ୍ତେ ସପରିବାର ସସ୍ନେହ ନିମନ୍ତ୍ରଣ।\n\n📅 *ପବିତ୍ର ତିଥି:* ୧୪ ସେପ୍ଟେମ୍ବର ୨୦୨୬\n🌅 *ପ୍ରାତଃ ଆଳତି:* ସକାଳ ୮:୦୦ ଘଟିକା\n🪔 *ସନ୍ଧ୍ୟା ଆଳତି:* ସନ୍ଧ୍ୟା ୭:୩୦ ଘଟିକା\n📍 *ପୂଜା ସ୍ଥଳ:* କାଦୁଆ, ଶୁଣ୍ଢି ସାହି, କାମାକ୍ଷାନଗର (Kadua, Sundhi Sahi, Kamakhyanagar)\n\n— *ବିଘ୍ନହର୍ତ୍ତା ପୂଜା କମିଟି*\n\n🗺️ *ରାସ୍ତା (Google Maps):* '
  };

  /* --- Element Lookup --- */
  var el = {};
  function initElements() {
    [
      'heroVideo', 'heroText', 'sec2', 'sec3', 'garlandL', 'garlandR',
      'bell1', 'bell2', 'bell3', 'bell4', 'diyaL', 'diyaR',
      'invite', 'card', 'cardRegion', 'mouse', 'bubble',
      'petals', 'shareBtn', 'mapBtn', 'calBtn', 'copyAddressBtn',
      'bgMusic', 'bellAudio', 'petalCanvas', 'toast',
      'cdDays', 'cdHours', 'cdMins', 'cdSecs'
    ].forEach(function (id) {
      el[id] = document.getElementById(id);
    });
  }

  // Pre-initialize elements
  initElements();

  /* --- Instant Background Devotional Aarti Music (Lord Ganesha.mp3) --- */
  var musicStarted = false;
  var audioCtx = null;

  function tryUnlockAudioContext() {
    try {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass && !audioCtx) {
        audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } catch (e) { }
  }

  function playAartiInstantly() {
    if (musicStarted) return;
    tryUnlockAudioContext();

    var audio = el.bgMusic || document.getElementById('bgMusic');
    if (!audio) {
      audio = new Audio('Lord%20Ganesha.mp3');
      audio.id = 'bgMusic';
      document.body.appendChild(audio);
      el.bgMusic = audio;
    }

    audio.volume = 0.95;
    var playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(function () {
        musicStarted = true;
      }).catch(function () {
        // Modern browser autoplay restrictions: unlock instantly on first interaction gesture
        setupInstantAutoplayUnlock();
      });
    }
  }

  function setupInstantAutoplayUnlock() {
    var unlockAudio = function () {
      if (musicStarted) return;
      tryUnlockAudioContext();

      var audio = el.bgMusic || document.getElementById('bgMusic');
      if (audio) {
        audio.volume = 0.95;
        audio.play().then(function () {
          musicStarted = true;
        }).catch(function () { });
      }

      var events = ['click', 'touchstart', 'touchend', 'pointerdown', 'pointerup', 'mousedown', 'keydown', 'scroll', 'wheel', 'mousemove'];
      events.forEach(function (evt) {
        window.removeEventListener(evt, unlockAudio, true);
        document.removeEventListener(evt, unlockAudio, true);
        if (document.body) document.body.removeEventListener(evt, unlockAudio, true);
      });
    };

    var events = ['click', 'touchstart', 'touchend', 'pointerdown', 'pointerup', 'mousedown', 'keydown', 'scroll', 'wheel', 'mousemove'];
    events.forEach(function (evt) {
      window.addEventListener(evt, unlockAudio, { capture: true, passive: true });
      document.addEventListener(evt, unlockAudio, { capture: true, passive: true });
      if (document.body) document.body.addEventListener(evt, unlockAudio, { capture: true, passive: true });
    });
  }

  // Trigger instant playback on script execution, DOM ready, and window load
  playAartiInstantly();
  document.addEventListener('DOMContentLoaded', playAartiInstantly);
  window.addEventListener('load', playAartiInstantly);

  /* --- Real Temple Bell Sound (soundreality-bell.mp3) --- */
  function playTempleBell() {
    if (!CONFIG.soundEnabled) return;
    tryUnlockAudioContext();
    try {
      var bell = new Audio('soundreality-bell.mp3');
      bell.volume = 0.95;
      var promise = bell.play();
      if (promise !== undefined) {
        promise.catch(function () { });
      }
    } catch (e) {
      if (el.bellAudio) {
        el.bellAudio.currentTime = 0;
        el.bellAudio.play().catch(function () { });
      }
    }
  }

  function ringBellElement(bellNode) {
    if (!bellNode) return;
    playTempleBell();

    bellNode.classList.remove('ringing');
    void bellNode.offsetWidth;
    bellNode.classList.add('ringing');

    // Shower extra petals and sparkles on bell ring
    spawnPetals(24);
    if (!isShowering) {
      isShowering = true;
      runShowerLoop();
    }

    setTimeout(function () {
      bellNode.classList.remove('ringing');
    }, 1200);
  }

  /* --- Abundant Pushpa Vrishti (Flowers & Golden Sparkles Engine) --- */
  var particles = [];
  var canvasCtx = null;
  var isShowering = false;

  var PETAL_COLORS = [
    '#e84118', '#c23616', // Sacred red rose
    '#e056fd', '#ff78cb', // Pink lotus
    '#f0932b', '#ff9f1a', // Saffron marigold
    '#f6b93b', '#ffd32a', // Golden yellow marigold
    '#ffffff', '#fdf6e2'  // White mogra / Jasmine
  ];

  var SPARKLE_COLORS = [
    '#ffd700', '#fff3a8', '#ffeaa7', '#ffffff'
  ];

  function resizeCanvas() {
    if (!el.petalCanvas) return;
    el.petalCanvas.width = window.innerWidth;
    el.petalCanvas.height = window.innerHeight;
  }

  function spawnPetals(count) {
    if (!el.petalCanvas) return;
    var w = el.petalCanvas.width;
    for (var i = 0; i < count; i++) {
      var isSparkle = Math.random() < 0.35; // 35% sparkles, 65% flowers

      if (isSparkle) {
        particles.push({
          type: 'sparkle',
          x: Math.random() * w,
          y: -15 - Math.random() * 80,
          vx: (Math.random() - 0.5) * 2.2,
          vy: 1.8 + Math.random() * 3.2,
          size: 4 + Math.random() * 8,
          rotation: Math.random() * 360,
          vr: (Math.random() - 0.5) * 8,
          color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
          opacity: 0.95,
          twinkle: Math.random() * Math.PI,
          twinkleSpeed: 0.08 + Math.random() * 0.08
        });
      } else {
        particles.push({
          type: 'petal',
          x: Math.random() * w,
          y: -20 - Math.random() * 100,
          vx: (Math.random() - 0.5) * 3,
          vy: 2.2 + Math.random() * 3.8,
          size: 9 + Math.random() * 15,
          rotation: Math.random() * 360,
          vr: (Math.random() - 0.5) * 6,
          color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
          opacity: 0.92,
          swing: Math.random() * Math.PI * 2,
          swingSpeed: 0.04 + Math.random() * 0.04
        });
      }
    }
  }

  function triggerPushpaVrishti(amount) {
    spawnPetals(amount || 140);
    if (!isShowering) {
      isShowering = true;
      runShowerLoop();
    }
  }

  function runShowerLoop() {
    if (!canvasCtx || !el.petalCanvas) return;
    canvasCtx.clearRect(0, 0, el.petalCanvas.width, el.petalCanvas.height);

    var h = el.petalCanvas.height;

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];

      if (p.type === 'sparkle') {
        p.twinkle += p.twinkleSpeed;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;
        var currentAlpha = Math.max(0.2, Math.min(1, Math.sin(p.twinkle) * 0.5 + 0.5));

        canvasCtx.save();
        canvasCtx.translate(p.x, p.y);
        canvasCtx.rotate((p.rotation * Math.PI) / 180);
        canvasCtx.globalAlpha = p.opacity * currentAlpha;
        canvasCtx.fillStyle = p.color;
        canvasCtx.shadowColor = '#ffd700';
        canvasCtx.shadowBlur = 8;

        // Draw 4-pointed golden sparkle star
        var s = p.size;
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, -s);
        canvasCtx.quadraticCurveTo(0, 0, s, 0);
        canvasCtx.quadraticCurveTo(0, 0, 0, s);
        canvasCtx.quadraticCurveTo(0, 0, -s, 0);
        canvasCtx.quadraticCurveTo(0, 0, 0, -s);
        canvasCtx.fill();
        canvasCtx.restore();
      } else {
        p.swing += p.swingSpeed;
        p.x += p.vx + Math.sin(p.swing) * 1.4;
        p.y += p.vy;
        p.rotation += p.vr;

        canvasCtx.save();
        canvasCtx.translate(p.x, p.y);
        canvasCtx.rotate((p.rotation * Math.PI) / 180);
        canvasCtx.globalAlpha = p.opacity;
        canvasCtx.fillStyle = p.color;

        // Draw curved flower petal
        canvasCtx.beginPath();
        canvasCtx.ellipse(0, 0, p.size, p.size * 0.62, 0, 0, Math.PI * 2);
        canvasCtx.fill();
        canvasCtx.restore();
      }

      if (p.y > h + 30) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      requestAnimationFrame(runShowerLoop);
    } else {
      isShowering = false;
    }
  }

  /* Continuous subtle ambient falling petals & glitters */
  function ambientDrift() {
    if (particles.length < 35) {
      spawnPetals(4);
      if (!isShowering) {
        isShowering = true;
        runShowerLoop();
      }
    }
  }

  /* --- Live Countdown Timer --- */
  function updateCountdown() {
    var now = new Date();
    var diff = CONFIG.targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      if (el.cdDays) el.cdDays.textContent = '00';
      if (el.cdHours) el.cdHours.textContent = '00';
      if (el.cdMins) el.cdMins.textContent = '00';
      if (el.cdSecs) el.cdSecs.textContent = '00';
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var mins = Math.floor((diff / 1000 / 60) % 60);
    var secs = Math.floor((diff / 1000) % 60);

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    if (el.cdDays) el.cdDays.textContent = pad(days);
    if (el.cdHours) el.cdHours.textContent = pad(hours);
    if (el.cdMins) el.cdMins.textContent = pad(mins);
    if (el.cdSecs) el.cdSecs.textContent = pad(secs);
  }

  /* --- Toast Helper --- */
  var toastTimeout = null;
  function showToast(message) {
    if (!el.toast) return;
    el.toast.textContent = message;
    el.toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      el.toast.classList.remove('show');
    }, 3200);
  }

  /* --- Copy Address --- */
  function copyVenueAddress() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CONFIG.venueText).then(function () {
        showToast('📋 ପୂଜା ସ୍ଥଳ ଠିକଣା କପି ହୋଇଗଲା!');
      }).catch(function () {
        showToast('📍 ' + CONFIG.venueText);
      });
    } else {
      showToast('📍 ' + CONFIG.venueText);
    }
  }

  /* --- Add to Calendar --- */
  function addToCalendar() {
    var title = encodeURIComponent('ଶ୍ରୀ ଗଣେଶ ପୂଜା, ଆଳତି ଓ ଦର୍ଶନ (Ganesh Puja)');
    var details = encodeURIComponent('ଆପଣଙ୍କୁ ଏବଂ ଆପଣଙ୍କ ପରିବାରବର୍ଗଙ୍କୁ ପବିତ୍ର ଶ୍ରୀ ଗଣେଶ ପୂଜା, ଆଳତି ଓ ପ୍ରସାଦ ସେବନ ନିମନ୍ତେ ସସ୍ନେହ ନିମନ୍ତ୍ରଣ।\nପ୍ରାତଃ ଆଳତି: ସକାଳ ୮:୦୦ | ସନ୍ଧ୍ୟା ଆଳତି: ସନ୍ଧ୍ୟା ୭:୩୦');
    var location = encodeURIComponent(CONFIG.venueText);
    var startIso = '20260914T080000';
    var endIso = '20260915T210000';

    var googleCalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
      title + '&dates=' + startIso + '/' + endIso + '&details=' + details + '&location=' + location;

    window.open(googleCalUrl, '_blank', 'noopener');
  }

  /* --- Easing & Scroll Helpers --- */
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function seg(p, a, b) { return clamp01((p - a) / (b - a)); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function sceneProgress(node, viewportH) {
    var r = node.getBoundingClientRect();
    return clamp01((viewportH - r.top) / Math.max(1, r.height));
  }

  var BELLS = [
    ['bell1', 0.04, 0.30, -150],
    ['bell2', 0.08, 0.36, -190],
    ['bell3', 0.11, 0.40, -190],
    ['bell4', 0.15, 0.46, -150]
  ];

  /* --- Per-Frame Scroll Choreography --- */
  function frame() {
    var vh = window.innerHeight;

    /* Scene 02 */
    if (el.sec2) {
      var p = sceneProgress(el.sec2, vh);

      var g = easeOut(seg(p, 0, 0.26));
      if (el.garlandL) {
        el.garlandL.style.transform = 'translate3d(' + (-115 * (1 - g)) + '%,0,0)';
      }
      if (el.garlandR) {
        el.garlandR.style.transform = 'translate3d(' + (115 * (1 - g)) + '%,0,0)';
      }

      BELLS.forEach(function (spec) {
        var node = el[spec[0]];
        if (!node) return;
        var t = easeOut(seg(p, spec[1], spec[2]));
        node.style.transform = 'translate3d(0,' + (spec[3] * (1 - t)) + '%,0)';
      });

      var d = easeOut(seg(p, 0.26, 0.54));
      if (el.diyaL) {
        el.diyaL.style.transform = 'translate3d(' + (-130 * (1 - d)) + '%,0,0)';
      }
      if (el.diyaR) {
        el.diyaR.style.transform = 'translate3d(' + (130 * (1 - d)) + '%,0,0) scaleX(-1)';
      }

      var i = seg(p, 0.44, 0.70);
      if (el.invite) {
        el.invite.style.opacity = i;
        el.invite.style.transform =
          'translate3d(0,' + (26 * (1 - easeOut(i))) + 'px,0) scale(' + (0.96 + 0.04 * i) + ')';
      }
    }

    /* Scene 03 */
    if (el.sec3) {
      var p3 = sceneProgress(el.sec3, vh);

      var c = seg(p3, 0.10, 0.42);
      if (el.card) {
        var s = 1;
        if (el.cardRegion && el.card.scrollHeight) {
          s = Math.max(0.72, Math.min(1, (el.cardRegion.clientHeight - 8) / el.card.scrollHeight));
        }
        el.card.style.opacity = c;
        el.card.style.transform =
          'translate3d(0,' + (28 * (1 - easeOut(c))) + 'px,0) scale(' + s + ')';
      }

      var m = easeOut(seg(p3, 0.22, 0.58));
      if (el.mouse) {
        el.mouse.style.transform = 'translate3d(' + (135 * (1 - m)) + '%,0,0)';
      }
      if (el.bubble) {
        el.bubble.style.opacity = seg(p3, 0.58, 0.74);
      }
    }

    /* Scene 01 Hero Fade */
    if (el.heroText) {
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      el.heroText.style.opacity = Math.max(0, 1 - y / (vh * 0.45));
    }
  }

  /* --- Render Loop --- */
  var rafId = null;
  var beatId = null;
  var countdownTimer = null;
  var ambientTimer = null;
  var looping = false;

  function loop() {
    frame();
    if (document.hidden) { looping = false; return; }
    looping = true;
    rafId = requestAnimationFrame(loop);
  }

  function kickVideo() {
    var v = el.heroVideo;
    if (!v || !v.paused) return;
    v.muted = true;
    var pr = v.play();
    if (pr && pr.catch) pr.catch(function () { });
  }

  function tick() {
    frame();
    kickVideo();
  }

  /* --- Navigation & Sharing --- */
  function openMap() {
    window.open(CONFIG.mapsUrl, '_blank', 'noopener');
  }

  function shareOnWhatsApp() {
    var text = CONFIG.shareMessage + CONFIG.mapsUrl;
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
  }

  /* --- Boot Initialization --- */
  function start() {
    initElements();

    if (el.petalCanvas) {
      canvasCtx = el.petalCanvas.getContext('2d');
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    }

    // Auto trigger grand flower & sparkle shower on page load / refresh!
    setTimeout(function () {
      triggerPushpaVrishti(140);
    }, 250);

    // Continuous ambient falling petals and sparkles
    ambientTimer = setInterval(ambientDrift, 1400);

    // Trigger instant background music
    playAartiInstantly();

    // Interactive Bells
    ['bell1', 'bell2', 'bell3', 'bell4'].forEach(function (id) {
      var bellNode = el[id];
      if (bellNode) {
        bellNode.addEventListener('click', function () {
          ringBellElement(bellNode);
        });
        bellNode.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            ringBellElement(bellNode);
          }
        });
      }
    });

    // Action Buttons
    if (el.copyAddressBtn) {
      el.copyAddressBtn.addEventListener('click', copyVenueAddress);
    }

    if (el.calBtn) {
      el.calBtn.addEventListener('click', addToCalendar);
    }

    if (el.shareBtn) {
      el.shareBtn.hidden = !CONFIG.showWhatsApp;
      el.shareBtn.addEventListener('click', shareOnWhatsApp);
    }

    if (el.mapBtn) {
      el.mapBtn.addEventListener('click', openMap);
    }

    // Countdown
    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);

    // Scroll listeners
    document.addEventListener('scroll', tick, { passive: true, capture: true });
    window.addEventListener('resize', tick);
    document.addEventListener('visibilitychange', function () {
      tick();
      if (!looping) loop();
    });

    beatId = setInterval(tick, 100);
    loop();
  }

  window.addEventListener('pagehide', function () {
    cancelAnimationFrame(rafId);
    clearInterval(beatId);
    clearInterval(countdownTimer);
    clearInterval(ambientTimer);
  });

  /* --- Remove Netlify Injected Drawer & Badges --- */
  function cleanNetlifyWidgets() {
    var selectors = [
      'netlify-drawer', 'netlify-feedback', '#netlify-drawer', '.netlify-drawer',
      '#netlify-notification', '.netlify-notification', '#netlify-feedback', '.netlify-feedback',
      '#netlify-collaborative-tools', '.netlify-collaborative-tools',
      'iframe[src*="netlify"]', 'iframe[id*="netlify"]', 'iframe[class*="netlify"]',
      'div[class*="netlify"]', 'div[id*="netlify"]', '[data-netlify-feedback]', '[data-netlify-drawer]'
    ];
    try {
      selectors.forEach(function (sel) {
        var elements = document.querySelectorAll(sel);
        for (var i = 0; i < elements.length; i++) {
          var elNode = elements[i];
          if (elNode && elNode.parentNode) {
            elNode.parentNode.removeChild(elNode);
          }
        }
      });
    } catch (e) {}
  }

  // Active continuous cleaner
  cleanNetlifyWidgets();
  setInterval(cleanNetlifyWidgets, 250);

  if (typeof MutationObserver !== 'undefined') {
    var netlifyObserver = new MutationObserver(cleanNetlifyWidgets);
    if (document.documentElement) {
      netlifyObserver.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
