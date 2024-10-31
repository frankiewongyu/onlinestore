let cart = [];
let hasInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    if (hasInitialized) return;
    
    console.log('Initializing page...');
    
    cart = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    initializeSearch();
    initializeCartButton();
    
    const currentPath = window.location.pathname;
    if (currentPath.includes('page5.html')) {
        displayOrderSummary();
        addOrderSummaryStyles();
        initializePage5();
    }
    
    hasInitialized = true;
    
    const dropdownToggle = document.getElementById('productDropdown');
    if (dropdownToggle) {
        setupDropdown();
    }

    // Initialize banner if on page1
    if (window.location.pathname.includes('page1.html')) {
        initializeBanner();
    }
});

function setupDropdown() {
    const dropdownToggle = document.getElementById('productDropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    dropdownToggle.addEventListener('click', function(event) {
        event.stopPropagation();
        toggleDropdown(dropdownMenu);
    });

    document.addEventListener('click', function(event) {
        if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
}

function toggleDropdown(menu) {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function initializeCartButton() {
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', function(event) {
            event.stopPropagation();
            showCartMenu();
        });
    }
}

function decreaseQuantity(button) {
    const input = button.parentElement.querySelector('.quantity');
    updateQuantity(input, -1);
}

function increaseQuantity(button) {
    const input = button.parentElement.querySelector('.quantity');
    updateQuantity(input, 1);
}

function updateQuantity(input, increment) {
    let value = parseInt(input.value, 10);
    if (isNaN(value)) value = 1;
    value = Math.max(1, Math.min(99, value + increment));
    input.value = value;
}

function submitProduct(button, productName, price, imageUrl) {
    const quantityInput = button.parentElement.querySelector('.quantity');
    const quantity = parseInt(quantityInput.value, 10);

    const cartItem = { name: productName, price, quantity, image: imageUrl };
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    
    const existingItemIndex = cartItems.findIndex(item => item.name === productName);
    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += quantity;
    } else {
        cartItems.push(cartItem);
    }

    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    cart = cartItems;

    fetch('../php/submit_product.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `product_name=${encodeURIComponent(productName)}&price=${price}&quantity=${quantity}&image_url=${encodeURIComponent(imageUrl)}`
    })
    .then(response => response.text())
    .then(text => {
        if (text.startsWith('success:')) {
            alert(text.substring(8));
            updateCartDisplay();
        } else {
            alert('Unexpected response from server: ' + text);
        }
    })
    .catch(error => alert('An error occurred. Please try again. Details: ' + error.message));
}

function deleteProduct(productName) {
    let storedItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    storedItems = storedItems.filter(item => item.name !== productName);
    sessionStorage.setItem('cartItems', JSON.stringify(storedItems));

    fetch('../php/delete_product.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `product_name=${encodeURIComponent(productName)}`
    })
    .then(response => response.text())
    .then(text => {
        if (text === 'success') {
            updateCartDisplay();
        } else {
            alert('Error deleting product');
        }
    })
    .catch(error => alert('An error occurred while deleting the product'));
}

