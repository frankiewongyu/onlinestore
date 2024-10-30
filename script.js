// Initialize an empty cart array
let cart = [];
let hasInitialized = false; // Add this flag to prevent multiple initializations
let isDisplayingOrderSummary = false; // Add this flag

function increaseQuantity(button) {
    let input = button.previousElementSibling;
    let value = parseInt(input.value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    input.value = value;
}

function decreaseQuantity(button) {
    let input = button.nextElementSibling;
    let value = parseInt(input.value, 10);
    if (value > 1) {
        value = isNaN(value) ? 0 : value;
        value--;
        input.value = value;
    }
}

function submitProduct(button, productName, price, imageUrl) {
    const quantityInput = button.parentElement.querySelector('.quantity');
    const quantity = parseInt(quantityInput.value, 10);

    // Create cart item object
    const cartItem = {
        name: productName,
        price: price,
        quantity: quantity,
        image: imageUrl
    };

    // Get existing cart items from sessionStorage or initialize empty array
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.name === productName);
    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += quantity;
    } else {
        cartItems.push(cartItem);
    }

    // Save updated cart to sessionStorage
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    cart = cartItems; // Update local cart array

    fetch('submit_product.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `product_name=${encodeURIComponent(productName)}&price=${price}&quantity=${quantity}&image_url=${encodeURIComponent(imageUrl)}`
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.text();
    })
    .then(text => {
        console.log('Raw response:', text);
        if (text.startsWith('success:')) {
            alert(text.substring(8)); // Remove 'success:' prefix
            // Update the cart locally
            updateLocalCart(productName, price, quantity, imageUrl);
            // Update the cart display
            updateCartDisplay();
        } else {
            alert('Unexpected response from server: ' + text);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please try again. Details: ' + error.message);
    });
}

function updateLocalCart(productName, price, quantity, imageUrl) {
    let existingProduct = cart.find(item => item.product_name === productName);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({product_name: productName, price: price, quantity: quantity, image_url: imageUrl});
    }
}

function deleteProduct(productName) {
    // Get current items from sessionStorage
    let storedItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    
    // Remove the item
    storedItems = storedItems.filter(item => 
        (item.name || item.product_name) !== productName
    );
    
    // Update sessionStorage
    sessionStorage.setItem('cartItems', JSON.stringify(storedItems));

    // Update PHP backend
    fetch('delete_product.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `product_name=${encodeURIComponent(productName)}`
    })
    .then(response => response.text())
    .then(text => {
        if (text === 'success') {
            console.log('Product deleted successfully');
            // Update the cart display
            updateCartDisplay();
        } else {
            alert('Error deleting product');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting the product');
    });
}

