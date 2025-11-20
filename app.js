// Telegram Web App инициализация
let tg = null;

// Проверка наличия Telegram WebApp API
if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.expand();
    if (tg.MainButton) {
        tg.MainButton.setParams({ text: '', is_visible: false });
        tg.MainButton.hide();
        tg.MainButton.onClick(() => {});
    }
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
const defaultCategoryId = menuData?.categories?.[0]?.id || null;
const PICKUP_ADDRESS = 'г. Шахты, ул. Советская, дом 235 «Бункер»';

let state = {
    cart: [],
    currentCategory: defaultCategoryId,
    searchQuery: '',
    modalItemId: null,
    modalQuantity: 1,
    cutleryCount: 0,
    paymentMethod: 'cod',
    deliveryType: 'pickup',
    customerPhone: '',
    recipientName: '',
    deliveryAddress: PICKUP_ADDRESS,
    addressSuggestions: []
};

function getCartItemQuantity(itemId) {
    const item = state.cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
}

function resolveItemImage(item) {
    const categoryImage = menuData.categories.find(cat => cat.id === item.category)?.image;
    const hasCustomImage = typeof item.image === 'string' && /[./]/.test(item.image);
    return hasCustomImage
        ? item.image
        : (categoryImage || './assets/images/categories/placeholder.jpg');
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
    if (!state.currentCategory) {
        state.currentCategory = defaultCategoryId;
    }
    if (state.deliveryType === 'pickup') {
        state.deliveryAddress = PICKUP_ADDRESS;
    }
    renderCategories();
    renderMenuItems();
    setupEventListeners();
    setDeliveryMode(state.deliveryType);
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
            itemsGrid.className = state.currentCategory ? 'menu-items category-grid' : 'menu-items';
            
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
    const isCategoryView = Boolean(state.currentCategory);
    itemElement.className = `menu-item ${isCategoryView ? 'compact' : ''}`;
    itemElement.dataset.itemId = item.id;
    const itemImageSrc = resolveItemImage(item);
    
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
            <button class="add-btn" type="button">+</button>
        </div>
    `;
    
    itemElement.addEventListener('click', () => openItemModal(item.id));
    const actionButton = itemElement.querySelector('.add-btn');
    if (actionButton) {
        actionButton.addEventListener('click', (e) => {
            e.stopPropagation();
            openItemModal(item.id);
        });
    }
    
    return itemElement;
}

// КОРЗИНА: ДОБАВЛЕНИЕ ТОВАРА
function addItemToCart(itemId, quantity = 1) {
    const item = menuData.items.find(i => i.id === itemId);
    if (!item || quantity <= 0) return;
    
    const existingItem = state.cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        state.cart.push({
            ...item,
            quantity
        });
    }
    
    saveCartToStorage(); // Сохраняем корзину
    updateCartUI();
    showNotification(`Добавлено: ${item.name}`);
}

function addToCart(itemId) {
    addItemToCart(itemId, 1);
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
        }
    }
}

// КОРЗИНА: УДАЛЕНИЕ ТОВАРА
function removeFromCart(itemId) {
    state.cart = state.cart.filter(item => item.id !== itemId);
    saveCartToStorage(); // Сохраняем корзину
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
        const itemImageSrc = resolveItemImage(item);
        cartItem.innerHTML = `
            <div class="cart-item-thumb">
                <img src="${itemImageSrc}" alt="${item.name}">
            </div>
            <div class="cart-item-body">
                <div class="cart-item-row">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">${item.price} ₽</span>
                </div>
                <div class="cart-item-description">${item.description}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    <div class="cart-item-total">${item.price * item.quantity} ₽</div>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Обновляем общую сумму
    const totalAmount = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalAmount').textContent = totalAmount;
    document.getElementById('cutleryCount').textContent = state.cutleryCount;
    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    const summaryList = document.getElementById('checkoutSummary');
    if (!summaryList) return;
    
    summaryList.innerHTML = '';
    
    if (state.cart.length === 0) {
        summaryList.innerHTML = `<p class="empty-summary">Корзина пуста. Добавьте блюда, чтобы продолжить.</p>`;
    } else {
        state.cart.forEach(item => {
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            summaryItem.innerHTML = `
                <div>
                    <div class="summary-item-name">${item.name}</div>
                    <div class="summary-item-details">${item.quantity} × ${item.price} ₽</div>
                </div>
                <div class="summary-item-total">${item.price * item.quantity} ₽</div>
            `;
            summaryList.appendChild(summaryItem);
        });
    }
    
    document.getElementById('summaryCutlery').textContent = `${state.cutleryCount} шт.`;
    const totalAmount = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('summaryTotal').textContent = `${totalAmount} ₽`;
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

// МОДАЛЬНОЕ ОКНО БЛЮДА
function openItemModal(itemId) {
    const item = menuData.items.find(i => i.id === itemId);
    if (!item) return;
    
    state.modalItemId = itemId;
    state.modalQuantity = getCartItemQuantity(itemId) || 1;
    
    const itemImageSrc = resolveItemImage(item);
    
    document.getElementById('modalItemImage').src = itemImageSrc;
    document.getElementById('modalItemImage').alt = item.name;
    document.getElementById('modalItemName').textContent = item.name;
    document.getElementById('modalItemDescription').textContent = item.description;
    document.getElementById('modalItemWeight').textContent = item.weight || item.volume || '';
    document.getElementById('modalItemPrice').textContent = `${item.price} ₽`;
    document.getElementById('modalQuantity').textContent = state.modalQuantity;
    
    const modal = document.getElementById('itemModal');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
}

function closeItemModal() {
    const modal = document.getElementById('itemModal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    state.modalItemId = null;
    state.modalQuantity = 1;
}

function updateModalQuantity(change) {
    const nextValue = state.modalQuantity + change;
    if (nextValue < 1) return;
    state.modalQuantity = nextValue;
    document.getElementById('modalQuantity').textContent = state.modalQuantity;
}

function addModalItemToCart() {
    if (!state.modalItemId) return;
    addItemToCart(state.modalItemId, state.modalQuantity);
    closeItemModal();
}

// НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ
function updateCutlery(change) {
    const nextValue = Math.max(0, state.cutleryCount + change);
    state.cutleryCount = nextValue;
    document.getElementById('cutleryCount').textContent = nextValue;
    updateCheckoutSummary();
}

function requestPhoneNumber() {
    if (tg && tg.requestContact) {
        tg.requestContact((response) => {
            if (response?.phone_number) {
                document.getElementById('customerPhone').value = response.phone_number;
                state.customerPhone = response.phone_number;
            }
        });
    } else {
        showNotification('Запрос номера не поддерживается в режиме разработки.', 'info');
    }
}

function setDeliveryMode(mode) {
    state.deliveryType = mode;
    const addressInput = document.getElementById('deliveryAddress');
    const searchBtn = document.getElementById('searchAddressBtn');
    const suggestions = document.getElementById('addressSuggestions');
    const pickupInfo = document.getElementById('pickupInfo');
    
    if (!addressInput || !searchBtn || !suggestions || !pickupInfo) {
        return;
    }
    
    if (mode === 'pickup') {
        addressInput.value = PICKUP_ADDRESS;
        addressInput.readOnly = true;
        addressInput.classList.add('hidden');
        searchBtn.classList.add('hidden');
        suggestions.classList.add('hidden');
        suggestions.classList.remove('visible');
        pickupInfo.classList.remove('hidden');
        state.deliveryAddress = PICKUP_ADDRESS;
        state.addressSuggestions = [];
        renderAddressSuggestions();
    } else {
        addressInput.readOnly = false;
        addressInput.classList.remove('hidden');
        searchBtn.classList.remove('hidden');
        suggestions.classList.remove('hidden');
        pickupInfo.classList.add('hidden');
        if (state.deliveryAddress === PICKUP_ADDRESS) {
            addressInput.value = '';
            state.deliveryAddress = '';
        }
    }
}

function renderAddressSuggestions() {
    const container = document.getElementById('addressSuggestions');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (state.deliveryType === 'pickup') {
        container.classList.add('hidden');
        return;
    }
    
    if (!state.addressSuggestions.length) {
        container.classList.remove('visible');
        return;
    }
    
    state.addressSuggestions.forEach(suggestion => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'address-suggestion';
        button.dataset.address = suggestion.display_name;
        button.textContent = suggestion.display_name;
        container.appendChild(button);
    });
    
    container.classList.add('visible');
}

async function searchAddress() {
    const addressInput = document.getElementById('deliveryAddress');
    const query = addressInput.value.trim();
    
    if (!query) {
        showNotification('Введите адрес для поиска.', 'error');
        return;
    }
    
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=ru&q=${encodeURIComponent(query)}`);
        const data = await response.json();
        state.addressSuggestions = data;
        if (!data.length) {
            showNotification('Адрес не найден. Попробуйте уточнить запрос.', 'info');
        }
        renderAddressSuggestions();
    } catch (error) {
        console.error('Ошибка поиска адреса:', error);
        showNotification('Не удалось найти адрес. Попробуйте позже.', 'error');
    }
}

function gatherOrderData() {
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const phoneValue = state.customerPhone || document.getElementById('customerPhone')?.value.trim() || '';
    const recipientValue = state.recipientName || document.getElementById('recipientName')?.value.trim() || '';
    const addressValue = state.deliveryAddress || document.getElementById('deliveryAddress')?.value.trim() || '';
    
    return {
        items: state.cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total,
        user: tg?.initDataUnsafe?.user || null,
        timestamp: new Date().toISOString(),
        cutlery: state.cutleryCount,
        paymentMethod: state.paymentMethod,
        phone: phoneValue,
        deliveryType: state.deliveryType,
        recipientName: recipientValue,
        address: addressValue
    };
}

function sendOrderData() {
    try {
        if (state.cart.length === 0) {
            showNotification('Корзина пуста. Добавьте товары в корзину.', 'error');
            return;
        }
        
        if (!validateCheckout()) {
            return;
        }
        
        const orderData = gatherOrderData();
        
        if (tg?.sendData) {
            tg.sendData(JSON.stringify(orderData));
        }
        
        showNotification(`Заказ отправлен! Сумма: ${orderData.total} ₽`, 'success');
        
        if (tg?.showPopup) {
            tg.showPopup({
                title: 'Заказ отправлен!',
                message: `Спасибо! Ваш заказ на ${orderData.total} ₽ принят.`,
                buttons: [{ type: 'ok' }]
            });
        }
        
        state.cart = [];
        state.cutleryCount = 0;
        state.customerPhone = '';
        state.recipientName = '';
        state.deliveryAddress = PICKUP_ADDRESS;
        state.deliveryType = 'pickup';
        state.addressSuggestions = [];
        document.getElementById('customerPhone').value = '';
        document.getElementById('recipientName').value = '';
        document.getElementById('deliveryAddress').value = PICKUP_ADDRESS;
        setDeliveryMode('pickup');
        renderAddressSuggestions();
        
        saveCartToStorage();
        updateCartUI();
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('checkoutSidebar').classList.remove('open');
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        showNotification('Произошла ошибка при оформлении заказа. Попробуйте еще раз.', 'error');
    }
}

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
    
    document.getElementById('closeCheckout').onclick = () => {
        document.getElementById('checkoutSidebar').classList.remove('open');
    };
    
    document.getElementById('orderBtn').onclick = () => {
        if (state.cart.length === 0) {
            showNotification('Корзина пуста. Добавьте товары в корзину.', 'error');
            return;
        }
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('checkoutSidebar').classList.add('open');
        updateCheckoutSummary();
    };
    
    document.getElementById('confirmOrderBtn').onclick = sendOrderData;
    
    document.getElementById('cutleryMinus').addEventListener('click', () => updateCutlery(-1));
    document.getElementById('cutleryPlus').addEventListener('click', () => updateCutlery(1));
    document.getElementById('requestPhoneBtn').addEventListener('click', requestPhoneNumber);
    document.getElementById('searchAddressBtn').addEventListener('click', searchAddress);
    document.getElementById('editCartBtn').addEventListener('click', () => {
        document.getElementById('checkoutSidebar').classList.remove('open');
        document.getElementById('cartSidebar').classList.add('open');
    });
    document.getElementById('paymentMethod').addEventListener('change', (e) => {
        state.paymentMethod = e.target.value;
    });
    document.querySelectorAll('input[name="deliveryType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            setDeliveryMode(e.target.value);
        });
    });
    const phoneInput = document.getElementById('customerPhone');
    phoneInput.addEventListener('input', (e) => {
        state.customerPhone = e.target.value;
        setFieldError(phoneInput, false);
    });
    const recipientInput = document.getElementById('recipientName');
    recipientInput.addEventListener('input', (e) => {
        state.recipientName = e.target.value;
        setFieldError(recipientInput, false);
    });
    const deliveryAddressInput = document.getElementById('deliveryAddress');
    deliveryAddressInput.addEventListener('input', (e) => {
        state.deliveryAddress = e.target.value;
        setFieldError(deliveryAddressInput, false);
        if (!e.target.value.trim()) {
            state.addressSuggestions = [];
            renderAddressSuggestions();
        }
    });
    document.getElementById('addressSuggestions').addEventListener('click', (e) => {
        const target = e.target.closest('.address-suggestion');
        if (!target) return;
        const value = target.dataset.address;
        document.getElementById('deliveryAddress').value = value;
        state.deliveryAddress = value;
        state.addressSuggestions = [];
        renderAddressSuggestions();
    });
    
    // Модальное окно блюда
    document.getElementById('closeItemModal').addEventListener('click', closeItemModal);
    document.getElementById('itemModal').addEventListener('click', (e) => {
        if (e.target.id === 'itemModal') {
            closeItemModal();
        }
    });
    document.getElementById('modalQtyMinus').addEventListener('click', () => updateModalQuantity(-1));
    document.getElementById('modalQtyPlus').addEventListener('click', () => updateModalQuantity(1));
    document.getElementById('modalAddBtn').addEventListener('click', addModalItemToCart);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('itemModal');
            if (modal.classList.contains('open')) {
                closeItemModal();
            }
        }
    });
}

function setFieldError(element, hasError) {
    if (!element) return;
    if (hasError) {
        element.classList.add('input-error');
    } else {
        element.classList.remove('input-error');
    }
}

function validateCheckout() {
    const errors = [];
    const nameInput = document.getElementById('recipientName');
    const phoneInput = document.getElementById('customerPhone');
    const addressInput = document.getElementById('deliveryAddress');
    
    setFieldError(nameInput, false);
    setFieldError(phoneInput, false);
    setFieldError(addressInput, false);
    
    const phoneValue = phoneInput.value.trim();
    const nameValue = nameInput.value.trim();
    const addressValue = addressInput.value.trim();
    
    if (!nameValue) {
        errors.push('Укажите имя получателя.');
        setFieldError(nameInput, true);
    } else {
        state.recipientName = nameValue;
    }
    
    if (!phoneValue || !/^\+?\d[\d\s\-()]{9,}$/.test(phoneValue)) {
        errors.push('Введите корректный номер телефона.');
        setFieldError(phoneInput, true);
    } else {
        state.customerPhone = phoneValue;
    }
    
    if (state.deliveryType === 'delivery') {
        if (!addressValue) {
            errors.push('Укажите адрес доставки.');
            setFieldError(addressInput, true);
        } else {
            state.deliveryAddress = addressValue;
        }
    } else {
        state.deliveryAddress = PICKUP_ADDRESS;
    }
    
    if (errors.length) {
        errors.forEach(err => showNotification(err, 'error'));
        return false;
    }
    
    return true;
}

// ЗАПУСК ПРИЛОЖЕНИЯ
document.addEventListener('DOMContentLoaded', initApp);