/**
 * Data Loader - Loads JSON data and provides utilities
 */

const DataLoader = {
  cache: {},

  async load(url) {
    if (this.cache[url]) {
      return this.cache[url];
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load ${url}`);
      const data = await response.json();
      this.cache[url] = data;
      return data;
    } catch (error) {
      console.error('DataLoader error:', error);
      return null;
    }
  },

  async getProducts() {
    return this.load('./data/products.json');
  },

  async getBlogs() {
    return this.load('./data/blogs.json');
  },

  async getCategories() {
    return this.load('./data/categories.json');
  },

  async getBlogCategories() {
    return this.load('./data/blog-categories.json');
  },

  getFeaturedProducts(products, limit = 6) {
    if (!products) return [];
    return products
      .filter(p => p.is_featured)
      .slice(0, limit);
  },

  getFeaturedBlogs(blogs, limit = 3) {
    if (!blogs) return [];
    return blogs
      .filter(b => b.is_featured)
      .slice(0, limit);
  },

  getLatestBlogs(blogs, limit = 3) {
    if (!blogs) return [];
    return blogs
      .sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date))
      .slice(0, limit);
  }
};

// Utility functions
function createProductCard(product) {
  return `
    <div class="slider-card">
      <div class="product-card">
        ${product.main_image ? `
          <div class="product-image">
            <img src="${product.main_image}" alt="${product.name}" loading="lazy" decoding="async">
          </div>
        ` : ''}
        <div class="product-info text-center p-3">
          <span class="product-category d-block">${product.category}</span>
          <h4 class="product-title">${product.name}</h4>
          <p class="product-description">${product.short_description}</p>
          <a href="/pages/product-detail.html?id=${product.id}" class="btn btn-sm">Learn More</a>
        </div>
      </div>
    </div>
  `;
}

function createBlogCard(blog) {
  const pubDate = blog.publish_date ? new Date(blog.publish_date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }) : '';

  return `
    <div class="col-lg-4 col-md-6">
      <div class="blog-card">
        ${blog.featured_image ? `
          <div class="blog-image">
            <img src="${blog.featured_image}" alt="${blog.title}" loading="lazy" decoding="async">
            <span class="blog-date">${pubDate}</span>
          </div>
        ` : ''}
        <div class="blog-content">
          ${blog.category ? `<span class="blog-category">${blog.category}</span>` : ''}
          <h4 class="blog-title">${blog.title}</h4>
          <p class="blog-excerpt">${blog.excerpt}</p>
          <a href="/pages/blog-detail.html?id=${blog.id}" class="blog-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  `;
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DataLoader, createProductCard, createBlogCard };
}
