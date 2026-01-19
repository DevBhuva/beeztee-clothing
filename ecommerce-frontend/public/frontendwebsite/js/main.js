// ==================== NAVBAR FUNCTIONALITY ====================
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
 const navLinks = document.querySelectorAll("nav a");
    const sections = document.querySelectorAll("section");

    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // remove active from all links and sections
        navLinks.forEach(l => l.classList.remove("active"));
        sections.forEach(s => s.classList.remove("active"));

        // add active to clicked link and target section
        const page = link.getAttribute("data-page");
        document.getElementById(page).classList.add("active");
        link.classList.add("active");
      });
    });


// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==================== HERO SECTION PARTICLES ====================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Create particles on page load
createParticles();

// ==================== FILTER TABS FUNCTIONALITY ====================
const filterTabs = document.querySelectorAll('.filter-tab');
const productCards = document.querySelectorAll('.product-card');

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        filterTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        const filter = tab.getAttribute('data-filter');
        
        productCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                const category = card.getAttribute('data-category');
                if (category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
});

// Set first tab as active by default
if (filterTabs.length > 0) {
    filterTabs[0].classList.add('active');
}

// ==================== QUICK VIEW MODAL FUNCTIONALITY ====================
const quickViewModal = document.getElementById('quick-view-modal');
const quickViewBtns = document.querySelectorAll('.quick-view-btn');
const closeModalBtn = document.querySelector('.close-modal');

// Open modal when quick view button is clicked
quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Get product card
        const productCard = btn.closest('.product-card');
        
        // Get product details
        const productImage = productCard.querySelector('.product-image').src;
        const productName = productCard.querySelector('.product-name').textContent;
        const currentPrice = productCard.querySelector('.current-price').textContent;
        const originalPrice = productCard.querySelector('.original-price')?.textContent || '';
        const rating = productCard.querySelector('.product-rating').innerHTML;
        
        // Update modal content
        document.querySelector('.modal-image').src = productImage;
        document.querySelector('.modal-title').textContent = productName;
        
        // Update price in modal
        const modalPriceElement = document.querySelector('.modal-price');
        modalPriceElement.innerHTML = currentPrice;
        if (originalPrice) {
            modalPriceElement.innerHTML += ` <span style="text-decoration: line-through; color: #666; font-size: 1.2rem; margin-left: 10px;">${originalPrice}</span>`;
        }
        
        // Update rating
        const modalRatingContainer = document.querySelector('.modal-info .product-rating');
        if (modalRatingContainer) {
            modalRatingContainer.innerHTML = rating;
        }
        
        // Show modal
        quickViewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close modal when close button is clicked
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        quickViewModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside
quickViewModal?.addEventListener('click', (e) => {
    if (e.target === quickViewModal) {
        quickViewModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quickViewModal.classList.contains('active')) {
        quickViewModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ==================== SIZE SELECTOR ====================
const sizeOptions = document.querySelectorAll('.size-option');
sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
        sizeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
    });
});

// ==================== COLOR SELECTOR ====================
const colorOptions = document.querySelectorAll('.color-option');
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        const parent = option.parentElement;
        parent.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
    });
});

// ==================== QUANTITY SELECTOR ====================
const quantityBtns = document.querySelectorAll('.quantity-btn');
quantityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('.quantity-input');
        const currentValue = parseInt(input.value);
        const min = parseInt(input.min) || 1;
        const max = parseInt(input.max) || 100;
        
        if (btn.textContent === '+') {
            if (currentValue < max) {
                input.value = currentValue + 1;
            }
        } else if (btn.textContent === '-') {
            if (currentValue > min) {
                input.value = currentValue - 1;
            }
        }
    });
});

// ==================== WISHLIST FUNCTIONALITY ====================
const wishlistBtns = document.querySelectorAll('.action-btn .fa-heart');
wishlistBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('far')) {
            btn.classList.remove('far');
            btn.classList.add('fas');
            btn.style.color = '#ff0080';
        } else {
            btn.classList.remove('fas');
            btn.classList.add('far');
            btn.style.color = '';
        }
    });
});

// ==================== ADD TO CART ====================
let cartCount = 0;
const cartCountElement = document.getElementById('cartCount');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        cartCount++;
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
        
        // Add animation feedback
        btn.textContent = 'Added to Cart!';
        btn.style.background = 'linear-gradient(90deg, #00c853, #00e676)';
        
        setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.style.background = '';
        }, 2000);
        
        // Close modal after adding to cart
        if (quickViewModal.classList.contains('active')) {
            setTimeout(() => {
                quickViewModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }, 1500);
        }
    });
});

