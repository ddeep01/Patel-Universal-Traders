/**
 * Animations Module - Handles all animations for static site
 */

const Animations = {
  init() {
    this.animateCounters();
    this.initReveals();
    this.initParallax();
    this.initScrollTriggers();
    this.initWhyItemImages();
    this.initTyping();
    this.initMapMagnifier();
  },

  animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(c => this.runCount(c));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.runCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(c => io.observe(c));
  },

  runCount(el) {
    const target = parseInt(el.getAttribute('data-target') || 0);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    let start = null;

    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };

    requestAnimationFrame(step);
  },

  initReveals() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    const els = heroContent.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealHero = () => {
      els.forEach((el, idx) => {
        setTimeout(() => el.classList.add('in-view'), idx * 140);
      });
      window.heroRevealed = true;
      if (typeof startTyping === 'function') startTyping();
    };

    if (prefersReduced) {
      revealHero();
    } else if ('IntersectionObserver' in window) {
      const rect = heroContent.getBoundingClientRect();
      const initiallyVisible = (rect.top < window.innerHeight && rect.bottom > 0);
      let hasLeft = false;

      const heroIo = new IntersectionObserver((entries) => {
        const e = entries[0];
        if (!e) return;
        if (e.isIntersecting) {
          if (initiallyVisible && !hasLeft) return;
          revealHero();
          heroIo.unobserve(heroContent);
        } else {
          if (initiallyVisible) hasLeft = true;
        }
      }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });

      heroIo.observe(heroContent);
    } else {
      revealHero();
    }

    // Why items reveal
    const items = document.querySelectorAll('.why-item');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(i => i.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    items.forEach(i => io.observe(i));
  },

  initParallax() {
    const wrap = document.querySelector('.hero-video-wrap');
    if (!wrap) return;

    wrap.classList.add('parallax');
    let bounds = wrap.getBoundingClientRect();
    let mouseX = 0, mouseY = 0;
    let rafId = null;

    const updateBounds = () => { bounds = wrap.getBoundingClientRect(); };

    const onMove = (e) => {
      mouseX = (e.clientX - bounds.left) / bounds.width - 0.5;
      mouseY = (e.clientY - bounds.top) / bounds.height - 0.5;
      if (!rafId) rafId = requestAnimationFrame(this.applyTransform.bind(this, wrap, mouseX, mouseY));
    };

    wrap.addEventListener('mousemove', onMove, { passive: true });
    wrap.addEventListener('mouseleave', () => { wrap.style.transform = ''; });
    window.addEventListener('resize', updateBounds);
  },

  applyTransform(wrap, mouseX, mouseY) {
    const tx = mouseX * 6;
    const ty = mouseY * 4;
    wrap.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
  },

  initScrollTriggers() {
    const scrollElements = document.querySelectorAll('.scroll-fade-up');
    if (!scrollElements.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      scrollElements.forEach(el => el.classList.add('active'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      scrollElements.forEach(el => el.classList.add('active'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' });

    scrollElements.forEach(el => observer.observe(el));
  },

  initWhyItemImages() {
    const imgWrappers = document.querySelectorAll('.why-choose-us-alt .why-img');
    if (!imgWrappers.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      imgWrappers.forEach(w => w.classList.add('in-view'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      imgWrappers.forEach(w => w.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    imgWrappers.forEach(w => io.observe(w));
  },

  initTyping() {
    const el = document.querySelector('.hero-title .typewriter');
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const full = el.getAttribute('data-text') || el.textContent.trim();

    if (prefersReduced) {
      el.textContent = full;
      return;
    }

    const speed = 46;
    el.textContent = '';
    el.classList.add('typing');

    let i = 0;
    const tick = () => {
      i++;
      el.textContent = full.slice(0, i);
      if (i < full.length) setTimeout(tick, speed);
      else el.classList.remove('typing');
    };

    setTimeout(tick, 180);
  },

  /**
   * Map Magnifier - Creates a circular zoom lens that follows the cursor
   * Magnifies both the map image and the red markers when hovering over the map
   */
  initMapMagnifier() {
    // Do nothing on touch-only devices (use native pinch-to-zoom instead)
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
      console.log('Map magnifier disabled: touch-only device detected');
      return;
    }

    const wrap = document.querySelector('.map-wrap');
    const mapImg = wrap && wrap.querySelector('.world-map');
    if (!wrap || !mapImg) {
      console.warn('Map magnifier: .map-wrap or .world-map not found');
      return;
    }

    console.log('Map magnifier: Initializing...');

    // Create magnifier element
    const MAG_SIZE = 220; // px (diameter)
    const mag = document.createElement('div');
    mag.className = 'map-magnifier';
    mag.style.width = MAG_SIZE + 'px';
    mag.style.height = MAG_SIZE + 'px';
    mag.style.display = 'none';

    // Container for cloned markers
    const magMarkers = document.createElement('div');
    magMarkers.className = 'mag-markers';
    mag.appendChild(magMarkers);
    wrap.appendChild(mag);

    const scale = 2.0; // Magnification factor (2x zoom)
    const magW = MAG_SIZE;
    const magH = MAG_SIZE;

    // Prepare cloned marker elements inside magnifier
    const markers = wrap.querySelectorAll('.map-marker');
    console.log('Map magnifier: Found ' + markers.length + ' markers');
    const markerClones = [];
    markers.forEach((m) => {
      const clone = document.createElement('div');
      clone.className = 'mag-marker';
      const dot = document.createElement('span');
      dot.className = 'mag-dot';
      clone.appendChild(dot);
      magMarkers.appendChild(clone);
      markerClones.push({ original: m, clone: clone });
    });

    // Update background-size for magnifier based on map size
    const updateBgSize = () => {
      const mapRect = mapImg.getBoundingClientRect();
      mag.style.backgroundSize = (mapRect.width * scale) + 'px ' + (mapRect.height * scale) + 'px';
    };
    updateBgSize();
    window.addEventListener('resize', updateBgSize);

    let rafId = null;
    const last = { x: 0, y: 0, visible: false };

    const render = () => {
      rafId = null;
      const mapRect = mapImg.getBoundingClientRect();
      // Compute background-position so the point under cursor is centered in magnifier
      const rx = last.x - mapRect.left; // px from left of map
      const ry = last.y - mapRect.top;
      const bgX = rx * scale - magW / 2;
      const bgY = ry * scale - magH / 2;
      mag.style.backgroundPosition = (-bgX) + 'px ' + (-bgY) + 'px';

      // Position magnifier centered at cursor, clamped to map-wrap bounds
      const wrapRect = wrap.getBoundingClientRect();
      let left = last.x - wrapRect.left - magW / 2;
      let top = last.y - wrapRect.top - magH / 2;
      // Clamp to boundaries
      left = Math.max(0, Math.min(left, wrapRect.width - magW));
      top = Math.max(0, Math.min(top, wrapRect.height - magH));
      mag.style.left = left + 'px';
      mag.style.top = top + 'px';

      // Update cloned marker positions
      markerClones.forEach((item) => {
        const o = item.original.getBoundingClientRect();
        const mx = (o.left + o.width / 2) - mapRect.left; // px from left of map
        const my = (o.top + o.height / 2) - mapRect.top;
        // Position inside magnifier (scaled)
        const relX = (mx * scale) - bgX;
        const relY = (my * scale) - bgY;
        item.clone.style.left = relX + 'px';
        item.clone.style.top = relY + 'px';
      });
    };

    const scheduleRender = () => {
      if (!rafId) rafId = requestAnimationFrame(render);
    };

    const showMagnifier = () => {
      mag.style.display = 'block';
      console.log('Map magnifier: shown');
    };

    const hideMagnifier = () => {
      mag.style.display = 'none';
    };

    // Mouse move handler
    wrap.addEventListener('mousemove', function(e) {
      last.x = e.clientX;
      last.y = e.clientY;
      // Set background image (full-size map image url) on first move
      if (!mag.style.backgroundImage) {
        try {
          let src = mapImg.currentSrc || mapImg.src;
          if (!src) {
            console.warn('Map magnifier: No image source found');
            return;
          }
          // Convert relative paths to absolute if needed
          if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            const absoluteUrl = new URL(src, window.location.href).href;
            src = absoluteUrl;
          }
          mag.style.backgroundImage = 'url(' + src + ')';
          console.log('Map magnifier: background image set');
          updateBgSize();
        } catch (err) {
          console.error('Map magnifier: Error setting background image:', err);
        }
      }
      if (!last.visible) {
        last.visible = true;
        showMagnifier();
      }
      scheduleRender();
    });

    wrap.addEventListener('mouseenter', function() {
      last.visible = true;
      showMagnifier();
    });

    wrap.addEventListener('mouseleave', function() {
      last.visible = false;
      hideMagnifier();
    });

    // Keep magnifier updated on scroll
    window.addEventListener('scroll', function() {
      if (last.visible) scheduleRender();
    }, { passive: true });

    console.log('Map magnifier: Initialization complete');
  }
};

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Animations.init();
});
