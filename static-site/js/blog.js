/**
 * Blog Page Script
 */

let allBlogs = [];
let allBlogCategories = [];
let filteredBlogs = [];
let selectedCategory = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
  // Load data
  allBlogs = await DataLoader.getBlogs() || [];
  allBlogCategories = await DataLoader.getBlogCategories() || [];

  // Initialize filters
  initCategoryFilter();
  initSearch();

  // Render blogs
  renderBlogs();
});

function initCategoryFilter() {
  const container = document.getElementById('categoryFilter');
  if (!container) return;

  // Add "All Posts" button
  const allBtn = container.querySelector('[data-category="all"]');
  if (allBtn) {
    allBtn.addEventListener('click', () => {
      selectedCategory = 'all';
      updateFilter();
    });
  }

  // Add category buttons
  allBlogCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-outline-primary mb-2 w-100 text-start';
    btn.setAttribute('data-category', cat.slug);
    btn.textContent = cat.name;
    btn.addEventListener('click', () => {
      selectedCategory = cat.slug;
      updateFilter();
    });
    container.appendChild(btn);
  });
}

function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener('keyup', (e) => {
    searchQuery = e.target.value.toLowerCase();
    updateFilter();
  });
}

function updateFilter() {
  filteredBlogs = allBlogs.filter(b => {
    const matchCategory = selectedCategory === 'all' || b.category_slug === selectedCategory;
    const matchSearch = !searchQuery || 
      b.title.toLowerCase().includes(searchQuery) || 
      b.excerpt.toLowerCase().includes(searchQuery);
    return matchCategory && matchSearch;
  });

  renderBlogs();
}

function renderBlogs() {
  const container = document.getElementById('blogContainer');
  const noResults = document.getElementById('noResults');

  if (!filteredBlogs.length) {
    container.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  // Sort by publish date (newest first)
  const sorted = [...filteredBlogs].sort((a, b) => 
    new Date(b.publish_date) - new Date(a.publish_date)
  );

  container.innerHTML = sorted.map(blog => {
    const pubDate = blog.publish_date ? new Date(blog.publish_date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) : '';

    return `
      <div class="col-lg-6 col-md-12">
        <article class="blog-card h-100">
          ${blog.featured_image ? `
            <div class="blog-image">
              <img src="${blog.featured_image}" alt="${blog.title}" loading="lazy" decoding="async">
              ${pubDate ? `<span class="blog-date">${pubDate}</span>` : ''}
            </div>
          ` : ''}
          <div class="blog-content p-4">
            ${blog.category ? `<span class="blog-category">${blog.category}</span>` : ''}
            <h3 class="blog-title mb-3">${blog.title}</h3>
            <p class="blog-excerpt mb-3">${blog.excerpt}</p>
            <div class="blog-meta text-muted small mb-3">
              ${blog.author ? `<span><i class="fas fa-user"></i> ${blog.author}</span>` : ''}
              ${blog.views_count ? `<span class="ms-2"><i class="fas fa-eye"></i> ${blog.views_count} views</span>` : ''}
            </div>
            <a href="/pages/blog-detail.html?id=${blog.id}" class="btn btn-outline-primary btn-sm">
              Read Full Article <i class="fas fa-arrow-right ms-2"></i>
            </a>
          </div>
        </article>
      </div>
    `;
  }).join('');
}