function updateCartDisplay() {
    const cartMenu = document.querySelector('.cart-menu');
    if (!cartMenu) return;

    const cartItems = cartMenu.querySelector('.cart-items');
    const cartTotal = cartMenu.querySelector('#cart-total-amount');
    const checkoutBtn = cartMenu.querySelector('.checkout-btn');

    try {
        const storedItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
        cartItems.innerHTML = '';
        let total = 0;

        storedItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span>${item.name || item.product_name}</span>
                <span>HK$ ${item.price} x ${item.quantity}</span>
                <button class="delete-btn" onclick="deleteProduct('${item.name || item.product_name}')">X</button>
            `;
            cartItems.appendChild(itemElement);
            total += parseFloat(item.price) * parseInt(item.quantity);
        });

        cartTotal.textContent = `HK$ ${total.toFixed(2)}`;
        
        const isEmpty = storedItems.length === 0;
        checkoutBtn.disabled = isEmpty;
        checkoutBtn.classList.toggle('disabled', isEmpty);
    } catch (error) {
        console.error('Error updating cart display:', error);
        cartItems.innerHTML = '<div class="error-message">Error loading cart items</div>';
    }
}

function showCartMenu() {
    let cartMenu = document.querySelector('.cart-menu');
    if (!cartMenu) {
        cartMenu = document.createElement('div');
        cartMenu.className = 'cart-menu';
        cartMenu.innerHTML = `
            <h2>Your Cart</h2>
            <div class="cart-items"></div>
            <div class="cart-total">
                <span>Total:</span>
                <span id="cart-total-amount">HK$ 0.00</span>
            </div>
            <div class="checkout-btn-container">
                <button class="checkout-btn">Proceed to Checkout</button>
            </div>
        `;
        document.body.appendChild(cartMenu);
    }

    updateCartDisplay();

    const cartButton = document.querySelector('.cart-button');
    const cartButtonRect = cartButton.getBoundingClientRect();
    cartMenu.style.top = (cartButtonRect.bottom + window.scrollY) + 'px';
    cartMenu.style.right = (window.innerWidth - cartButtonRect.right) + 'px';
    cartMenu.style.display = 'block';

    const checkoutBtn = cartMenu.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', function() {
        const storedItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
        if (storedItems.length > 0) {
            window.location.href = 'page5.html';
        } else {
            alert('Your cart is empty. Please add items before proceeding to checkout.');
        }
    });

    document.addEventListener('click', function closeCartMenu(e) {
        if (!cartMenu.contains(e.target) && e.target !== cartButton) {
            cartMenu.style.display = 'none';
            document.removeEventListener('click', closeCartMenu);
        }
    });
}

function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-button');

    if (searchInput) {
        searchInput.addEventListener('input', searchProducts);
    }

    if (searchButton) {
        searchButton.addEventListener('click', searchProducts);
    }

    document.addEventListener('click', function(event) {
        const searchResults = document.getElementById('search-results');
        const searchBar = document.querySelector('.search-bar');
        if (searchResults && !searchBar.contains(event.target)) {
            searchResults.style.display = 'none';
        }
    });
}

function searchProducts() {
    const searchInput = document.querySelector('.search-bar input');
    const searchTerm = searchInput.value.toLowerCase();

    const products = [
        { name: 'Floral patterned notebook', page: '../html/page2.html' },
        { name: 'Abstract floral notebook', page: '../html/page2.html' },
        { name: 'Modern design notebook', page: '../html/page2.html' },
        { name: 'Vintage style notebook', page: '../html/page2.html' },
        { name: 'Eco-friendly notebook', page: '../html/page2.html' }, 
        { name: 'Floral patterned pen', page: '../html/page3.html' },
        { name: 'Modern design pen', page: '../html/page3.html' },
        { name: 'Elegant pen with fine tip', page: '../html/page3.html' },
        { name: 'Luxury fountain pen', page: '../html/page3.html' },
        { name: 'Colorful gel pen set', page: '../html/page3.html' },
        { name: 'Floral patterned sticky notes', page: '../html/page4.html' },
        { name: 'Multiple pattern sticky notes', page: '../html/page4.html' },
        { name: 'Abstract floral sticky notes', page: '../html/page4.html' },
        { name: 'Pink flowers sticky notes', page: '../html/page4.html' },
        { name: 'Large & small flowers sticky notes', page: '../html/page4.html' }
    ];

    const matchingProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(matchingProducts);
}

function displaySearchResults(results) {
    let searchResults = document.getElementById('search-results');
    
    if (!searchResults) {
        searchResults = document.createElement('div');
        searchResults.id = 'search-results';
        document.querySelector('.search-bar').appendChild(searchResults);
    }

    searchResults.innerHTML = '';

    if (results.length === 0) {
        searchResults.innerHTML = '<p>No results found</p>';
    } else {
        const ul = document.createElement('ul');
        results.forEach(product => {
            const li = document.createElement('li');
            li.textContent = product.name;
            li.addEventListener('click', () => {
                window.location.href = product.page;
            });
            ul.appendChild(li);
        });
        searchResults.appendChild(ul);
    }

    searchResults.style.display = 'block';
}

function displayOrderSummary() {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    try {
        const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
        const uniqueItems = new Map();

        cartItems.forEach(item => {
            const itemName = item.name || item.product_name;
            if (uniqueItems.has(itemName)) {
                const existingItem = uniqueItems.get(itemName);
                existingItem.quantity += parseInt(item.quantity);
            } else {
                uniqueItems.set(itemName, { ...item });
            }
        });

        displayItems(Array.from(uniqueItems.values()));
    } catch (error) {
        console.error('Error displaying order summary:', error);
        productList.innerHTML = '<div class="error-message">Error loading order summary</div>';
    }
}

function displayItems(items) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    // Clear existing content
    productList.innerHTML = '';

    // Add each product to the list
    items.forEach(item => {
        const productElement = document.createElement('div');
        productElement.className = 'product d-flex mb-4';
        productElement.innerHTML = `
            <img src="../image/${item.image || item.image_url}" 
                 alt="${item.name || item.product_name}" 
                 class="me-3" 
                 style="width: 100px; height: 100px; object-fit: cover;">
            <div class="product-details">
                <h3 class="h5 mb-2">${item.name || item.product_name}</h3>
                <p class="mb-1">Quantity: ${item.quantity}</p>
                <p class="mb-0">Price: HK$ ${item.price}</p>
                <p class="mb-0">Subtotal: HK$ ${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}</p>
            </div>
        `;
        productList.appendChild(productElement);
    });

    // Calculate and display totals
    const totalItems = items.reduce((sum, item) => sum + parseInt(item.quantity), 0);
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity)), 0);
    const delivery = 50;
    const totalPrice = subtotal + delivery;
    
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-price').textContent = `HK$ ${totalPrice.toFixed(2)}`;
}

function addOrderSummaryStyles() {
    if (!document.getElementById('order-summary-styles')) {
        const styles = `
            .order-item {
                margin-bottom: 2rem;
            }
            .item-image {
                width: 200px;
                height: 200px;
                background-color: #ddd;
                overflow: hidden;
            }
            .item-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .item-details {
                flex: 1;
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.id = 'order-summary-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

function initializePage5() {
    const emailInput = document.getElementById('email');
    const continueBtn = document.getElementById('continueToShipping');
    
    if (!emailInput || !continueBtn) return;

    emailInput.addEventListener('input', function() {
        const isValid = validateEmail(this.value);
        this.setCustomValidity(isValid ? '' : 'Please enter a valid email address');
        this.classList.toggle('is-invalid', !isValid);
    });

    continueBtn.addEventListener('click', async function(event) {
        event.preventDefault();
        
        const contactForm = document.getElementById('contactForm');
        const deliveryForm = document.getElementById('deliveryForm');
        
        if (!contactForm || !deliveryForm) return;

        if (contactForm.checkValidity() && deliveryForm.checkValidity() && validateEmail(emailInput.value)) {
            try {
                const formData = collectFormData();
                const response = await submitOrder(formData);
                
                if (response.ok) {
                    window.location.href = '../html/page6.html';
                } else {
                    throw new Error('Order submission failed');
                }
            } catch (error) {
                console.error('Error submitting order:', error);
                alert('An error occurred while submitting your order. Please try again.');
            }
        } else {
            contactForm.classList.add('was-validated');
            deliveryForm.classList.add('was-validated');
        }
    });
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

function collectFormData() {
    const formData = {
        email: document.getElementById('email').value,
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        address1: document.getElementById('address1').value,
        address2: document.getElementById('address2').value || '',
        region: document.getElementById('region').value,
        area: document.getElementById('area').value,
        district: document.getElementById('district').value,
        contact: document.getElementById('contact').value,
        totalItems: document.getElementById('total-items').textContent,
        totalPrice: document.getElementById('total-price').textContent.replace('HK$', '').trim(),
        paymentMethod: document.getElementById('payment-method').value || 'Not specified',
        items: JSON.parse(sessionStorage.getItem('cartItems')) || []
    };

    return formData;
}

async function submitOrder(formData) {
    const response = await fetch('../php/submit_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
}

let currentSlide = 0;
const bannerImages = [
    '../image/page1_banner.png',
    '../image/page1_banner2.png',
    '../image/page1_banner3.png'
];

function initializeBanner() {
    const banner = document.querySelector('.banner');
    if (!banner) return;

    const heroImage = banner.querySelector('.hero-image');
    const indicators = banner.querySelectorAll('.indicator');

    // Set initial state
    updateBanner(0);

    // Add click events to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            updateBanner(index);
        });
    });

    // Auto-rotate banner every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % bannerImages.length;
        updateBanner(currentSlide);
    }, 5000);
}

function updateBanner(index) {
    const banner = document.querySelector('.banner');
    const heroImage = banner.querySelector('.hero-image');
    const indicators = banner.querySelectorAll('.indicator');

    // Update image
    heroImage.src = bannerImages[index];
    
    // Update indicators
    indicators.forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.add('active');
            indicator.style.background = '#9DBC98';
        } else {
            indicator.classList.remove('active');
            indicator.style.background = '#D9D9D9';
        }
    });

    currentSlide = index;
}
