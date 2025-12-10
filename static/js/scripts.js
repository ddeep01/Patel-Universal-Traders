// Patel Universal Traders PVT.LTD. - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
	// Back to Top Button + WhatsApp visibility
	const backToTopButton = document.getElementById('backToTop');
	const whatsappBtn = document.getElementById('whatsappBtn');
	if (backToTopButton) {
		window.addEventListener('scroll', function() {
			if (window.scrollY > 300) {
				backToTopButton.classList.add('show');
				if (whatsappBtn) whatsappBtn.classList.add('show');
			} else {
				backToTopButton.classList.remove('show');
				if (whatsappBtn) whatsappBtn.classList.remove('show');
			}
		});
		backToTopButton.addEventListener('click', function() {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}

	// Auto-hide Alerts
	const alerts = document.querySelectorAll('.alert');
	alerts.forEach(alert => {
		setTimeout(() => {
			const bsAlert = new bootstrap.Alert(alert);
			bsAlert.close();
		}, 5000);
	});

	// Product Image Gallery
	window.changeImage = function(element) {
		const mainImage = document.getElementById('mainProductImage');
		if (mainImage) {
			mainImage.src = element.src;
			document.querySelectorAll('.thumbnail-img').forEach(img => {
				img.classList.remove('active');
			});
			element.classList.add('active');
		}
	};

	// Contact Form - Pre-fill Product
	const urlParams = new URLSearchParams(window.location.search);
	const product = urlParams.get('product');
	if (product) {
		const productInput = document.getElementById('id_product_interest');
		if (productInput) {
			productInput.value = product;
		}
	}
	console.log('Patel Universal Traders PVT.LTD. Initialized ✓');

	// Smooth-scroll for internal anchor links (JS fallback for older browsers)
	document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
		anchor.addEventListener('click', function(e) {
			var targetId = this.getAttribute('href');
			if (targetId && targetId.length > 1) {
				e.preventDefault();
				var targetEl = document.querySelector(targetId);
				if (targetEl) {
					targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}
		});
	});

  // About page: infrastructure preview & flags handled in template-specific script
  // (kept minimal here so page-specific scripts live in the template)
});
