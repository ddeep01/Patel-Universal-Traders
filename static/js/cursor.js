/**
 * CustomCursor - Production-Ready Cursor Component
 * Rice & Spices Import-Export Theme
 * 
 * Features:
 * - Smooth trailing cursor with smooth easing
 * - Context-aware icon switching (rice → spice)
 * - Keyboard accessibility (Tab/Enter)
 * - Touch device auto-disable
 * - prefers-reduced-motion support
 * - <2KB gzipped footprint
 * 
 * Usage: CustomCursor.init()
 */

const CustomCursor = (() => {
  // Configuration
  const config = {
    // Selectors for interactive elements that trigger hover state
    hoverSelectors: [
      'a',
      'button',
      '.product-card',
      '.cta-btn',
      '.btn',
      '[role="button"]',
      'input[type="button"]',
      'input[type="submit"]',
      'label',
      '.interactive',
    ],
    // Performance settings
    easeAmount: 0.15, // Lower = smoother, higher = snappier
    frameDelay: 1000 / 60, // 60 FPS target
    clickFeedbackDuration: 400,
  };

  // State
  let state = {
    enabled: false,
    isSupported: false,
    isTouch: false,
    isReducedMotion: false,
    mouseX: 0,
    mouseY: 0,
    cursorX: 0,
    cursorY: 0,
    isActive: false,
    isScrolling: false,
    lastMoveTime: 0,
    animationFrameId: null,
  };

  // DOM References
  let elements = {
    cursorElement: null,
    body: null,
  };

  /**
   * Check browser support for CSS cursor() function
   */
  function checkCursorSupport() {
    const testElement = document.createElement('div');
    testElement.style.cursor = 'url("/static/images/cursor-rice.svg"), auto';
    
    // If the cursor style persists (wasn't rejected), it's supported
    const isSupported = testElement.style.cursor !== '';
    
    console.debug('[CustomCursor] CSS cursor() support:', isSupported);
    return isSupported;
  }

  /**
   * Detect touch device capability
   */
  function detectTouchDevice() {
    const isTouch =
      (typeof window !== 'undefined' &&
        ((navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
         (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 2))) ||
      false;
    
    // Additional: check if pointer is coarse (touch-like)
    const isCoarsePointer =
      window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    
    console.debug('[CustomCursor] Touch device detected:', isTouch || isCoarsePointer);
    return isTouch || isCoarsePointer;
  }

  /**
   * Check if user prefers reduced motion
   */
  function checkReducedMotion() {
    const prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    console.debug('[CustomCursor] Reduced motion preference:', prefersReduced);
    return prefersReduced;
  }

  /**
   * Initialize the custom cursor
   */
  function init() {
    // Early exit conditions
    if (state.enabled) return;
    if (typeof document === 'undefined') return;

    // Detect environment
    state.isTouch = detectTouchDevice();
    state.isReducedMotion = checkReducedMotion();
    state.isSupported = checkCursorSupport();

    // Don't initialize on touch devices
    if (state.isTouch) {
      console.debug('[CustomCursor] Disabled on touch device');
      return;
    }

    // Get DOM elements
    elements.cursorElement = document.querySelector('.site-cursor');
    elements.body = document.body;

    if (!elements.cursorElement || !elements.body) {
      console.warn('[CustomCursor] Required DOM elements not found (.site-cursor)');
      return;
    }

    // Mark cursor as enabled
    state.enabled = true;
    elements.body.classList.add('cursor-enabled');

    if (state.isSupported) {
      elements.body.classList.add('cursor-supported');
    } else {
      elements.body.classList.add('cursor-enhanced');
    }

    if (state.isReducedMotion) {
      elements.body.classList.add('reduced-motion');
    }

    // Set up event listeners
    setupEventListeners();

    // Start animation loop
    if (!state.isReducedMotion) {
      startAnimationLoop();
    }

    console.debug('[CustomCursor] Initialized successfully');
  }

  /**
   * Set up all event listeners
   */
  function setupEventListeners() {
    // Mouse movement
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Scroll performance optimization
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('wheel', handleScroll, { passive: true });

    // Keyboard navigation (Tab key)
    document.addEventListener('keydown', handleKeyDown);

    // Focus events for keyboard navigation
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    // Reduced motion listener (real-time)
    if (window.matchMedia) {
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        state.isReducedMotion = e.matches;
        if (e.matches) {
          elements.body.classList.add('reduced-motion');
          cancelAnimationFrame(state.animationFrameId);
        } else {
          elements.body.classList.remove('reduced-motion');
          startAnimationLoop();
        }
      });
    }

    // Visibility change (pause on tab switch for perf)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(state.animationFrameId);
      } else if (!state.isReducedMotion) {
        startAnimationLoop();
      }
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
  }

  /**
   * Handle mouse move event
   */
  function handleMouseMove(e) {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    state.lastMoveTime = Date.now();

    // Check if hovering over interactive element
    const target = e.target;
    const isInteractive = config.hoverSelectors.some(
      (selector) => target.matches(selector) || target.closest(selector)
    );

    if (isInteractive) {
      addActiveState();
    } else {
      removeActiveState();
    }
  }

  /**
   * Handle mouse down for click feedback
   */
  function handleMouseDown(e) {
    if (!state.enabled) return;

    elements.cursorElement.classList.add('clicking');

    // Remove after animation completes
    setTimeout(() => {
      elements.cursorElement.classList.remove('clicking');
    }, config.clickFeedbackDuration);
  }

  /**
   * Handle mouse up
   */
  function handleMouseUp() {
    // Could be used for additional feedback if needed
  }

  /**
   * Handle scroll for performance optimization
   */
  function handleScroll() {
    elements.body.classList.add('scrolling');

    clearTimeout(state.scrollTimeout);
    state.scrollTimeout = setTimeout(() => {
      elements.body.classList.remove('scrolling');
    }, 150);
  }

  /**
   * Handle keyboard navigation (Tab key)
   */
  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      // Keyboard user detected; ensure focus outline visible
      document.body.classList.add('keyboard-nav');
    }
  }

  /**
   * Handle focus in for keyboard navigation
   */
  function handleFocusIn(e) {
    const target = e.target;
    const isInteractive = config.hoverSelectors.some(
      (selector) => target.matches(selector) || target.closest(selector)
    );

    if (isInteractive) {
      addActiveState();
    }
  }

  /**
   * Handle focus out
   */
  function handleFocusOut() {
    // Only remove active if mouse is not over interactive element
    const isMouseOverInteractive = config.hoverSelectors.some((selector) => {
      const el = document.querySelector(selector + ':hover');
      return el !== null;
    });

    if (!isMouseOverInteractive) {
      removeActiveState();
    }
  }

  /**
   * Add active state class
   */
  function addActiveState() {
    if (!state.isActive && !state.isReducedMotion) {
      state.isActive = true;
      elements.cursorElement.classList.add('active');
    }
  }

  /**
   * Remove active state class
   */
  function removeActiveState() {
    if (state.isActive) {
      state.isActive = false;
      elements.cursorElement.classList.remove('active');
    }
  }

  /**
   * Animation loop using requestAnimationFrame
   */
  function startAnimationLoop() {
    function animate() {
      updateCursorPosition();
      state.animationFrameId = requestAnimationFrame(animate);
    }

    animate();
  }

  /**
   * Update cursor position with easing
   */
  function updateCursorPosition() {
    if (!elements.cursorElement) return;

    // Smooth easing: lerp between current and target position
    state.cursorX += (state.mouseX - state.cursorX) * config.easeAmount;
    state.cursorY += (state.mouseY - state.cursorY) * config.easeAmount;

    // Apply transform with sub-pixel precision
    elements.cursorElement.style.transform = `translate(${state.cursorX}px, ${state.cursorY}px)`;
  }

  /**
   * Cleanup function
   */
  function cleanup() {
    if (!state.enabled) return;

    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('scroll', handleScroll);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('focusin', handleFocusIn);
    document.removeEventListener('focusout', handleFocusOut);
    window.removeEventListener('beforeunload', cleanup);

    // Cancel animation
    cancelAnimationFrame(state.animationFrameId);

    // Remove classes
    elements.body.classList.remove('cursor-enabled');
    elements.body.classList.remove('cursor-supported');
    elements.body.classList.remove('reduced-motion');

    state.enabled = false;

    console.debug('[CustomCursor] Cleaned up');
  }

  /**
   * Destroy and reinitialize (useful for SPA)
   */
  function reinit() {
    cleanup();
    state = {
      enabled: false,
      isSupported: false,
      isTouch: false,
      isReducedMotion: false,
      mouseX: 0,
      mouseY: 0,
      cursorX: 0,
      cursorY: 0,
      isActive: false,
      isScrolling: false,
      lastMoveTime: 0,
      animationFrameId: null,
    };
    init();
  }

  // Public API
  return {
    init,
    cleanup,
    reinit,
    getState: () => ({ ...state }),
    isEnabled: () => state.enabled,
  };
})();

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CustomCursor.init());
} else {
  CustomCursor.init();
}

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CustomCursor;
}
