/**
 * Product Detail Page Script
 */

let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
  allProducts = await DataLoader.getProducts() || [];
  
  // Get product ID from URL
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));

  if (!productId) {
    document.getElementById('productContent').innerHTML = '<p class="alert alert-danger">Product not found.</p>';
    return;
  }

  // Find product
  const product = allProducts.find(p => p.id === productId);
  if (!product) {
    document.getElementById('productContent').innerHTML = '<p class="alert alert-danger">Product not found.</p>';
    return;
  }

  // Update page title
  document.title = `${product.name} - Patel Universal Traders`;

  // Render product details
  renderProductDetail(product);

  // Render related products
  renderRelatedProducts(product);
});

function renderProductDetail(product) {
  const content = document.getElementById('productContent');

  // Build specifications HTML
  let specsHTML = '';
  const specs = {};
  if (product.grain_length) specs['Grain Length'] = product.grain_length;
  if (product.purity) specs['Purity'] = product.purity;
  if (product.moisture) specs['Moisture'] = product.moisture;
  if (product.broken_grains) specs['Broken Grains'] = product.broken_grains;
  if (product.packaging_options) specs['Packaging'] = product.packaging_options;

  specsHTML = Object.entries(specs).map(([key, value]) => `
    <div class="spec-item mb-3">
      <strong>${key}:</strong> ${value}
    </div>
  `).join('');

  // Build images gallery
  let imagesHTML = '';
  if (product.images && product.images.length) {
    imagesHTML = `
      <div class="product-gallery mb-5">
        <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            ${product.images.map((img, idx) => `
              <div class="carousel-item ${idx === 0 ? 'active' : ''}">
                <img src="${img}" class="d-block w-100" alt="${product.name}">
              </div>
            `).join('')}
          </div>
          ${product.images.length > 1 ? `
            <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#productCarousel">
              <span class="carousel-control-next-icon"></span>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  } else if (product.main_image) {
    imagesHTML = `
      <div class="mb-5">
        <img src="${product.main_image}" class="img-fluid" alt="${product.name}">
      </div>
    `;
  }

  content.innerHTML = `
    <div class="row">
      <div class="col-lg-6">
        ${imagesHTML}
      </div>
      <div class="col-lg-6">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/index.html">Home</a></li>
            <li class="breadcrumb-item"><a href="/pages/products.html">Products</a></li>
            <li class="breadcrumb-item active">${product.name}</li>
          </ol>
        </nav>

        <span class="badge bg-primary mb-3">${product.category}</span>
        <h1 class="mb-3">${product.name}</h1>
        <p class="lead text-muted mb-4">${product.short_description}</p>

        <div class="product-description mb-5">
          <h4>Product Description</h4>
          <p>${product.description}</p>
        </div>

        ${Object.keys(specs).length > 0 ? `
          <div class="product-specs mb-5">
            <h4>Specifications</h4>
            <div class="specs-list">
              ${specsHTML}
            </div>
          </div>
        ` : ''}

        ${product.additional_specs ? `
          <div class="additional-info mb-5">
            <h4>Additional Information</h4>
            <p>${product.additional_specs.replace(/\n/g, '<br>')}</p>
          </div>
        ` : ''}

        <div class="product-actions">
          <a href="/pages/contact.html" class="btn btn-primary btn-lg">
            <i class="fas fa-envelope"></i> Request Quote
          </a>
          ${product.spec_sheet ? `
            <a href="${product.spec_sheet}" class="btn btn-outline-primary btn-lg" download>
              <i class="fas fa-file-pdf"></i> Download Spec Sheet
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  // Initialize carousel if present
  if (product.images && product.images.length > 1) {
    setTimeout(() => {
      const carousel = document.getElementById('productCarousel');
      if (carousel) {
        new bootstrap.Carousel(carousel);
      }
    }, 100);
  }
}

function renderRelatedProducts(product) {
  const related = allProducts.filter(p => 
    p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const container = document.getElementById('relatedProducts');
  if (!related.length) {
    container.innerHTML = '<p class="col-12">No related products found.</p>';
    return;
  }

  container.innerHTML = related.map(p => `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="product-card h-100">
        ${p.main_image ? `
          <div class="product-image">
            <img src="${p.main_image}" alt="${p.name}" loading="lazy" decoding="async">
          </div>
        ` : ''}
        <div class="product-info p-4">
          <span class="product-category mb-2">${p.category}</span>
          <h5>${p.name}</h5>
          <p class="small text-muted mb-3">${p.short_description}</p>
          <a href="/pages/product-detail.html?id=${p.id}" class="btn btn-sm btn-outline-primary">
            View Details
          </a>
        </div>
      </div>
    </div>
  `).join('');
}
