// Telegram Web App инициализация
let tg = null;

// Проверка наличия Telegram WebApp API
if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.expand();
    if (tg.MainButton) {
        tg.MainButton.setParams({ text: 'test', is_visible: false });
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
const FREE_DELIVERY_THRESHOLD = 1600;
const DELIVERY_COST = 150;

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
    addressSuggestions: [],
    addressDetails: {
        street: '',
        addressName: '',
        apartment: '',
        floor: '',
        entrance: '',
        doorCode: '',
        comment: ''
    }
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
    if (!categoriesContainer) {
        console.error('Контейнер категорий не найден');
        return;
    }
    
    if (!menuData || !menuData.categories) {
        console.error('Данные категорий не загружены');
        return;
    }
    
    categoriesContainer.innerHTML = '';
    
    menuData.categories.forEach(category => {
        const button = document.createElement('button');
        button.className = `category-btn ${state.currentCategory === category.id ? 'active' : ''}`;
        button.textContent = category.name;
        button.type = 'button';
        // Убеждаемся, что данные правильно устанавливаются
        button.setAttribute('data-category-id', category.id);
        button.setAttribute('data-category-name', category.name);
        button.dataset.categoryId = category.id;
        button.dataset.categoryName = category.name;
        button.setAttribute('aria-label', `Выбрать категорию ${category.name}`);
        button.setAttribute('data-has-handler', 'true'); // Помечаем, что есть прямой обработчик
        
        // Предотвращаем выделение текста
        button.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Предотвращаем выделение текста
        });
        
        button.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });
        
        // Добавляем прямое событие для надежности
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Прямой клик по категории:', category.id, category.name);
            state.currentCategory = category.id;
            renderCategories();
            renderMenuItems();
        });
        
        categoriesContainer.appendChild(button);
    });
    
    console.log(`Отрисовано ${menuData.categories.length} категорий`);
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

