// ============================================
// MAIN FRONTEND JAVASCRIPT
// Handles homepage, shop page, and product display
// ============================================

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// WhatsApp Configuration
const WHATSAPP_NUMBER = '2349075048891';

// ============================================
// HERO SLIDER FUNCTIONALITY
// ============================================

let currentSlide = 0;
let autoInterval;
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const dotsContainer = document.getElementById('dotsContainer');

function updateSlides() {
  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === currentSlide);
  });
  updateDots();
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active-dot', idx === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateSlides();
  resetAutoPlay();
}

function prevSlideFunc() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateSlides();
  resetAutoPlay();
}

function resetAutoPlay() {
  if (autoInterval) clearInterval(autoInterval);
  autoInterval = setInterval(nextSlide, 5000);
}

if (prevBtn && nextBtn && slides.length) {
  if (dotsContainer) {
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.addEventListener('click', () => {
        currentSlide = idx;
        updateSlides();
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });
  }
  prevBtn.addEventListener('click', prevSlideFunc);
  nextBtn.addEventListener('click', nextSlide);
  updateSlides();
  resetAutoPlay();
  
  // Touch support for mobile
  let touchStartX = 0;
  const sliderContainer = document.getElementById('heroSlider');
  if (sliderContainer) {
    sliderContainer.addEventListener('touchstart', (e) => { 
      touchStartX = e.changedTouches[0].screenX; 
    });
    sliderContainer.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? prevSlideFunc() : nextSlide();
        resetAutoPlay();
      }
    });
  }
}

// ============================================
// PRODUCT DISPLAY FUNCTIONS
// ============================================

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Load Featured Products on Homepage
async function loadFeaturedProducts() {
  const products = await window.luxeDB.getProducts();
  const featuredGrid = document.getElementById('featuredProducts');
  
  if (featuredGrid) {
    const featuredProducts = products.slice(0, 6);
    
    if (featuredProducts.length === 0) {
      featuredGrid.innerHTML = '<div style="text-align:center; padding:60px;">No products available. Check back soon!</div>';
      return;
    }
    
    featuredGrid.innerHTML = featuredProducts.map(product => `
      <div class="product-card fade-in">
        <img class="product-img" src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\'%3E%3Crect width=\'200\' height=\'200\' fill=\'%23ccc\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'white\' font-size=\'14\'%3ENo Image%3C/text%3E%3C/svg%3E'">
        <div class="product-info">
          <div class="product-name">${escapeHtml(product.name)}</div>
          <div class="product-price">₦${product.price.toLocaleString()}</div>
          <div class="product-desc">${escapeHtml(product.description?.substring(0, 60) || '')}${product.description?.length > 60 ? '...' : ''}</div>
          <div class="whatsapp-row">
            <div class="qty-selector">
              <button class="qty-minus" data-id="${product.id}">−</button>
              <span class="qty-val" data-id="${product.id}">1</span>
              <button class="qty-plus" data-id="${product.id}">+</button>
            </div>
            <button class="btn-wa buy-wa" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${product.price}">
              <i class="fab fa-whatsapp"></i> Buy
            </button>
          </div>
        </div>
      </div>
    `).join('');
    
    attachWhatsAppHandlers();
  }
}

