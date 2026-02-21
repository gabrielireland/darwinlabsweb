// lang.js
document.addEventListener('DOMContentLoaded', () => {
  const langButtons = {
    es: document.getElementById('lang-es'),
    en: document.getElementById('lang-en')
  };

  const updateInternalLinks = (lang) => {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      // ignore anchors and special schemes
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      try {
        const u = new URL(href, location.href);
        // only touch same-origin links; leave external links alone
        if (u.origin === location.origin) {
          u.searchParams.set('lang', lang);
          a.setAttribute('href', u.href); // keep full URL (origin + path + search + hash)
        }
      } catch (e) {
        // ignore malformed URLs
      }
    });
  };

  const setLanguage = (lang) => {
    try { localStorage.setItem('dg_lang', lang); } catch(e) {}
    document.documentElement.lang = lang;

    // buttons
    Object.values(langButtons).forEach(btn => btn && btn.classList.remove('active'));
    if (langButtons[lang]) langButtons[lang].classList.add('active');

    // show/hide content
    document.querySelectorAll('[data-lang]').forEach(el => {
      el.classList.toggle('hidden', el.dataset.lang !== lang);
    });

    // placeholders
    const phAttr = `data-lang-${lang}-placeholder`;
    document.querySelectorAll(`[${phAttr}]`).forEach(el => {
      el.placeholder = el.getAttribute(phAttr);
    });

    // update current URL without reload
    try {
      const cur = new URL(location.href);
      cur.searchParams.set('lang', lang);
      history.replaceState({}, '', cur.pathname + cur.search + cur.hash);
    } catch(e) {}

    // update links for future navigation
    updateInternalLinks(lang);
  };

  // Initial lang: URL > localStorage > browser default
  const urlLangRaw = new URLSearchParams(location.search).get('lang');
  const urlLang = (urlLangRaw === 'en' || urlLangRaw === 'es') ? urlLangRaw : null;
  let savedLang = null;
  try { savedLang = localStorage.getItem('dg_lang'); } catch(e) {}
  const defaultLang = (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'es';
  const initialLang = urlLang || (savedLang === 'en' || savedLang === 'es' ? savedLang : null) || defaultLang;

  // Wire buttons
  if (langButtons.es) langButtons.es.addEventListener('click', () => setLanguage('es'));
  if (langButtons.en) langButtons.en.addEventListener('click', () => setLanguage('en'));

  // Apply now
  setLanguage(initialLang);

  // Mobile menu (optional)
  const mobileBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  }

  // Reveal-on-scroll (optional)
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
        });
      }, {threshold: 0.1}).observe(el);
    } else { el.classList.add('is-visible'); }
  });
});

