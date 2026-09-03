// Cart data from localStorage
let cart = [];
let currentStep = 1;
const totalSteps = 3;

// Initialize checkout
document.addEventListener('DOMContentLoaded', () => {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    renderOrderSummary();
    setupFormListeners();
});

// Setup form listeners
function setupFormListeners() {
    // Card number formatting
    const cardInput = document.getElementById('cardNumber');
    if (cardInput) {
        cardInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = formattedValue;
        });
    }

    // Expiry date formatting
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // Shipping method cost update
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    shippingOptions.forEach(option => {
        option.addEventListener('change', () => {
            updateShippingCost();
        });
    });
}

// Render order summary
function renderOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    const subtotal = document.getElementById('subtotal');
    const tax = document.getElementById('tax');
    const total = document.getElementById('total');

    if (cart.length === 0) {
        summaryItems.innerHTML = '<p style="color: #999; text-align: center;">Your cart is empty</p>';
        return;
    }

    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div style="display: flex; align-items: center; flex: 1;">
                <div class="item-image">${item.emoji}</div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Qty: ${item.quantity}</div>
                </div>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    updateOrderTotals();
}

// Update order totals
function updateOrderTotals() {
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = getShippingCost();
    const taxAmount = subtotal * 0.08; // 8% tax
    const totalAmount = subtotal + shippingCost + taxAmount;

    subtotalEl.textContent = '$' + subtotal.toFixed(2);
    taxEl.textContent = '$' + taxAmount.toFixed(2);
    totalEl.textContent = '$' + totalAmount.toFixed(2);
}

// Get shipping cost
function getShippingCost() {
    const shippingMethod = document.querySelector('input[name="shipping"]:checked');
    if (!shippingMethod) return 0;

    const method = shippingMethod.value;
    switch(method) {
        case 'express': return 9.99;
        case 'overnight': return 24.99;
        default: return 0;
    }
}

// Update shipping cost display
function updateShippingCost() {
    const shippingCostEl = document.getElementById('shippingCost');
    const cost = getShippingCost();
    shippingCostEl.textContent = cost === 0 ? 'Free' : '$' + cost.toFixed(2);
    updateOrderTotals();
}

// Navigation functions
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepUI();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepUI();
    }
}

// Validate form data
function validateCurrentStep() {
    if (currentStep === 1) {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        const zip = document.getElementById('zip').value.trim();
        const country = document.getElementById('country').value.trim();

        if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zip || !country) {
            alert('Please fill in all fields');
            return false;
        }

        if (!email.includes('@')) {
            alert('Please enter a valid email');
            return false;
        }

        return true;
    } else if (currentStep === 2) {
        const cardHolder = document.getElementById('cardHolder').value.trim();
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiry = document.getElementById('expiry').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        if (!cardHolder || !cardNumber || !expiry || !cvv) {
            alert('Please fill in all card details');
            return false;
        }

        if (cardNumber.length !== 16) {
            alert('Please enter a valid card number');
            return false;
        }

        if (cvv.length < 3) {
            alert('Please enter a valid CVV');
            return false;
        }

        return true;
    }

    return true;
}

// Update UI based on current step
function updateStepUI() {
    // Hide all sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active from all progress steps
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < currentStep) {
            step.classList.add('completed');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });

    // Show current section
    if (currentStep === 1) {
        document.getElementById('shipping-section').classList.add('active');
    } else if (currentStep === 2) {
        document.getElementById('payment-section').classList.add('active');
    } else if (currentStep === 3) {
        updateReviewSection();
        document.getElementById('review-section').classList.add('active');
    }

    // Scroll to top
    document.querySelector('.checkout-form').scrollIntoView({ behavior: 'smooth' });
}

// Update review section with user data
function updateReviewSection() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const country = document.getElementById('country').value;

    const cardHolder = document.getElementById('cardHolder').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiry = document.getElementById('expiry').value;

    const reviewAddress = document.getElementById('reviewAddress');
    const reviewPayment = document.getElementById('reviewPayment');

    reviewAddress.innerHTML = `
        ${firstName} ${lastName}<br>
        ${address}<br>
        ${city}, ${state} ${zip}<br>
        ${country}<br>
        📧 ${email}<br>
        📱 ${phone}
    `;

    reviewPayment.innerHTML = `
        ${cardHolder}<br>
        Card: •••• •••• •••• ${cardNumber.slice(-4)}<br>
        Expires: ${expiry}
    `;
}

// Place order
function placeOrder() {
    const email = document.getElementById('email').value;
    const orderNumber = 'AMC-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Show success modal
    const modal = document.getElementById('successModal');
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('orderEmail').textContent = email;
    modal.classList.add('active');

    // Clear cart
    localStorage.removeItem('cart');
    cart = [];
}

// Back to home
function backToHome() {
    window.location.href = 'index.html';
}