function updateCartDisplay() {
    const cartMenu = document.querySelector('.cart-menu');
    if (!cartMenu) return;

    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('#cart-total-amount');
    const checkoutBtn = cartMenu.querySelector('.checkout-btn');

    // Get items from sessionStorage
    const storedItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    
    cartItems.innerHTML = '';
    let total = 0;

    console.log('Current stored items:', storedItems);

    storedItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <span>${item.name || item.product_name}</span>
            <span>HK$ ${item.price} x ${item.quantity}</span>
            <button class="delete-btn" onclick="deleteProduct('${item.name || item.product_name}')">X</button>
        `;
        cartItems.appendChild(itemElement);

        total += item.price * item.quantity;
    });

    cartTotal.textContent = `HK$ ${total.toFixed(2)}`;
    
    // Enable or disable checkout button based on stored items
    if (storedItems.length > 0) {
        checkoutBtn.disabled = false;
    } else {
        checkoutBtn.disabled = true;
    }
}

function showCartMenu() {
    console.log('showCartMenu called');
    let cartMenu = document.querySelector('.cart-menu');
    if (!cartMenu) {
        console.log('Creating new cart menu');
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

    // Add event listener to the checkout button
    const checkoutBtn = cartMenu.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', function() {
        const storedItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
        if (storedItems.length > 0) {
            window.location.href = 'page5.html';
        } else {
            alert('Your cart is empty. Please add items before proceeding to checkout.');
        }
    });

    // Add event listener to close the menu when clicking outside
    document.addEventListener('click', function closeCartMenu(e) {
        if (!cartMenu.contains(e.target) && e.target !== cartButton) {
            cartMenu.style.display = 'none';
            document.removeEventListener('click', closeCartMenu);
        }
    });
}

// Remove all existing DOMContentLoaded event listeners and combine them into one
document.addEventListener('DOMContentLoaded', function() {
    if (hasInitialized) return;
    
    console.log('Initializing page...');
    
    // Initialize cart from sessionStorage
    cart = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    
    // Initialize search and cart functionality
    initializeSearch();
    
    // Initialize cart button
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', function(event) {
            event.stopPropagation();
            showCartMenu();
        });
    }
    
    // Only initialize order summary on page5.html
    if (window.location.pathname.includes('page5.html')) {
        console.log('Initializing order summary...');
        displayOrderSummary();
        addOrderSummaryStyles();
    }
    
    hasInitialized = true;
});

// Move styles to a separate function
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

// Remove loadCartData and startCartUpdater functions since we're using sessionStorage

// Modify displayOrderSummary to only use sessionStorage
function displayOrderSummary() {
    if (isDisplayingOrderSummary) return;
    isDisplayingOrderSummary = true;

    const productList = document.getElementById('product-list');
    if (!productList) {
        isDisplayingOrderSummary = false;
        return;
    }

    console.log('Displaying order summary...');
    
    // Clear existing content first
    productList.innerHTML = '';

    // Get items from sessionStorage only
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    console.log('Cart items:', cartItems);
    
    if (cartItems.length > 0) {
        displayItems(cartItems);
    }
    
    isDisplayingOrderSummary = false;
}

// Function to validate email
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

// Function to handle page5 functionality
function initializePage5() {
    const emailInput = document.getElementById('email');
    
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (this.validity.typeMismatch || !validateEmail(this.value)) {
                this.setCustomValidity('Please enter a valid email address');
                this.classList.add('is-invalid');
            } else {
                this.setCustomValidity('');
                this.classList.remove('is-invalid');
            }
        });
    }

    fetch('get_cart.php')
        .then(response => response.json())
        .then(cart => {
            const productList = document.getElementById('product-list');
            if (!productList) return;

            let totalItems = 0;
            let totalPrice = 0;

            cart.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'product d-flex mb-4';
                productElement.innerHTML = `
                    <img src="${product.image_url}" alt="${product.product_name}" class="me-3" style="width: 100px; height: 100px; object-fit: cover;">
                    <div class="product-details">
                        <h3 class="h5">${product.product_name}</h3>
                        <p class="mb-0">ITEMS: <span>${product.quantity}</span></p>
                        <p>HK$ <span>${product.price}</span></p>
                    </div>
                `;
                productList.appendChild(productElement);

                totalItems += parseInt(product.quantity);
                totalPrice += parseFloat(product.price) * parseInt(product.quantity);
            });

            document.getElementById('total-items').textContent = totalItems;
            document.getElementById('total-price').textContent = `HK$${totalPrice.toFixed(2)}`;
        })
        .catch(error => console.error('Error:', error));

    const continueToShippingBtn = document.getElementById('continueToShipping');
    if (continueToShippingBtn) {
        continueToShippingBtn.addEventListener('click', function(event) {
            event.preventDefault();
            
            const contactForm = document.getElementById('contactForm');
            const deliveryForm = document.getElementById('deliveryForm');
            
            if (contactForm.checkValidity() && deliveryForm.checkValidity() && validateEmail(emailInput.value)) {
                const formData = {
                    action: 'submit_order',
                    email: document.getElementById('email').value,
                    first_name: document.getElementById('first-name').value,
                    last_name: document.getElementById('last-name').value,
                    address1: document.getElementById('address1').value,
                    address2: document.getElementById('address2').value,
                    region: document.getElementById('region').value,
                    area: document.getElementById('area').value,
                    district: document.getElementById('district').value,
                    contact: document.getElementById('contact').value,
                    totalItems: document.getElementById('total-items').textContent,
                    totalPrice: document.getElementById('total-price').textContent.replace('HK$', '').trim(),
                    paymentMethod: document.getElementById('payment-method').value || 'Not specified'
                };

                fetch('submit_order.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    console.log('Server response:', data);
                    if (data.startsWith('success:')) {
                        alert(data.substring(8)); // Remove 'success:' prefix
                        window.location.href = 'page6.html';
                    } else {
                        throw new Error(data);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred: ' + error.message);
                });
            } else {
                contactForm.classList.add('was-validated');
                deliveryForm.classList.add('was-validated');
                
                if (!validateEmail(emailInput.value)) {
                    emailInput.setCustomValidity('Please enter a valid email address');
                    emailInput.classList.add('is-invalid');
                }
            }
        });
    }
}

// Call initializePage5 when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    loadCartData();
    startCartUpdater();
    initializePage5();
    
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        console.log('Cart button found');
        cartButton.addEventListener('click', function(event) {
            console.log('Cart button clicked');
            event.stopPropagation();
            showCartMenu();
        });
    } else {
        console.error('Cart button not found');
    }
});

function searchProducts() {
    const searchInput = document.querySelector('.search-bar input');
    const searchTerm = searchInput.value.toLowerCase();

    // Define your product database
    const products = [
        { name: 'Floral patterned notebook', page: 'page2.html' },
        { name: 'Abstract floral notebook', page: 'page2.html' },
        { name: 'Modern design notebook', page: 'page2.html' },
        { name: 'Vintage style notebook', page: 'page2.html' },
        { name: 'Eco-friendly notebook', page: 'page2.html' },
        { name: 'Floral patterned pen', page: 'page3.html' },
        { name: 'Modern design pen', page: 'page3.html' },
        { name: 'Elegant pen with fine tip', page: 'page3.html' },
        { name: 'Luxury fountain pen', page: 'page3.html' },
        { name: 'Colorful gel pen set', page: 'page3.html' },
        { name: 'Floral patterned sticky notes', page: 'page4.html' },
        { name: 'Patterned sticky notes', page: 'page4.html' },
        { name: 'Abstract floral sticky notes', page: 'page4.html' },
        { name: 'Modern abstract sticky notes', page: 'page4.html' }
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

    // Show the search results
    searchResults.style.display = 'block';
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-button');

    if (searchInput) {
        searchInput.addEventListener('input', searchProducts);
    }

    if (searchButton) {
        searchButton.addEventListener('click', searchProducts);
    }

    // Hide search results when clicking outside
    document.addEventListener('click', function(event) {
        const searchResults = document.getElementById('search-results');
        const searchBar = document.querySelector('.search-bar');
        if (searchResults && !searchBar.contains(event.target)) {
            searchResults.style.display = 'none';
        }
    });
});

// Separate function to handle the actual display of items
function displayItems(items) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    items.forEach(item => {
        const productHtml = `
            <div class="order-item mb-4">
                <div class="d-flex align-items-start">
                    <div class="item-image me-3">
                        <img src="${item.image || item.image_url}" alt="${item.name || item.product_name}" 
                             style="width: 200px; height: 200px; object-fit: cover; background-color: #ddd;">
                    </div>
                    <div class="item-details">
                        <h2 style="font-size: 32px; margin-bottom: 10px;">${item.name || item.product_name}</h2>
                        <p style="font-size: 20px; margin: 5px 0;">ITEMS: ${item.quantity}</p>
                        <p style="font-size: 20px; margin: 5px 0;">HK$ ${item.price}</p>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += productHtml;
    });

    // Update totals
    const totalItems = items.reduce((sum, item) => sum + parseInt(item.quantity), 0);
    const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity)), 0);
    
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-price').textContent = `HK$ ${totalPrice}`;
}