// Add to cart from product card
const addToCartIcons = document.querySelectorAll('.product-actions .fa-shopping-bag');
addToCartIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        cartCount++;
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
        
        // Add animation
        icon.parentElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            icon.parentElement.style.transform = '';
        }, 300);
    });
});

// ==================== LOAD MORE FUNCTIONALITY ====================
const loadMoreBtn = document.querySelector('.load-more-btn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        // Simulate loading more products
        loadMoreBtn.textContent = 'Loading...';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            loadMoreBtn.textContent = 'Load More Products';
            loadMoreBtn.disabled = false;
            alert('More products would be loaded here!');
        }, 1500);
    });
}

// ==================== CART TOGGLE (if you have a cart sidebar) ====================
function toggleCart() {
    // Add your cart sidebar toggle logic here
    console.log('Cart toggled');
}

// ==================== SMOOTH ANIMATIONS ON SCROLL ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe product cards
productCards.forEach(card => {
    observer.observe(card);
});
// Product Data
const products = [
  { id: 1, name: 'Silk Evening Gown', price: 899, image: 'gown', badge: 'NEW', trending: true },
  { id: 2, name: 'Cashmere Blazer', price: 650, image: 'blazer', badge: 'TRENDING', trending: true },
  { id: 3, name: 'Wool Coat', price: 950, image: 'coat', badge: 'NEW', trending: true },
  { id: 4, name: 'Cotton Sweater', price: 280, image: 'sweater', badge: 'SALE', trending: true },
  { id: 5, name: 'Mens Leather Jacket', price: 1100, image: 'leather', badge: 'NEW', trending: true }
];

// Get container
const container = document.getElementById('scrollContainer');

// Create product cards
products.forEach(product => {
  const card = document.createElement('div');
  card.classList.add('trending-card');
  
  card.innerHTML = `
    <div class="card-img">
      <img src="https://picsum.photos/seed/${product.image}/300/400" alt="${product.name}">
      ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
    </div>
    <div class="card-info">
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
    </div>
  `;
  
  container.appendChild(card);
});

// Scroll Progress Bar
const bar = document.getElementById('scrollBar');

container.addEventListener('scroll', () => {
  const scrollPercent = (container.scrollLeft / (container.scrollWidth - container.clientWidth)) * 100;
  bar.style.width = `${scrollPercent}%`;
});

// ==================== AUTO ROTATION FOR TRENDING SECTION ====================
let autoScrollInterval;
let isUserScrolling = false;
let userScrollTimeout;

// Auto scroll function
function autoScrollTrending() {
  if (!container || isUserScrolling) return;
  
  const scrollAmount = 2; // Pixels to scroll per frame
  const maxScroll = container.scrollWidth - container.clientWidth;
  
  // If we've reached the end, reset to start smoothly
  if (container.scrollLeft >= maxScroll - 5) {
    container.scrollTo({
      left: 0,
      behavior: 'smooth'
    });
  } else {
    container.scrollLeft += scrollAmount;
  }
}

// Start auto-scrolling
function startAutoScroll() {
  stopAutoScroll(); // Clear any existing interval
  autoScrollInterval = setInterval(autoScrollTrending, 30); // Scroll every 30ms
}

// Stop auto-scrolling
function stopAutoScroll() {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }
}

// Pause auto-scroll when user interacts
container.addEventListener('mouseenter', () => {
  stopAutoScroll();
});

// Resume auto-scroll when user stops interacting
container.addEventListener('mouseleave', () => {
  startAutoScroll();
});

// Detect manual scroll by user
container.addEventListener('scroll', () => {
  isUserScrolling = true;
  
  // Clear existing timeout
  if (userScrollTimeout) {
    clearTimeout(userScrollTimeout);
  }
  
  // Reset user scrolling flag after 2 seconds of no scrolling
  userScrollTimeout = setTimeout(() => {
    isUserScrolling = false;
  }, 2000);
});

// Handle touch events for mobile
container.addEventListener('touchstart', () => {
  stopAutoScroll();
  isUserScrolling = true;
});

container.addEventListener('touchend', () => {
  setTimeout(() => {
    isUserScrolling = false;
    startAutoScroll();
  }, 2000);
});

// Start auto-scrolling when page loads
if (container && container.children.length > 0) {
  setTimeout(() => {
    startAutoScroll();
  }, 1000); // Wait 1 second before starting
}

console.log('E-commerce site loaded successfully!');