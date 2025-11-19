// Telegram Web App инициализация
let tg = window.Telegram.WebApp;
tg.expand();
tg.MainButton.setText("Оформить заказ").hide();

// Состояние приложения
let state = {
    cart: [],
    currentCategory: null
};

// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
function initApp() {
    renderCategories();
    renderMenuItems();
    setupEventListeners();
    updateCartUI();
}

// РЕНДЕР КАТЕГОРИЙ
function renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = '';
    
    menuData.categories.forEach(category => {
        const button = document.createElement('button');
        button.className = `category-btn ${state.currentCategory === category.id ? 'active' : ''}`;
        button.textContent = category.name;
        button.onclick = () => {
            state.currentCategory = category.id;
            renderCategories();
            renderMenuItems();
        };
        categoriesContainer.appendChild(button);
    });
}

// РЕНДЕР БЛЮД
function renderMenuItems() {
    const menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = '';
    
    // Фильтруем блюда по категории
    const itemsToShow = state.currentCategory 
        ? menuData.items.filter(item => item.category === state.currentCategory)
        : menuData.items;
    
    // Группируем по категориям
    const categories = state.currentCategory 
        ? [menuData.categories.find(cat => cat.id === state.currentCategory)]
        : menuData.categories;
    
    categories.forEach(category => {
        const categoryItems = itemsToShow.filter(item => item.category === category.id);
        
        if (categoryItems.length > 0) {
            const section = document.createElement('div');
            section.className = 'menu-section';
            
            const title = document.createElement('h2');
            title.className = 'section-title';
            title.textContent = category.name;
            section.appendChild(title);
            
            const itemsGrid = document.createElement('div');
            itemsGrid.className = 'menu-items';
            
            categoryItems.forEach(item => {
                const itemElement = createMenuItem(item);
                itemsGrid.appendChild(itemElement);
            });
            
            section.appendChild(itemsGrid);
            menuContainer.appendChild(section);
        }
    });
}

// СОЗДАНИЕ КАРТОЧКИ БЛЮДА
function createMenuItem(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'menu-item';
    
    itemElement.innerHTML = `
        <div class="item-image">${item.image}</div>
        <div class="item-info">
            <div class="item-name">${item.name}</div>
            <div class="item-description">${item.description}</div>
            <div class="item-details">
                <div class="item-price">${item.price} ₽</div>
                <div class="item-weight">${item.weight || item.volume || ''}</div>
            </div>
        </div>
        <button class="add-btn" onclick="addToCart(${item.id})">
            +
        </button>
    `;
    
    return itemElement;
}

// КОРЗИНА: ДОБАВЛЕНИЕ ТОВАРА
function addToCart(itemId) {
    const item = menuData.items.find(i => i.id === itemId);
    if (!item) return;
    
    const existingItem = state.cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification(`Добавлено: ${item.name}`);
}

// КОРЗИНА: ИЗМЕНЕНИЕ КОЛИЧЕСТВА
function updateCartQuantity(itemId, change) {
    const item = state.cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartUI();
        }
    }
}

// КОРЗИНА: УДАЛЕНИЕ ТОВАРА
function removeFromCart(itemId) {
    state.cart = state.cart.filter(item => item.id !== itemId);
    updateCartUI();
}

// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА КОРЗИНЫ
function updateCartUI() {
    // Обновляем счетчик в шапке
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
    
    // Обновляем список товаров в корзине
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';
    
    state.cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div>${item.price} ₽ × ${item.quantity}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Обновляем общую сумму
    const totalAmount = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalAmount').textContent = totalAmount;
    
    // Управляем кнопкой оформления заказа
    if (totalAmount > 0) {
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// УВЕДОМЛЕНИЯ
function showNotification(message) {
    tg.showPopup({
        title: 'Уведомление',
        message: message,
        buttons: [{ type: 'ok' }]
    });
}

// НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ
function setupEventListeners() {
    // Открытие корзины
    document.getElementById('cartBtn').onclick = () => {
        document.getElementById('cartSidebar').classList.add('open');
    };
    
    // Закрытие корзины
    document.getElementById('closeCart').onclick = () => {
        document.getElementById('cartSidebar').classList.remove('open');
    };
    
    // Оформление заказа
    tg.MainButton.onClick(() => {
        const orderData = {
            items: state.cart,
            total: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            user: tg.initDataUnsafe.user,
            timestamp: new Date().toISOString()
        };
        
        // Отправляем данные в бота
        tg.sendData(JSON.stringify(orderData));
        
        tg.showPopup({
            title: 'Заказ оформлен!',
            message: `Спасибо! Ваш заказ на ${orderData.total} ₽ принят.`,
            buttons: [{ type: 'ok' }]
        });
        
        // Очищаем корзину
        state.cart = [];
        updateCartUI();
        document.getElementById('cartSidebar').classList.remove('open');
    });
}

// ЗАПУСК ПРИЛОЖЕНИЯ
document.addEventListener('DOMContentLoaded', initApp);