// Update the initializeSearch function
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-button');
    const cartButton = document.querySelector('.cart-button');

    if (searchInput) {
        searchInput.addEventListener('input', searchProducts);
    }

    if (searchButton) {
        searchButton.addEventListener('click', searchProducts);
    }

    if (cartButton) {
        cartButton.addEventListener('click', function(event) {
            event.stopPropagation();
            showCartMenu();
        });
    }
}

// Add this function to handle form submission and database storage
function submitOrder(formData) {
    fetch('submit_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.text())
    .then(data => {
        if (data.startsWith('success')) {
            alert('Order submitted successfully!');
            // Clear cart after successful submission
            sessionStorage.removeItem('cartItems');
            // Redirect to confirmation page
            window.location.href = 'page6.html';
        } else {
            alert('Error submitting order: ' + data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the order.');
    });
}

// Update the form validation and submission in page5.html
document.getElementById('continueToShipping').addEventListener('click', function(event) {
    event.preventDefault();
    
    const contactForm = document.getElementById('contactForm');
    const deliveryForm = document.getElementById('deliveryForm');
    
    // Add was-validated class to show validation feedback
    contactForm.classList.add('was-validated');
    deliveryForm.classList.add('was-validated');
    
    // Check if both forms are valid
    if (contactForm.checkValidity() && deliveryForm.checkValidity()) {
        // Get cart items
        const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Prepare form data
        const formData = {
            email: document.getElementById('email').value,
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            address1: document.getElementById('address1').value,
            address2: document.getElementById('address2').value,
            region: document.getElementById('region').value,
            area: document.getElementById('area').value,
            district: document.getElementById('district').value,
            contact: document.getElementById('contact').value,
            paymentMethod: document.getElementById('payment-method').value,
            items: cartItems,
            totalItems: document.getElementById('total-items').textContent,
            totalPrice: document.getElementById('total-price').textContent.replace('HK$', '').trim()
        };

        // Submit the order
        submitOrder(formData);
    }
});