// --- Mission Section Canvas Animation ---
(function initMissionAnimation() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var section = document.getElementById('about');
  var canvas = document.getElementById('mission-canvas');
  if (!section || !canvas) return;

  var ctx = canvas.getContext('2d');
  var TAU = Math.PI * 2;

  // Brand palette as RGB strings
  var C_DARK = '57,89,53';
  var C_BASE = '70,99,58';
  var C_MED = '87,111,80';
  var C_ACCENT = '93,113,63';
  // Extra nature colors
  var C_AMBER = '180,130,40';
  var C_GOLD = '160,120,50';
  var C_TEAL = '60,120,100';
  var C_WARM = '140,90,50';
  var C_SAGE = '120,140,90';
  // Butterfly color palettes (wings, body)
  var BFLY_COLORS = [
    { wing: C_DARK, body: C_BASE },
    { wing: C_TEAL, body: C_DARK },
    { wing: '70,110,160', body: '50,75,120' },
    { wing: C_ACCENT, body: C_MED },
    { wing: '130,100,60', body: C_DARK }
  ];
  // Bee color palettes (body, stripe, wing)
  var BEE_COLORS = [
    { body: C_AMBER, stripe: C_DARK, wing: C_SAGE },
    { body: C_GOLD, stripe: '80,60,30', wing: C_ACCENT },
    { body: C_BASE, stripe: C_DARK, wing: C_ACCENT },
    { body: '150,120,50', stripe: C_DARK, wing: C_MED }
  ];

  var W, H, dpr, nodes, butterflies, bees, t;
  var animationId = null;
  var initialized = false;

  function mobile() { return window.innerWidth < 768; }

  // Bias random values toward edges (0..0.35 or 0.65..1)
  function edgeBias() {
    var r = Math.random();
    return r < 0.5 ? r * 0.4 : 0.6 + r * 0.4;
  }

  function makeButterfly(idx) {
    var colors = BFLY_COLORS[idx % BFLY_COLORS.length];
    return {
      x: Math.random() * (W || 800), y: Math.random() * (H || 600),
      angle: Math.random() * TAU,
      speed: 0.3 + Math.random() * 0.2,
      size: 12 + Math.random() * 8,
      phase: Math.random() * TAU,
      opacity: 0.2 + Math.random() * 0.1,
      wingColor: colors.wing,
      bodyColor: colors.body
    };
  }

  function makeBee(idx) {
    var colors = BEE_COLORS[idx % BEE_COLORS.length];
    return {
      x: Math.random() * (W || 800), y: Math.random() * (H || 600),
      angle: Math.random() * TAU,
      speed: 0.6 + Math.random() * 0.3,
      size: 6 + Math.random() * 3,
      phase: Math.random() * TAU,
      opacity: 0.22 + Math.random() * 0.1,
      bodyColor: colors.body,
      stripeColor: colors.stripe,
      wingColor: colors.wing
    };
  }

  function init() {
    var rect = section.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    W = rect.width;
    H = rect.height || window.innerHeight * 0.85;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    t = 0;

    var m = mobile();
    var edgeNodeCount = m ? 7 : 12;
    var bottomNodeCount = m ? 4 : 6;

    // Node color palettes for variety
    var nodeColors = [C_BASE, C_MED, C_ACCENT, C_SAGE, C_TEAL];

    nodes = [];
    // Edge-biased nodes — skip bottom-right quadrant
    for (var i = 0; i < edgeNodeCount; i++) {
      var nx, ny;
      do {
        nx = edgeBias() * W;
        ny = edgeBias() * H;
      } while (nx > W * 0.6 && ny > H * 0.55);
      nodes.push({
        x: nx, y: ny,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        r: 2.5 + Math.random() * 2.5,
        opacity: 0.2 + Math.random() * 0.2,
        pulse: Math.random() * TAU,
        color: nodeColors[i % nodeColors.length]
      });
    }
    // Bottom-biased nodes — left/center only (0..65% width)
    for (var ib = 0; ib < bottomNodeCount; ib++) {
      nodes.push({
        x: Math.random() * W * 0.65,
        y: H * 0.6 + Math.random() * H * 0.38,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.04,
        r: 2 + Math.random() * 2,
        opacity: 0.12 + Math.random() * 0.15,
        pulse: Math.random() * TAU,
        color: nodeColors[ib % nodeColors.length]
      });
    }

    butterflies = [];
    for (var b = 0; b < (m ? 2 : 3); b++) butterflies.push(makeButterfly(b));

    bees = [];

    initialized = true;
  }

  // --- Drawing functions ---

  function drawWaves() {
    var cy = H / 2;
    var phase = t * 0.0008;

    // Single gentle sine wave
    ctx.beginPath();
    for (var x = 0; x <= W; x += 3) {
      var y = cy + H * 0.1 * Math.sin((x / W) * TAU * 1.4 + phase);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(' + C_BASE + ',0.1)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  function drawNetwork() {
    var maxDist = Math.min(W, H) * 0.3;

    // Edge colors for variety
    var edgeColors = [C_MED, C_SAGE, C_TEAL, C_ACCENT];

    // Edges
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[j].x - nodes[i].x;
        var dy = nodes[j].y - nodes[i].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          var eo = 0.18 * (1 - d / maxDist);
          var ec = edgeColors[(i + j) % edgeColors.length];
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = 'rgba(' + ec + ',' + eo.toFixed(3) + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Nodes
    for (var k = 0; k < nodes.length; k++) {
      var n = nodes[k];
      var pulse = Math.sin(t * 0.03 + n.pulse) * 0.8;
      ctx.beginPath();
      ctx.arc(n.x, n.y, Math.max(0.5, n.r + pulse), 0, TAU);
      ctx.fillStyle = 'rgba(' + n.color + ',' + n.opacity.toFixed(3) + ')';
      ctx.fill();
    }
  }

  function updateNodes() {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      n.x = Math.max(0, Math.min(W, n.x));
      n.y = Math.max(0, Math.min(H, n.y));
    }
  }

  function drawButterfly(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    // Gentle tilt based on slow sine — no heading rotation, no spinning
    var tilt = Math.sin(t * 0.008 + b.phase) * 0.15;
    ctx.rotate(tilt);
    var flap = 0.5 + 0.5 * Math.abs(Math.sin(t * 0.04 + b.phase));
    ctx.scale(flap, 1);
    var s = b.size;
    ctx.fillStyle = 'rgba(' + b.wingColor + ',' + b.opacity.toFixed(3) + ')';
    ctx.beginPath();
    // Upper left wing
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-s * 0.6, -s * 0.8, -s * 1.1, -s * 0.4, -s * 0.7, s * 0.05);
    // Lower left wing
    ctx.bezierCurveTo(-s * 0.9, s * 0.5, -s * 0.4, s * 0.8, 0, s * 0.3);
    // Lower right wing
    ctx.bezierCurveTo(s * 0.4, s * 0.8, s * 0.9, s * 0.5, s * 0.7, s * 0.05);
    // Upper right wing
    ctx.bezierCurveTo(s * 1.1, -s * 0.4, s * 0.6, -s * 0.8, 0, 0);
    ctx.fill();
    // Wing spots (inner markings)
    ctx.fillStyle = 'rgba(' + b.bodyColor + ',' + (b.opacity * 0.5).toFixed(3) + ')';
    ctx.beginPath();
    ctx.arc(-s * 0.4, -s * 0.15, s * 0.15, 0, TAU);
    ctx.arc(s * 0.4, -s * 0.15, s * 0.15, 0, TAU);
    ctx.fill();
    // Body
    ctx.fillStyle = 'rgba(' + b.bodyColor + ',' + (b.opacity * 1.4).toFixed(3) + ')';
    ctx.beginPath();
    ctx.ellipse(0, s * 0.15, s * 0.07, s * 0.4, 0, 0, TAU);
    ctx.fill();
    // Antennae
    ctx.strokeStyle = 'rgba(' + b.bodyColor + ',' + (b.opacity * 1.0).toFixed(3) + ')';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-s * 0.04, -s * 0.2);
    ctx.quadraticCurveTo(-s * 0.2, -s * 0.55, -s * 0.25, -s * 0.6);
    ctx.moveTo(s * 0.04, -s * 0.2);
    ctx.quadraticCurveTo(s * 0.2, -s * 0.55, s * 0.25, -s * 0.6);
    ctx.stroke();
    ctx.restore();
  }

  function drawBee(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    // Gentle wobble, not full heading rotation
    var wobble = Math.sin(t * 0.02 + b.phase) * 0.2;
    ctx.rotate(wobble);
    var s = b.size;
    // Wings first (behind body) — large and visible
    var wFlap = 0.7 + 0.3 * Math.sin(t * 0.3 + b.phase);
    ctx.fillStyle = 'rgba(' + b.wingColor + ',' + (b.opacity * 0.55).toFixed(3) + ')';
    // Left wing — big teardrop
    ctx.beginPath();
    ctx.ellipse(-s * 0.3, -s * 0.55, s * 0.55 * wFlap, s * 0.3, -0.35, 0, TAU);
    ctx.fill();
    // Right wing
    ctx.beginPath();
    ctx.ellipse(s * 0.3, -s * 0.55, s * 0.55 * wFlap, s * 0.3, 0.35, 0, TAU);
    ctx.fill();
    // Wing outline for visibility
    ctx.strokeStyle = 'rgba(' + b.wingColor + ',' + (b.opacity * 0.3).toFixed(3) + ')';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.ellipse(-s * 0.3, -s * 0.55, s * 0.55 * wFlap, s * 0.3, -0.35, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(s * 0.3, -s * 0.55, s * 0.55 * wFlap, s * 0.3, 0.35, 0, TAU);
    ctx.stroke();
    // Body — plump oval
    ctx.fillStyle = 'rgba(' + b.bodyColor + ',' + b.opacity.toFixed(3) + ')';
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.45, s * 0.7, 0, 0, TAU);
    ctx.fill();
    // Stripes
    ctx.strokeStyle = 'rgba(' + b.stripeColor + ',' + (b.opacity * 0.7).toFixed(3) + ')';
    ctx.lineWidth = 1;
    for (var stripe = -1; stripe <= 1; stripe++) {
      ctx.beginPath();
      ctx.moveTo(-s * 0.4, stripe * s * 0.24);
      ctx.lineTo(s * 0.4, stripe * s * 0.24);
      ctx.stroke();
    }
    // Head
    ctx.fillStyle = 'rgba(' + b.stripeColor + ',' + (b.opacity * 0.8).toFixed(3) + ')';
    ctx.beginPath();
    ctx.arc(0, -s * 0.65, s * 0.2, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function updateButterfly(b) {
    // Smooth, gentle drift — no spinning. Uses slow sine/cosine for a lazy figure-8 path
    b.x += Math.sin(t * 0.004 + b.phase) * 0.4 + Math.cos(t * 0.002 + b.phase * 1.3) * 0.15;
    b.y += Math.cos(t * 0.003 + b.phase * 0.7) * 0.35 + Math.sin(t * 0.005 + b.phase * 1.5) * 0.1;
    // Soft edge bounce
    if (b.x < W * 0.05) b.x += 0.5;
    if (b.x > W * 0.95) b.x -= 0.5;
    if (b.y < H * 0.05) b.y += 0.4;
    if (b.y > H * 0.95) b.y -= 0.4;
    b.x = Math.max(0, Math.min(W, b.x));
    b.y = Math.max(0, Math.min(H, b.y));
  }

  function updateBee(b) {
    // Bees: slightly erratic but not spinning
    b.angle += (Math.random() - 0.5) * 0.05;
    var margin = 0.1;
    if (b.x < W * margin) b.angle += 0.03;
    if (b.x > W * (1 - margin)) b.angle -= 0.03;
    if (b.y < H * margin) b.angle += 0.03;
    if (b.y > H * (1 - margin)) b.angle -= 0.03;
    b.x += Math.cos(b.angle) * b.speed + (Math.random() - 0.5) * 0.3;
    b.y += Math.sin(b.angle) * b.speed + (Math.random() - 0.5) * 0.3;
    b.x = Math.max(0, Math.min(W, b.x));
    b.y = Math.max(0, Math.min(H, b.y));
  }

  function drawVignette() {
    var cx = W / 2, cy = H / 2;
    var innerR = Math.min(W, H) * 0.15;
    var outerR = Math.max(W, H) * 0.7;
    var grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
    grad.addColorStop(0, 'rgba(240,243,239,0.55)');
    grad.addColorStop(0.35, 'rgba(240,243,239,0.3)');
    grad.addColorStop(0.7, 'rgba(240,243,239,0.05)');
    grad.addColorStop(1, 'rgba(240,243,239,0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // --- Main loop ---
  function tick() {
    ctx.clearRect(0, 0, W, H);
    t++;

    drawWaves();
    drawNetwork();
    updateNodes();

    for (var i = 0; i < butterflies.length; i++) {
      updateButterfly(butterflies[i]);
      drawButterfly(butterflies[i]);
    }
    for (var j = 0; j < bees.length; j++) {
      updateBee(bees[j]);
      drawBee(bees[j]);
    }

    drawVignette();
    animationId = requestAnimationFrame(tick);
  }

  // --- Intersection Observer: pause when off-screen ---
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        if (!initialized) init();
        if (animationId === null) animationId = requestAnimationFrame(tick);
      } else {
        if (animationId !== null) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    });
  }, { threshold: 0.05 });

  observer.observe(section);

  // --- Resize handling ---
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      init();
      if (section.getBoundingClientRect().top < window.innerHeight) {
        animationId = requestAnimationFrame(tick);
      }
    }, 200);
  });
})();