// КОРЗИНА: ОЧИСТКА ВСЕЙ КОРЗИНЫ
function clearCart() {
    if (state.cart.length === 0) {
        showNotification('Корзина уже пуста', 'info');
        return;
    }
    
    const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    state.cart = [];
    state.cutleryCount = 0;
    saveCartToStorage();
    updateCartUI();
    showNotification(`Удалено ${itemCount} ${itemCount === 1 ? 'блюдо' : 'блюд'}`, 'success');
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

function calculateDeliveryCost() {
    if (state.deliveryType === 'pickup') {
        return 0;
    }
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_COST;
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
    
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCost = calculateDeliveryCost();
    const totalAmount = subtotal + deliveryCost;
    
    const deliveryInfo = document.getElementById('deliveryInfo');
    const deliveryCostSpan = document.getElementById('deliveryCost');
    
    if (state.deliveryType === 'delivery') {
        deliveryInfo.classList.remove('hidden');
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (deliveryCost === 0) {
            deliveryCostSpan.textContent = 'Бесплатно';
            deliveryCostSpan.style.color = '#9ef3d3';
        } else {
            deliveryCostSpan.textContent = `${deliveryCost} ₽`;
            deliveryCostSpan.style.color = '#f9fafb';
            const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
            if (remaining > 0) {
                const hint = deliveryInfo.querySelector('.delivery-hint');
                if (hint) {
                    hint.textContent = `Добавьте еще ${remaining} ₽ для бесплатной доставки`;
                } else {
                    const hintEl = document.createElement('div');
                    hintEl.className = 'delivery-hint';
                    hintEl.textContent = `Добавьте еще ${remaining} ₽ для бесплатной доставки`;
                    hintEl.style.cssText = 'font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 4px; font-weight: normal;';
                    deliveryInfo.appendChild(hintEl);
                }
            } else {
                const hint = deliveryInfo.querySelector('.delivery-hint');
                if (hint) hint.remove();
            }
        }
    } else {
        deliveryInfo.classList.add('hidden');
        const hint = deliveryInfo.querySelector('.delivery-hint');
        if (hint) hint.remove();
    }
    
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
    if (!itemId) {
        console.error('openItemModal вызвана без itemId');
        return;
    }
    
    const item = menuData.items.find(i => i.id === itemId);
    if (!item) {
        console.error('Товар не найден для itemId:', itemId);
        return;
    }
    
    // Устанавливаем modalItemId ПЕРЕД всеми остальными операциями
    state.modalItemId = itemId;
    console.log('Открытие модального окна для товара:', itemId, item.name);
    
    const existingQty = getCartItemQuantity(itemId);
    state.modalQuantity = existingQty > 0 ? existingQty : 1;
    
    const itemImageSrc = resolveItemImage(item);
    const modalImage = document.getElementById('modalItemImage');
    const modalName = document.getElementById('modalItemName');
    const modalDescription = document.getElementById('modalItemDescription');
    const modalWeight = document.getElementById('modalItemWeight');
    const modalPrice = document.getElementById('modalItemPrice');
    const modalQuantity = document.getElementById('modalQuantity');
    
    if (modalImage) {
        modalImage.src = itemImageSrc;
        modalImage.alt = item.name;
    }
    if (modalName) modalName.textContent = item.name;
    if (modalDescription) modalDescription.textContent = item.description;
    if (modalWeight) modalWeight.textContent = item.weight || item.volume || '';
    if (modalPrice) modalPrice.textContent = `${item.price} ₽`;
    if (modalQuantity) modalQuantity.textContent = state.modalQuantity;
    
    const modal = document.getElementById('itemModal');
    if (modal) {
        // Сохраняем itemId в data-атрибуте для дополнительной проверки
        modal.dataset.itemId = itemId;
        modal.removeAttribute('aria-hidden');
        modal.classList.add('open');
        console.log('Модальное окно открыто, modalItemId:', state.modalItemId, 'data-itemId:', modal.dataset.itemId);
    } else {
        console.error('Модальное окно не найдено');
    }
}

function closeItemModal() {
    const modal = document.getElementById('itemModal');
    if (modal) {
        // Убираем фокус с элементов перед закрытием
        const activeElement = document.activeElement;
        if (activeElement && modal.contains(activeElement)) {
            activeElement.blur();
        }
        
        modal.classList.remove('open');
        // Устанавливаем aria-hidden только после того, как фокус убран
        setTimeout(() => {
            modal.setAttribute('aria-hidden', 'true');
        }, 100);
    }
    state.modalItemId = null;
    state.modalQuantity = 1;
}

function updateModalQuantity(change) {
    const nextValue = state.modalQuantity + change;
    if (nextValue < 1) return;
    state.modalQuantity = nextValue;
    const quantityEl = document.getElementById('modalQuantity');
    if (quantityEl) {
        quantityEl.textContent = state.modalQuantity;
    }
    console.log('Количество обновлено:', state.modalQuantity);
}

function addModalItemToCart() {
    console.log('addModalItemToCart вызвана, modalItemId:', state.modalItemId, 'modalQuantity:', state.modalQuantity);
    
    // Пытаемся восстановить modalItemId из data-атрибута модального окна, если он потерян
    if (!state.modalItemId) {
        const modal = document.getElementById('itemModal');
        if (modal && modal.dataset.itemId) {
            const recoveredItemId = parseInt(modal.dataset.itemId) || modal.dataset.itemId;
            console.warn('modalItemId восстановлен из data-атрибута:', recoveredItemId);
            state.modalItemId = recoveredItemId;
        }
    }
    
    if (!state.modalItemId) {
        console.error('modalItemId не установлен. Текущее состояние:', {
            modalItemId: state.modalItemId,
            modalQuantity: state.modalQuantity,
            cart: state.cart,
            modalDataItemId: document.getElementById('itemModal')?.dataset.itemId
        });
        showNotification('Ошибка: товар не выбран. Попробуйте закрыть и открыть карточку товара снова.', 'error');
        return;
    }
    
    // Проверяем, что товар существует
    const item = menuData.items.find(i => i.id === state.modalItemId);
    if (!item) {
        console.error('Товар не найден для modalItemId:', state.modalItemId);
        showNotification('Ошибка: товар не найден', 'error');
        state.modalItemId = null;
        return;
    }
    
    console.log('Добавление в корзину:', state.modalItemId, item.name, 'количество:', state.modalQuantity);
    addItemToCart(state.modalItemId, state.modalQuantity);
    closeItemModal();
    showNotification('Товар добавлен в корзину', 'success');
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
    const addressDetailsBtn = document.getElementById('addressDetailsBtn');
    const addressGroup = document.getElementById('addressGroup');
    const pickupInfo = document.getElementById('pickupInfo');
    
    if (!addressGroup || !pickupInfo) {
        return;
    }
    
    if (mode === 'pickup') {
        if (addressDetailsBtn) addressDetailsBtn.classList.add('hidden');
        pickupInfo.classList.remove('hidden');
        state.deliveryAddress = PICKUP_ADDRESS;
        state.addressDetails = {
            street: '',
            addressName: '',
            apartment: '',
            floor: '',
            entrance: '',
            doorCode: '',
            comment: ''
        };
    } else {
        if (addressDetailsBtn) addressDetailsBtn.classList.remove('hidden');
        pickupInfo.classList.add('hidden');
        if (state.deliveryAddress === PICKUP_ADDRESS) {
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
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCost = calculateDeliveryCost();
    const total = subtotal + deliveryCost;
    const phoneValue = state.customerPhone || document.getElementById('customerPhone')?.value.trim() || '';
    const recipientValue = state.recipientName || document.getElementById('recipientName')?.value.trim() || '';
    const addressValue = state.deliveryAddress || '';
    
    return {
        items: state.cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        subtotal,
        deliveryCost,
        total,
        user: tg?.initDataUnsafe?.user || null,
        timestamp: new Date().toISOString(),
        cutlery: state.cutleryCount,
        paymentMethod: state.paymentMethod,
        phone: phoneValue,
        deliveryType: state.deliveryType,
        recipientName: recipientValue,
        address: addressValue,
        addressDetails: state.addressDetails
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
        state.addressDetails = {
            addressName: '',
            apartment: '',
            floor: '',
            entrance: '',
            doorCode: '',
            comment: ''
        };
        document.getElementById('customerPhone').value = '';
        document.getElementById('recipientName').value = '';
        document.getElementById('deliveryAddress').value = PICKUP_ADDRESS;
        setDeliveryMode('pickup');
        renderAddressSuggestions();
        
        saveCartToStorage();
        updateCartUI();
        updateCheckoutSummary();
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('checkoutSidebar').classList.remove('open');
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        showNotification('Произошла ошибка при оформлении заказа. Попробуйте еще раз.', 'error');
    }
}

function setupEventListeners() {
    // Делегирование событий для категорий - работает даже после перерисовки
    const categoriesContainer = document.getElementById('categories');
    if (categoriesContainer) {
        // Обработка mousedown для предотвращения выделения текста
        categoriesContainer.addEventListener('mousedown', (e) => {
            const button = e.target.closest('.category-btn');
            if (button) {
                e.preventDefault(); // Предотвращаем выделение текста
            }
        }, true);
        
        // Используем capture phase для более раннего перехвата
        // Но не обрабатываем, если событие уже обработано прямым обработчиком
        categoriesContainer.addEventListener('click', (e) => {
            // Проверяем, не обработано ли уже событие прямым обработчиком
            if (e.defaultPrevented) return;
            
            const button = e.target.closest('.category-btn');
            if (!button) return;
            
            // Проверяем, есть ли прямой обработчик на кнопке
            // Если есть, не обрабатываем через делегирование
            const hasDirectHandler = button.getAttribute('data-has-handler') === 'true';
            if (hasDirectHandler) {
                // Прямой обработчик уже обработает событие
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            // Пробуем получить categoryId разными способами
            const categoryId = button.dataset.categoryId || button.getAttribute('data-category-id');
            const categoryName = button.dataset.categoryName || button.getAttribute('data-category-name');
            
            if (categoryId) {
                console.log('Клик по категории (делегирование):', categoryId, categoryName);
                state.currentCategory = categoryId;
                renderCategories();
                renderMenuItems();
            } else {
                console.warn('Категория не найдена для кнопки:', button, 'dataset:', button.dataset, 'attributes:', {
                    'data-category-id': button.getAttribute('data-category-id'),
                    'data-category-name': button.getAttribute('data-category-name')
                });
            }
        }, true); // Capture phase
        
        // Также обрабатываем touch события для мобильных устройств
        categoriesContainer.addEventListener('touchend', (e) => {
            const button = e.target.closest('.category-btn');
            if (!button) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const categoryId = button.dataset.categoryId;
            const categoryName = button.dataset.categoryName;
            
            if (categoryId) {
                console.log('Touch по категории:', categoryId, categoryName);
                state.currentCategory = categoryId;
                renderCategories();
                renderMenuItems();
            }
        }, { passive: false });
        
        // Предотвращаем выделение текста при клике на категории
        categoriesContainer.addEventListener('mousedown', (e) => {
            const button = e.target.closest('.category-btn');
            if (button) {
                e.preventDefault(); // Предотвращаем выделение текста
            }
        }, true);
        
        // Дополнительная обработка selectstart для предотвращения выделения
        categoriesContainer.addEventListener('selectstart', (e) => {
            const button = e.target.closest('.category-btn');
            if (button) {
                e.preventDefault();
                return false;
            }
        }, true);
    }
    
    // Поиск по меню
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            renderMenuItems();
        });
    }
    
    // Открытие корзины
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.onclick = () => {
            document.getElementById('cartSidebar').classList.add('open');
        };
    }
    
    // Закрытие корзины
    document.getElementById('closeCart').onclick = () => {
        document.getElementById('cartSidebar').classList.remove('open');
    };
    
    // Очистка корзины
    document.getElementById('clearCartBtn').onclick = () => {
        clearCart();
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
            updateCheckoutSummary();
        });
    });
    
    // Модальное окно детального адреса
    const addressDetailsBtn = document.getElementById('addressDetailsBtn');
    if (addressDetailsBtn) {
        addressDetailsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (state.deliveryType === 'pickup') {
                showNotification('Детали адреса доступны только для доставки', 'info');
                return;
            }
            console.log('Открытие модального окна детального адреса');
            openAddressDetailsModal();
        });
    } else {
        console.warn('Кнопка "Детали адреса доставки" не найдена');
    }
    
    const closeAddressBtn = document.getElementById('closeAddressDetailsModal');
    if (closeAddressBtn) {
        closeAddressBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeAddressDetailsModal();
        });
    }
    
    // Обработчик закрытия по клику на фон - используем делегирование
    const addressModal = document.getElementById('addressDetailsModal');
    if (addressModal) {
        addressModal.addEventListener('click', (e) => {
            // Закрываем только если клик был именно на фон модального окна
            if (e.target === addressModal || e.target.id === 'addressDetailsModal') {
                e.preventDefault();
                e.stopPropagation();
                closeAddressDetailsModal();
            }
        });
    }
    
    document.getElementById('saveAddressDetailsBtn').addEventListener('click', saveAddressDetails);
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
    
    // Модальное окно блюда - используем делегирование событий
    const itemModal = document.getElementById('itemModal');
    
    if (itemModal) {
        // Закрытие по клику на фон
        itemModal.addEventListener('click', (e) => {
            if (e.target === itemModal || e.target.id === 'itemModal') {
                closeItemModal();
            }
        });
        
        // Делегирование событий для всех кнопок внутри модального окна
        // Используем capture phase для более раннего перехвата
        itemModal.addEventListener('click', (e) => {
            const target = e.target;
            const button = target.closest('button');
            
            if (!button) return;
            
            // Кнопка закрытия
            if (button.id === 'closeItemModal') {
                e.preventDefault();
                e.stopPropagation();
                closeItemModal();
                return;
            }
            
            // Кнопка уменьшения количества
            if (button.id === 'modalQtyMinus') {
                e.preventDefault();
                e.stopPropagation();
                updateModalQuantity(-1);
                return;
            }
            
            // Кнопка увеличения количества
            if (button.id === 'modalQtyPlus') {
                e.preventDefault();
                e.stopPropagation();
                updateModalQuantity(1);
                return;
            }
            
            // Кнопка добавления в корзину
            if (button.id === 'modalAddBtn') {
                e.preventDefault();
                e.stopPropagation();
                // Проверяем modalItemId перед вызовом
                if (!state.modalItemId) {
                    console.error('modalItemId не установлен при клике на кнопку добавления');
                    showNotification('Ошибка: товар не выбран. Попробуйте закрыть и открыть карточку товара снова.', 'error');
                    return;
                }
                addModalItemToCart();
                return;
            }
        }, true); // Capture phase
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('itemModal');
            if (modal.classList.contains('open')) {
                closeItemModal();
            }
        }
    });
}

