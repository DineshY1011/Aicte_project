document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    let cart = [];

    // Open cart modal
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
        updateCartDisplay();
    });

    // Close cart modal
    continueShoppingBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Add to cart
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const productId = productCard.dataset.id;
            const productName = productCard.querySelector('h3').textContent;
            // Updated price parsing
            const priceElement = productCard.querySelector('.price');
            const productPrice = parseFloat(priceElement.textContent.replace('₹', '').replace(',', '').trim());

            addToCart(productId, productName, productPrice);
            showCartMessage(productName);
            console.log(`Adding to cart: ${productName}, Price: ${productPrice}`); // For debugging
        });
    });

    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price: Number(price), quantity: 1 });
        }

        updateCartCount();
        updateCartDisplay();
        console.log(`Added to cart: ${name}, Price: ${price}`); // For debugging
    }

    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function updateCartDisplay() {
        cartItems.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            const itemTotal = item.price * item.quantity;
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <p>${item.name} - ₹${item.price.toFixed(2)} x ${item.quantity}</p>
                    <p>Total: ₹${itemTotal.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `;
            cartItems.appendChild(itemElement);

            subtotal += itemTotal;
        });

        const tax = subtotal * 0.18; // 18% tax
        const total = subtotal + tax;

        document.getElementById('cart-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
        document.getElementById('cart-tax').textContent = `₹${tax.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `₹${total.toFixed(2)}`;

        // Add event listeners for remove, increase, and decrease buttons
        const removeButtons = cartItems.querySelectorAll('.remove-item');
        const increaseButtons = cartItems.querySelectorAll('.increase-quantity');
        const decreaseButtons = cartItems.querySelectorAll('.decrease-quantity');

        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemId = button.dataset.id;
                removeFromCart(itemId);
            });
        });

        increaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemId = button.dataset.id;
                updateQuantity(itemId, 1);
            });
        });

        decreaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemId = button.dataset.id;
                updateQuantity(itemId, -1);
            });
        });
    }

    function updateQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) {
                removeFromCart(id);
            } else {
                updateCartCount();
                updateCartDisplay();
            }
        }
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartCount();
        updateCartDisplay();
    }

    // Checkout button (for demo purposes)
    checkoutBtn.addEventListener('click', () => {
        alert('Thank you for your purchase!');
        cart = [];
        updateCartCount();
        updateCartDisplay();
        cartModal.style.display = 'none';
    });

    function showCartMessage(productName) {
        const message = document.createElement('div');
        message.className = 'cart-message';
        message.textContent = `${productName} has been added to your cart`;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.display = 'block';
        }, 100);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }
});