// Load All Products for Shop Page
async function loadAllProducts() {
  let products = await window.luxeDB.getProducts();
  const category = document.getElementById('categoryFilter')?.value || 'all';
  const sort = document.getElementById('sortFilter')?.value || 'default';
  const maxPrice = parseInt(document.getElementById('priceFilter')?.value || 100000);
  
  // Filter products
  let filtered = products.filter(p => {
    const matchesCategory = category === 'all' || p.category === category;
    const matchesPrice = p.price <= maxPrice;
    return matchesCategory && matchesPrice;
  });
  
  // Sort products
  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  const grid = document.getElementById('allProducts');
  if (grid) {
    if (filtered.length === 0) {
      grid.innerHTML = '<div class="no-products" style="text-align:center; padding:60px; grid-column:1/-1;"><i class="fas fa-box-open" style="font-size:48px; color:#ccc; margin-bottom:16px; display:block;"></i>No products found. Try adjusting your filters.</div>';
    } else {
      grid.innerHTML = filtered.map(product => `
        <div class="product-card fade-in">
          <img class="product-img" src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\'%3E%3Crect width=\'200\' height=\'200\' fill=\'%23ccc\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'white\' font-size=\'14\'%3ENo Image%3C/text%3E%3C/svg%3E'">
          <div class="product-info">
            <div class="product-name">${escapeHtml(product.name)}</div>
            <div class="product-price">₦${product.price.toLocaleString()}</div>
            <div class="product-desc">${escapeHtml(product.description?.substring(0, 80) || '')}${product.description?.length > 80 ? '...' : ''}</div>
            <div class="whatsapp-row">
              <div class="qty-selector">
                <button class="qty-minus" data-id="${product.id}">−</button>
                <span class="qty-val" data-id="${product.id}">1</span>
                <button class="qty-plus" data-id="${product.id}">+</button>
              </div>
              <button class="btn-wa buy-wa" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${product.price}">
                <i class="fab fa-whatsapp"></i> Buy on WhatsApp
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }
    attachWhatsAppHandlers();
  }
  
  // Update price display
  const priceValue = document.getElementById('priceValue');
  if (priceValue) {
    if (maxPrice >= 100000) {
      priceValue.textContent = '₦100,000+';
    } else {
      priceValue.textContent = `₦${maxPrice.toLocaleString()}`;
    }
  }
}

// WhatsApp handler with quantity
function attachWhatsAppHandlers() {
  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const span = document.querySelector(`.qty-val[data-id="${id}"]`);
      if (span) {
        let val = parseInt(span.innerText);
        if (val > 1) span.innerText = val - 1;
      }
    };
  });
  
  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const span = document.querySelector(`.qty-val[data-id="${id}"]`);
      if (span) {
        let val = parseInt(span.innerText);
        span.innerText = val + 1;
      }
    };
  });
  
  document.querySelectorAll('.buy-wa').forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const id = btn.dataset.id;
      const qtySpan = document.querySelector(`.qty-val[data-id="${id}"]`);
      const quantity = qtySpan ? parseInt(qtySpan.innerText) : 1;
      const message = `Hello! I'm interested in buying: ${name} (₦${price.toLocaleString()}) × ${quantity} unit(s). Please let me know how to proceed.`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    };
  });
}

// ============================================
// CART FUNCTIONALITY
// ============================================

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.textContent = count;
}

function addToCart(productId, productName, productPrice, quantity) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      quantity: quantity
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${productName} added to cart!`);
}

// ============================================
// USER ACCOUNT BUTTON
// ============================================

async function updateAccountButton() {
  const user = await window.luxeDB.getCurrentUser();
  const accountText = document.getElementById('accountText');
  if (user && accountText) {
    accountText.innerHTML = `<span style="display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; background:#c27b3a; border-radius:50%; color:white; font-size:0.7rem; margin-right:6px;">${user.name.charAt(0)}</span> ${user.name.split(' ')[0]}`;
  } else if (accountText) {
    accountText.innerHTML = 'Account';
  }
}

// ============================================
// NEWSLETTER FORM
// ============================================

const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thanks for subscribing! You\'ll receive our latest updates.');
    newsletterForm.reset();
  });
}

// ============================================
// INTERSECTION OBSERVER (Fade-in animations)
// ============================================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  // Load products based on current page
  if (document.getElementById('featuredProducts')) {
    await loadFeaturedProducts();
  }
  
  if (document.getElementById('allProducts')) {
    await loadAllProducts();
    
    // Setup filters
    const priceFilter = document.getElementById('priceFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const resetBtn = document.getElementById('resetFilters');
    
    if (priceFilter) priceFilter.addEventListener('input', loadAllProducts);
    if (categoryFilter) categoryFilter.addEventListener('change', loadAllProducts);
    if (sortFilter) sortFilter.addEventListener('change', loadAllProducts);
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (priceFilter) priceFilter.value = 100000;
        if (categoryFilter) categoryFilter.value = 'all';
        if (sortFilter) sortFilter.value = 'default';
        loadAllProducts();
      });
    }
  }
  
  // Update cart count and account button
  updateCartCount();
  await updateAccountButton();
  
  // Observe fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});

// ============================================
// SECRET ADMIN ACCESS (Ctrl+Shift+A)
// ============================================

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    window.location.href = 'admin/login.html';
  }
});