function openAddressDetailsModal() {
    const modal = document.getElementById('addressDetailsModal');
    if (!modal) {
        console.error('Модальное окно адреса не найдено');
        return;
    }
    
    const streetInput = document.getElementById('addressStreet');
    const addressNameInput = document.getElementById('addressName');
    const apartmentInput = document.getElementById('addressApartment');
    const floorInput = document.getElementById('addressFloor');
    const entranceInput = document.getElementById('addressEntrance');
    const doorCodeInput = document.getElementById('addressDoorCode');
    const commentInput = document.getElementById('addressComment');
    
    if (streetInput) streetInput.value = state.addressDetails.street || state.deliveryAddress || '';
    if (addressNameInput) addressNameInput.value = state.addressDetails.addressName || '';
    if (apartmentInput) apartmentInput.value = state.addressDetails.apartment || '';
    if (floorInput) floorInput.value = state.addressDetails.floor || '';
    if (entranceInput) entranceInput.value = state.addressDetails.entrance || '';
    if (doorCodeInput) doorCodeInput.value = state.addressDetails.doorCode || '';
    if (commentInput) commentInput.value = state.addressDetails.comment || '';
    
    // Убираем aria-hidden перед открытием, чтобы избежать конфликтов с фокусом
    modal.removeAttribute('aria-hidden');
    modal.classList.add('open');
    
    // Убеждаемся, что все поля доступны для ввода
    const allInputs = modal.querySelectorAll('input, textarea');
    allInputs.forEach(input => {
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
        input.style.pointerEvents = 'auto';
        input.style.cursor = 'text';
        input.style.opacity = '1';
        input.tabIndex = 0;
    });
    
    // Фокусируемся на первом поле после небольшой задержки
    setTimeout(() => {
        if (streetInput) {
            streetInput.focus();
            streetInput.click(); // Дополнительный клик для активации
        }
    }, 150);
}

