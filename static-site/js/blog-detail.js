/**
 * Blog Detail Page Script
 */

let allBlogs = [];

document.addEventListener('DOMContentLoaded', async () => {
  allBlogs = await DataLoader.getBlogs() || [];
  
  // Get blog ID from URL
  const params = new URLSearchParams(window.location.search);
  const blogId = parseInt(params.get('id'));

  if (!blogId) {
    document.getElementById('articleContent').innerHTML = '<p class="alert alert-danger">Article not found.</p>';
    return;
  }

  // Find blog
  const blog = allBlogs.find(b => b.id === blogId);
  if (!blog) {
    document.getElementById('articleContent').innerHTML = '<p class="alert alert-danger">Article not found.</p>';
    return;
  }

  // Update page title and meta
  document.title = `${blog.title} - Patel Universal Traders`;

  // Render blog content
  renderBlogContent(blog);

  // Render related posts
  renderRelatedPosts(blog);
});

function renderBlogContent(blog) {
  // Update breadcrumb and title
  document.getElementById('breadcrumbTitle').textContent = blog.title;
  document.getElementById('articleTitle').textContent = blog.title;

  // Featured image
  if (blog.featured_image) {
    document.getElementById('featuredImage').innerHTML = `
      <img src="${blog.featured_image}" class="img-fluid rounded mb-4" alt="${blog.title}">
    `;
  }

  // Blog meta
  const pubDate = blog.publish_date ? new Date(blog.publish_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  let metaHTML = `
    <p class="text-white-50">
      <i class="fas fa-calendar"></i> ${pubDate}
  `;
  if (blog.category) {
    metaHTML += ` • <i class="fas fa-tag"></i> ${blog.category}`;
  }
  metaHTML += '</p>';

  document.getElementById('blogMeta').innerHTML = metaHTML;

  // Article content
  document.getElementById('articleContent').innerHTML = blog.content || '<p>No content available.</p>';

  // Author info
  document.getElementById('authorInfo').textContent = blog.author || 'Patel Universal Traders';
}

function renderRelatedPosts(blog) {
  const related = allBlogs.filter(b => 
    b.category === blog.category && b.id !== blog.id && b.id !== blog.id
  ).slice(0, 3);

  const container = document.getElementById('relatedPosts');

  if (!related.length) {
    container.innerHTML = '<p class="col-12">No related articles found.</p>';
    return;
  }

  container.innerHTML = related.map(b => {
    const pubDate = b.publish_date ? new Date(b.publish_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : '';

    return `
      <div class="col-md-6 col-lg-12">
        <article class="card h-100">
          ${b.featured_image ? `
            <img src="${b.featured_image}" class="card-img-top" alt="${b.title}">
          ` : ''}
          <div class="card-body">
            ${b.category ? `<span class="badge bg-primary mb-2">${b.category}</span>` : ''}
            <h5 class="card-title">${b.title}</h5>
            <p class="card-text text-muted small">${pubDate}</p>
            <p class="card-text">${b.excerpt}</p>
            <a href="/pages/blog-detail.html?id=${b.id}" class="btn btn-outline-primary btn-sm">
              Read More
            </a>
          </div>
        </article>
      </div>
    `;
  }).join('');
}
