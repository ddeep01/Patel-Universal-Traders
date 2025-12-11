/**
 * Products Page Script
 */

let allProducts = [];
let allCategories = [];
let filteredProducts = [];
let selectedCategory = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
  // Load data
  allProducts = await DataLoader.getProducts() || [];
  allCategories = await DataLoader.getCategories() || [];

  // Initialize categories filter
  initCategoryFilter();

  // Initialize search
  initSearch();

  // Render products
  renderProducts();
});

function initCategoryFilter() {
  const container = document.getElementById('categoryFilter');
  if (!container) return;

  // Add "All Products" button
  const allBtn = container.querySelector('[data-category="all"]');
  if (allBtn) {
    allBtn.addEventListener('click', () => {
      selectedCategory = 'all';
      updateFilter();
    });
  }

  // Add category buttons
  allCategories.forEach(cat => {
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
  filteredProducts = allProducts.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category_slug === selectedCategory;
    const matchSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery) || 
      p.description.toLowerCase().includes(searchQuery);
    return matchCategory && matchSearch;
  });

  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');

  if (!filteredProducts.length) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';
  grid.innerHTML = filteredProducts.map(product => `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="product-card h-100">
        ${product.main_image ? `
          <div class="product-image">
            <img src="${product.main_image}" alt="${product.name}" loading="lazy" decoding="async">
            ${product.is_featured ? '<span class="product-badge">Featured</span>' : ''}
          </div>
        ` : ''}
        <div class="product-info p-4 d-flex flex-column">
          <span class="product-category mb-2">${product.category}</span>
          <h4 class="product-title mb-2">${product.name}</h4>
          <p class="product-description flex-grow-1">${product.short_description}</p>
          <div class="mt-3">
            <a href="/pages/product-detail.html?id=${product.id}" class="btn btn-outline-primary btn-sm w-100">
              View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}
