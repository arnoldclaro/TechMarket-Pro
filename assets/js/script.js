// --- DATOS DEL MENÚ (URLs de imágenes de Unsplash como ejemplo) ---
const menuItems = [
    { id: 1, name: 'Hamburguesa Clásica Premium', price: 8.50, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop', description: 'Carne Angus, lechuga fresca, tomate orgánico y nuestra salsa secreta.', badge: 'Popular' },
    { id: 2, name: 'Papas Fritas Artesanales', price: 3.00, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop', description: 'Papas cortadas a mano, fritas en aceite premium con sal marina.' },
    { id: 3, name: 'Doble Queso Deluxe', price: 12.00, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop', description: 'Doble carne premium, queso madurado, pepinillos y aderezo especial.', badge: 'Nuevo' },
    { id: 4, name: 'Malteada Vainilla Bourbon', price: 4.50, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop', description: 'Malteada cremosa de vainilla con un toque de sabor a bourbon.' },
    { id: 5, name: 'Nuggets de Pollo Crujientes (x6)', price: 6.50, image: 'https://images.unsplash.com/photo-1544976767-f703648d70c4?w=600&h=400&fit=crop', description: 'Pollo de corral, empanizado en panko japonés. Pídelo con tu salsa favorita.' },
    { id: 6, name: 'Ensalada Premium con Pollo', price: 9.50, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', description: 'Ensalada fresca con pollo a la parrilla, aderezo cítrico y nueces.', badge: 'Fit' }
];

// --- ESTADO GLOBAL ---
let cart = [];

// --- CONSTANTES DEL DOM ---
const productsGrid = document.getElementById('products-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const overlay = document.getElementById('overlay');
const cartItemsList = document.getElementById('cart-items-list');
const cartCountElement = document.getElementById('cart-count');
const cartSubtotalElement = document.getElementById('cart-subtotal');
const cartTotalElement = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// --- UTILIDADES ---

// Crea partículas en el hero (Efecto visual)
function createParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    for(let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heroParticles.appendChild(particle);
    }
}

// Función para formatear el precio a moneda
const formatPrice = (price) => `$${price.toFixed(2)}`;

// --- LÓGICA DEL MENÚ ---

function renderMenu() {
    productsGrid.innerHTML = '';
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                ${item.badge ? `<div class="product-badge">${item.badge}</div>` : ''}
                <div class="product-glow"></div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${item.name}</h3>
                <p class="product-description">${item.description}</p>
                <div class="product-footer">
                    <div class="product-price">${formatPrice(item.price)}</div>
                    <button class="add-to-cart-btn" data-id="${item.id}">
                        <span>Añadir</span>
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// --- LÓGICA DEL CARRITO ---

function openCart() {
    cartSidebar.classList.add('open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Evita scroll en el fondo
}

function closeCart() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = 'auto';
}

function renderCart() {
    cartItemsList.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const listItem = document.createElement('div');
            listItem.className = 'cart-item';
            listItem.innerHTML = `
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <span>${formatPrice(item.price)} × ${item.quantity}</span>
                </div>
                <div class="quantity-controls">
                    <button class="decrease-quantity" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsList.appendChild(listItem);
        });
    }
    
    updateCartTotals();
}

function addToCart(productId) {
    const product = menuItems.find(item => item.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
    
    // Animación para el contador del carrito
    const countEl = document.getElementById('cart-count');
    countEl.style.animation = 'none';
    setTimeout(() => {
        countEl.style.animation = 'pulse 0.5s ease';
    }, 10);
}

function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

function changeQuantity(productId, type) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    if (type === 'increase') {
        item.quantity++;
    } else if (type === 'decrease') {
        item.quantity--;
        if (item.quantity <= 0) {
            removeItem(productId);
            return;
        }
    }
    renderCart();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // Asumimos $5.00 de envío si hay productos, $0.00 si está vacío.
    const shipping = cart.length > 0 ? 5.00 : 0.00; 
    const total = subtotal + shipping;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartSubtotalElement.textContent = formatPrice(subtotal);
    cartTotalElement.textContent = formatPrice(total);
    cartCountElement.textContent = totalItems;
}

// --- LISTENERS DE EVENTOS ---

openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

// Delegación de eventos para añadir productos desde el menú
productsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) {
        const productId = parseInt(btn.dataset.id);
        addToCart(productId);
        // Abrir carrito al añadir si está cerrado
        if (!cartSidebar.classList.contains('open')) {
            openCart();
        }
    }
});

// Delegación de eventos para controles dentro del carrito (eliminar, aumentar/disminuir)
cartItemsList.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const productId = parseInt(button.dataset.id);

    if (button.classList.contains('remove-item-btn')) {
        removeItem(productId);
    } else if (button.classList.contains('increase-quantity')) {
        changeQuantity(productId, 'increase');
    } else if (button.classList.contains('decrease-quantity')) {
        changeQuantity(productId, 'decrease');
    }
});

// Botón de Finalizar Pedido
checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        alert(`🎉 ¡Pedido confirmado!\n\nTotal: ${cartTotalElement.textContent}\n\n✨ Gracias por elegir Fast Food Bites Premium!`);
        // Simular vaciado de carrito después de la compra
        cart = [];
        renderCart();
        closeCart();
    } else {
        alert('Tu carrito está vacío. ¡Explora nuestro menú exclusivo!');
    }
});

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    createParticles(); // Crea las partículas del fondo
    renderMenu();
    renderCart();
});