function closeAddressDetailsModal() {
    const modal = document.getElementById('addressDetailsModal');
    if (modal) {
        // Убираем фокус с элементов перед закрытием
        const activeElement = document.activeElement;
        if (activeElement && modal.contains(activeElement)) {
            activeElement.blur();
        }
        
        modal.classList.remove('open');
        // Устанавливаем aria-hidden только после того, как фокус убран
        setTimeout(() => {
            modal.setAttribute('aria-hidden', 'true');
        }, 100);
    }
}

function saveAddressDetails() {
    const streetInput = document.getElementById('addressStreet');
    const addressNameInput = document.getElementById('addressName');
    const apartmentInput = document.getElementById('addressApartment');
    const floorInput = document.getElementById('addressFloor');
    const entranceInput = document.getElementById('addressEntrance');
    const doorCodeInput = document.getElementById('addressDoorCode');
    const commentInput = document.getElementById('addressComment');
    
    const streetValue = streetInput ? streetInput.value.trim() : '';
    
    if (!streetValue) {
        showNotification('Пожалуйста, укажите адрес', 'error');
        if (streetInput) {
            streetInput.focus();
            setFieldError(streetInput, true);
        }
        return;
    }
    
    state.deliveryAddress = streetValue;
    state.addressDetails = {
        street: streetValue,
        addressName: addressNameInput ? addressNameInput.value.trim() : '',
        apartment: apartmentInput ? apartmentInput.value.trim() : '',
        floor: floorInput ? floorInput.value.trim() : '',
        entrance: entranceInput ? entranceInput.value.trim() : '',
        doorCode: doorCodeInput ? doorCodeInput.value.trim() : '',
        comment: commentInput ? commentInput.value.trim() : ''
    };
    
    if (streetInput) setFieldError(streetInput, false);
    closeAddressDetailsModal();
    showNotification('Адрес сохранен', 'success');
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
    if (nameInput) setFieldError(nameInput, false);
    if (phoneInput) setFieldError(phoneInput, false);
    
    const phoneValue = phoneInput ? phoneInput.value.trim() : '';
    const nameValue = nameInput ? nameInput.value.trim() : '';
    
    if (!nameValue) {
        errors.push('Укажите имя получателя.');
        if (nameInput) setFieldError(nameInput, true);
    } else {
        state.recipientName = nameValue;
    }
    
    if (!phoneValue || !/^\+?\d[\d\s\-()]{9,}$/.test(phoneValue)) {
        errors.push('Введите корректный номер телефона.');
        if (phoneInput) setFieldError(phoneInput, true);
    } else {
        state.customerPhone = phoneValue;
    }
    
    if (state.deliveryType === 'delivery') {
        if (!state.deliveryAddress || !state.deliveryAddress.trim()) {
            errors.push('Укажите адрес доставки. Нажмите "Детали адреса доставки" для заполнения.');
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