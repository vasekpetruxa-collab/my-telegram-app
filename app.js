// Telegram Web App инициализация
let tg = null;

// Проверка наличия Telegram WebApp API
if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.expand();
    tg.MainButton.setText("Оформить заказ").hide();
} else {
    console.warn('Telegram WebApp API не найден. Приложение работает в режиме разработки.');
    // Создаем заглушку для разработки
    tg = {
        expand: () => {},
        MainButton: {
            setText: () => {},
            show: () => {},
            hide: () => {},
            onClick: () => {}
        },
        showPopup: (options) => {
            alert(options.title + '\n' + options.message);
        },
        sendData: (data) => {
            console.log('Отправка данных:', data);
        },
        initDataUnsafe: {
            user: {
                id: 0,
                first_name: 'Тестовый',
                last_name: 'Пользователь'
            }
        }
    };
}

// Состояние приложения
let state = {
    cart: [],
    currentCategory: null,
    searchQuery: ''
};

function getCartItemQuantity(itemId) {
    const item = state.cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
}

function getItemControlsMarkup(itemId, quantity) {
    if (quantity > 0) {
        return `
            <div class="item-quantity-controls">
                <div class="quantity-btn" role="button" tabindex="0" onclick="updateCartQuantity(${itemId}, -1)">-</div>
                <span class="item-quantity">${quantity}</span>
                <div class="quantity-btn" role="button" tabindex="0" onclick="updateCartQuantity(${itemId}, 1)">+</div>
            </div>
        `;
    }
    
    return `
        <button class="add-btn" onclick="addToCart(${itemId})">
            +
        </button>
    `;
}

function refreshMenuItemControls(itemId) {
    const itemElement = document.querySelector(`.menu-item[data-item-id="${itemId}"]`);
    if (!itemElement) return;
    
    const controlsContainer = itemElement.querySelector('.item-actions');
    if (!controlsContainer) return;
    
    const quantity = getCartItemQuantity(itemId);
    controlsContainer.innerHTML = getItemControlsMarkup(itemId, quantity);
}

// КЛЮЧ ДЛЯ LOCALSTORAGE
const CART_STORAGE_KEY = 'telegram_app_cart';

// СОХРАНЕНИЕ КОРЗИНЫ В LOCALSTORAGE
function saveCartToStorage() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
    } catch (e) {
        console.error('Ошибка сохранения корзины:', e);
    }
}

// ЗАГРУЗКА КОРЗИНЫ ИЗ LOCALSTORAGE
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            state.cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.error('Ошибка загрузки корзины:', e);
        state.cart = [];
    }
}

// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
function initApp() {
    loadCartFromStorage(); // Загружаем корзину из localStorage
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
    
    // Фильтруем блюда по категории и поисковому запросу
    let itemsToShow = state.currentCategory 
        ? menuData.items.filter(item => item.category === state.currentCategory)
        : menuData.items;
    
    // Применяем поиск
    if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase().trim();
        itemsToShow = itemsToShow.filter(item => 
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
    }
    
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
    
    // Показываем сообщение, если ничего не найдено
    if (itemsToShow.length === 0 && state.searchQuery.trim()) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #6c757d;">
                <div style="font-size: 48px; margin-bottom: 15px;">🔍</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Ничего не найдено</div>
                <div style="font-size: 14px;">Попробуйте изменить поисковый запрос</div>
            </div>
        `;
        menuContainer.appendChild(emptyMessage);
    }
}

// СОЗДАНИЕ КАРТОЧКИ БЛЮДА
function createMenuItem(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'menu-item';
    itemElement.dataset.itemId = item.id;
    const categoryImage = menuData.categories.find(cat => cat.id === item.category)?.image;
    const hasCustomImage = typeof item.image === 'string' && /[./]/.test(item.image);
    const itemImageSrc = hasCustomImage
        ? item.image
        : (categoryImage || './assets/images/categories/placeholder.jpg');
    const quantity = getCartItemQuantity(item.id);
    
    itemElement.innerHTML = `
        <div class="item-image">
            <img src="${itemImageSrc}" alt="${item.name}" loading="lazy">
        </div>
        <div class="item-info">
            <div class="item-name">${item.name}</div>
            <div class="item-description">${item.description}</div>
            <div class="item-details">
                <div class="item-price">${item.price} ₽</div>
                <div class="item-weight">${item.weight || item.volume || ''}</div>
            </div>
        </div>
        <div class="item-actions">
            ${getItemControlsMarkup(item.id, quantity)}
        </div>
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
    
    saveCartToStorage(); // Сохраняем корзину
    updateCartUI();
    refreshMenuItemControls(itemId);
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
            saveCartToStorage(); // Сохраняем корзину
            updateCartUI();
            refreshMenuItemControls(itemId);
        }
    }
}

// КОРЗИНА: УДАЛЕНИЕ ТОВАРА
function removeFromCart(itemId) {
    state.cart = state.cart.filter(item => item.id !== itemId);
    saveCartToStorage(); // Сохраняем корзину
    updateCartUI();
    refreshMenuItemControls(itemId);
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
    if (tg && tg.MainButton) {
        if (totalAmount > 0) {
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }
    }
}

// УВЕДОМЛЕНИЯ (TOAST)
function showNotification(message, type = 'success') {
    // Показываем toast уведомление
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Анимация появления
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ
function setupEventListeners() {
    // Поиск по меню
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderMenuItems();
    });
    
    // Открытие корзины
    document.getElementById('cartBtn').onclick = () => {
        document.getElementById('cartSidebar').classList.add('open');
    };
    
    // Закрытие корзины
    document.getElementById('closeCart').onclick = () => {
        document.getElementById('cartSidebar').classList.remove('open');
    };
    
    // Закрытие корзины по клику на фон
    document.getElementById('cartSidebar').addEventListener('click', (e) => {
        if (e.target.id === 'cartSidebar') {
            document.getElementById('cartSidebar').classList.remove('open');
        }
    });
    
    // Оформление заказа
    if (tg && tg.MainButton) {
        tg.MainButton.onClick(() => {
            try {
                const orderData = {
                    items: state.cart,
                    total: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    user: tg.initDataUnsafe?.user || null,
                    timestamp: new Date().toISOString()
                };
                
                // Проверяем, что корзина не пуста
                if (orderData.items.length === 0) {
                    showNotification('Корзина пуста. Добавьте товары в корзину.', 'error');
                    return;
                }
                
                // Отправляем данные в бота
                if (tg.sendData) {
                    tg.sendData(JSON.stringify(orderData));
                }
                
                // Показываем уведомление об успешном заказе
                showNotification(`Заказ оформлен! Сумма: ${orderData.total} ₽`, 'success');
                
                // Также показываем popup в Telegram, если доступен
                if (tg && tg.showPopup) {
                    tg.showPopup({
                        title: 'Заказ оформлен!',
                        message: `Спасибо! Ваш заказ на ${orderData.total} ₽ принят.`,
                        buttons: [{ type: 'ok' }]
                    });
                }
                
                // Очищаем корзину
                state.cart = [];
                saveCartToStorage(); // Сохраняем пустую корзину
                updateCartUI();
                document.getElementById('cartSidebar').classList.remove('open');
            } catch (error) {
                console.error('Ошибка при оформлении заказа:', error);
                showNotification('Произошла ошибка при оформлении заказа. Попробуйте еще раз.', 'error');
            }
        });
    }
}

// ЗАПУСК ПРИЛОЖЕНИЯ
document.addEventListener('DOMContentLoaded', initApp);