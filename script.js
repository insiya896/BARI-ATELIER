// Phone brands data
const phoneBrands = ['iPhone', 'Samsung', 'Google Pixel', 'OnePlus', 'Xiaomi', 'Motorola'];

// Extended Product Data with phone and collection
const products = [
    {
        id: 1,
        name: "Crystal Clear Pro",
        phone: "iPhone 15 Pro",
        brand: "iPhone",
        model: "15 Pro",
        collection: "transparent",
        price: 19.99,
        rating: "⭐⭐⭐⭐⭐",
        emoji: "💎"
    },
    {
        id: 2,
        name: "Massage Comfort Grip",
        phone: "Samsung Galaxy S24",
        brand: "Samsung",
        model: "S24",
        collection: "massage",
        price: 24.99,
        rating: "⭐⭐⭐⭐⭐",
        emoji: "💆"
    },
    {
        id: 3,
        name: "Neon Glow Gaming",
        phone: "Google Pixel 8",
        brand: "Google Pixel",
        model: "8",
        collection: "neon",
        price: 29.99,
        rating: "⭐⭐⭐⭐⭐",
        emoji: "⚡"
    },
    {
        id: 4,
        name: "Rugged Armor",
        phone: "OnePlus 12",
        brand: "OnePlus",
        model: "12",
        collection: "rugged",
        price: 34.99,
        rating: "⭐⭐⭐⭐⭐",
        emoji: "🛡️"
    },
    {
        id: 5,
        name: "Transparent Elegance",
        phone: "iPhone 15",
        brand: "iPhone",
        model: "15",
        collection: "transparent",
        price: 21.99,
        rating: "⭐⭐⭐⭐⭐",
        emoji: "💎"
    },
    {
        id: 6,
        name: "Massage Soft Touch",
        phone: "Samsung Galaxy A54",
        brand: "Samsung",
        model: "A54",
        collection: "massage",
        price: 17.99,
        rating: "⭐⭐⭐⭐⭐",
        emoji: "💆"
    },
    {
        id: 7,
        name: "Neon Cyber Glow",
        phone: "Xiaomi 14 Ultra",
        brand: "Xiaomi",
        model: "14 Ultra",
        collection: "neon",
        price: 22.99,
        rating: "⭐⭐⭐⭐⭐",
        emoji: "⚡"
    },
    {
        id: 8,
        name: "Ultra Rugged Shield",
        phone: "Motorola Edge 50",
        brand: "Motorola",
        model: "Edge 50",
        collection: "rugged",
        price: 28.99,
        rating: "⭐⭐⭐⭐⭐",
        emoji: "🛡️"
    }
];

// Cart Management
let cart = [];

function initializeCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartUI();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${product.name} added to cart! 🛒`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    if (cart.length === 0) {
        cartItems.innerHTML = '<div style="padding: 2rem; text-align: center; color: #999;">Your cart is empty</div>';
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div style="font-size: 0.85rem; color: #666;">${item.phone}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div style="font-size: 0.9rem; color: #666;">Qty: ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = '$' + total.toFixed(2);
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

// Render brand grid
function renderBrands() {
    const brandGrid = document.getElementById('brandGrid');
    brandGrid.innerHTML = phoneBrands.map(brand => `
        <div class="brand-card" onclick="filterByBrand('${brand}')">
            ${brand}
        </div>
    `).join('');
}

// Filter products by brand
function filterByBrand(brand) {
    const filtered = products.filter(p => p.brand === brand);
    renderProductsFromList(filtered);
}

// Product Rendering
function renderProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.collection === filter);

    renderProductsFromList(filteredProducts);
}

function renderProductsFromList(filteredProducts) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #999;">No products found</div>';
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-phone">📱 ${product.phone}</div>
                <div class="product-collection">🏷️ ${product.collection.charAt(0).toUpperCase() + product.collection.slice(1)}</div>
                <div class="product-rating">${product.rating}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})" style="width: 100%;">
                    Add to Cart ⚡
                </button>
            </div>
        </div>
    `).join('');
}

// Collection Filter
document.addEventListener('DOMContentLoaded', () => {
    const collectionCards = document.querySelectorAll('.collection-card');
    
    collectionCards.forEach(card => {
        card.addEventListener('click', () => {
            const filter = card.dataset.filter;
            renderProducts(filter);
        });
    });

    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }
});

// Newsletter Form
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            localStorage.setItem('newsletter_email', email);
            showNotification('✨ Welcome to COVER ZONE newsletter! Check your email for 15% off!');
            newsletterForm.reset();
        });
    }
});

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #00FF41, #00DDFF);
        color: #000;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.4);
        animation: slideInUp 0.3s ease;
        z-index: 3000;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Hamburger Menu
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
});

// Scroll Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.product-card, .feature-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });

    // Initialize
    initializeCart();
    renderProducts('all');
    renderBrands();
});
