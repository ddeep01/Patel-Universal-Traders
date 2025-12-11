/**
 * Home Page Script - Load products and blogs
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Load featured products
  const products = await DataLoader.getProducts();
  if (products) {
    const featured = DataLoader.getFeaturedProducts(products, 6);
    const container = document.getElementById('productSliderTrack');
    if (container && featured.length > 0) {
      container.innerHTML = featured.map(p => createProductCard(p)).join('');
      initProductSlider();
    }
  }

  // Load latest blog posts
  const blogs = await DataLoader.getBlogs();
  if (blogs) {
    const latest = DataLoader.getLatestBlogs(blogs, 3);
    const container = document.getElementById('blogContainer');
    if (container && latest.length > 0) {
      container.innerHTML = latest.map(b => createBlogCard(b)).join('');
    }
  }

  // Initialize carousel
  const heroCarousel = document.getElementById('heroCarousel');
  if (heroCarousel) {
    try {
      new bootstrap.Carousel(heroCarousel, { interval: 3000, ride: 'carousel', pause: false });
    } catch (e) {
      console.warn('Carousel init failed:', e);
    }
  }
});

/**
 * Product Slider - Auto-scroll functionality
 */
function initProductSlider() {
  const track = document.getElementById('productSliderTrack');
  if (!track) return;

  // Ensure enough items to scroll smoothly
  const minItems = 6;
  while (track.children.length < minItems) {
    for (let i = 0; i < track.children.length && track.children.length < minItems; i++) {
      track.appendChild(track.children[i].cloneNode(true));
    }
    if (track.children.length === 0) return;
  }

  const interval = 1000; // ms between moves
  const transitionMs = 600;

  function cardWidth() {
    const first = track.querySelector('.slider-card');
    return first ? first.getBoundingClientRect().width : 0;
  }

  track.style.transform = 'translateX(0px)';

  let ticking = false;
  const move = () => {
    if (ticking) return;
    const w = cardWidth();
    if (!w) return;

    track.style.transition = `transform ${transitionMs}ms ease`;
    track.style.transform = `translateX(${-w}px)`;
    ticking = true;

    const onEnd = () => {
      track.removeEventListener('transitionend', onEnd);
      track.style.transition = 'none';
      const first = track.children[0];
      if (first) track.appendChild(first);
      track.style.transform = 'translateX(0px)';
      void track.offsetWidth; // Force reflow
      ticking = false;
    };

    track.addEventListener('transitionend', onEnd);
  };

  let t = setInterval(move, interval);

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(t));
  track.addEventListener('mouseleave', () => { t = setInterval(move, interval); });
}
