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
// Проверяем, что menuData загружен перед использованием
const defaultCategoryId = (typeof menuData !== 'undefined' && menuData?.categories?.[0]?.id) || null;
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
    // Проверяем, что menuData загружен
    if (typeof menuData === 'undefined' || !menuData || !menuData.categories || !menuData.items) {
        console.error('menuData не загружен. Убедитесь, что data.js подключен перед app.js');
        showNotification('Ошибка загрузки данных меню', 'error');
        return;
    }
    
    loadCartFromStorage(); // Загружаем корзину из localStorage
    if (!state.currentCategory) {
        state.currentCategory = defaultCategoryId;
    }
    if (state.deliveryType === 'pickup') {
        state.deliveryAddress = PICKUP_ADDRESS;
    }
    
    // Устанавливаем обработчики
    setupEventListeners();
    setupItemModalHandlers(); // Устанавливаем обработчики модального окна
    
    renderCategories();
    renderMenuItems();
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
        
        // Добавляем обработчик клика
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Клик по категории:', category.id, category.name);
            
            // Используем замыкание для сохранения category.id
            const categoryId = category.id;
            if (categoryId) {
                state.currentCategory = categoryId;
                renderCategories();
                renderMenuItems();
            } else {
                console.error('ID категории не найден:', category);
            }
        }, { capture: false });
        
        // Обработчик для touch событий (мобильные устройства)
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Touch по категории:', category.id, category.name);
            
            const categoryId = category.id;
            if (categoryId) {
                state.currentCategory = categoryId;
                renderCategories();
                renderMenuItems();
            }
        }, { passive: false, capture: false });
        
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
        ? menuData.items.filter(item => {
            const matches = item.category === state.currentCategory;
            if (!matches && state.currentCategory) {
                console.log('Не совпадает категория:', item.category, '!==', state.currentCategory);
            }
            return matches;
        })
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
        ? [menuData.categories.find(cat => {
            const matches = cat.id === state.currentCategory;
            if (!matches) {
                console.log('Категория не найдена:', cat.id, '!==', state.currentCategory);
            }
            return matches;
        })].filter(Boolean) // Убираем undefined
        : menuData.categories;
    
    if (state.currentCategory && categories.length === 0) {
        console.error('Категория не найдена:', state.currentCategory);
        console.log('Доступные категории:', menuData.categories.map(c => c.id));
    }
    
    categories.forEach(category => {
        if (!category) return;
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
    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
    }
    
    // Обновляем список товаров в корзине
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';
    
    state.cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        const itemImageSrc = resolveItemImage(item);
        cartItem.innerHTML = `
            <div class="cart-item-thumb">
                <img src="${itemImageSrc}" alt="${item.name}" onerror="this.src='./assets/images/categories/placeholder.jpg'">
            </div>
            <div class="cart-item-body">
                <div class="cart-item-row">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">${item.price} ₽</span>
                </div>
                <div class="cart-item-description">${item.description}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" data-item-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-item-id="${item.id}" data-action="increase">+</button>
                    <div class="cart-item-total">${item.price * item.quantity} ₽</div>
                </div>
            </div>
        `;
        
        // Добавляем обработчики событий для кнопок количества
        const decreaseBtn = cartItem.querySelector('[data-action="decrease"]');
        const increaseBtn = cartItem.querySelector('[data-action="increase"]');
        decreaseBtn.addEventListener('click', () => updateCartQuantity(item.id, -1));
        increaseBtn.addEventListener('click', () => updateCartQuantity(item.id, 1));
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Обновляем общую сумму
    const totalAmount = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalAmountEl = document.getElementById('totalAmount');
    const cutleryCountEl = document.getElementById('cutleryCount');
    if (totalAmountEl) totalAmountEl.textContent = totalAmount;
    if (cutleryCountEl) cutleryCountEl.textContent = state.cutleryCount;
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
    
    const summaryCutleryEl = document.getElementById('summaryCutlery');
    if (summaryCutleryEl) summaryCutleryEl.textContent = `${state.cutleryCount} шт.`;
    
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
    
    const summaryTotalEl = document.getElementById('summaryTotal');
    if (summaryTotalEl) summaryTotalEl.textContent = `${totalAmount} ₽`;
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
        // Убираем inert и aria-hidden перед открытием
        modal.removeAttribute('inert');
        modal.removeAttribute('aria-hidden');
        modal.classList.add('open');
        
        // Проверяем, что все элементы на месте
        const closeBtn = document.getElementById('closeItemModal');
        const minusBtn = document.getElementById('modalQtyMinus');
        const plusBtn = document.getElementById('modalQtyPlus');
        const addBtn = document.getElementById('modalAddBtn');
        
        console.log('Модальное окно открыто, modalItemId:', state.modalItemId);
        console.log('Элементы модального окна:', {
            closeBtn: !!closeBtn,
            minusBtn: !!minusBtn,
            plusBtn: !!plusBtn,
            addBtn: !!addBtn
        });
    } else {
        console.error('Модальное окно не найдено');
    }
}

function closeItemModal() {
    const modal = document.getElementById('itemModal');
    if (!modal) {
        state.modalItemId = null;
        state.modalQuantity = 1;
        return;
    }
    
    // Убираем фокус со всех элементов внутри модального окна
    const activeElement = document.activeElement;
    if (activeElement && modal.contains(activeElement)) {
        activeElement.blur();
    }
    
    // Убираем фокус со всех интерактивных элементов в модальном окне
    const allInputs = modal.querySelectorAll('input, textarea, button, select');
    allInputs.forEach(input => {
        if (input === document.activeElement) {
            input.blur();
        }
    });
    
    // Закрываем модальное окно визуально
    modal.classList.remove('open');
    
    // Используем inert атрибут вместо aria-hidden для предотвращения фокуса
    // inert автоматически управляет фокусом и доступностью
    requestAnimationFrame(() => {
        modal.setAttribute('inert', '');
        modal.setAttribute('aria-hidden', 'true');
    });
    
    state.modalItemId = null;
    state.modalQuantity = 1;
}

// Используем делегирование событий на уровне document для надежности
function setupItemModalHandlers() {
    // Удаляем старые обработчики, если они есть (через именованную функцию)
    document.removeEventListener('click', handleItemModalClick);
    
    // Добавляем новый обработчик
    document.addEventListener('click', handleItemModalClick);
    console.log('Обработчики модального окна установлены');
}

function handleItemModalClick(e) {
    const itemModal = document.getElementById('itemModal');
    if (!itemModal || !itemModal.classList.contains('open')) {
        return; // Модальное окно не открыто
    }
    
    console.log('Клик в модальном окне:', e.target, e.target.id);
    
    // Закрытие по клику на фон
    if (e.target === itemModal) {
        console.log('Закрытие модального окна по клику на фон');
        closeItemModal();
        return;
    }
    
    // Проверяем, кликнули ли мы на кнопку внутри модального окна
    const button = e.target.closest('button');
    if (!button) {
        console.log('Клик не на кнопку:', e.target);
        return;
    }
    
    if (!itemModal.contains(button)) {
        console.log('Кнопка не внутри модального окна');
        return;
    }
    
    console.log('Обработка клика на кнопку:', button.id);
    e.preventDefault();
    e.stopPropagation();
    
    // Кнопка закрытия
    if (button.id === 'closeItemModal') {
        console.log('Закрытие модального окна');
        closeItemModal();
        return;
    }
    
    // Кнопка уменьшения количества
    if (button.id === 'modalQtyMinus') {
        console.log('Уменьшение количества');
        updateModalQuantity(-1);
        return;
    }
    
    // Кнопка увеличения количества
    if (button.id === 'modalQtyPlus') {
        console.log('Увеличение количества');
        updateModalQuantity(1);
        return;
    }
    
    // Кнопка добавления в корзину
    if (button.id === 'modalAddBtn') {
        console.log('Добавление в корзину, modalItemId:', state.modalItemId);
        if (!state.modalItemId) {
            console.error('modalItemId не установлен при клике на кнопку добавления');
            showNotification('Ошибка: товар не выбран. Попробуйте закрыть и открыть карточку товара снова.', 'error');
            return;
        }
        addModalItemToCart();
        return;
    }
    
    console.log('Неизвестная кнопка:', button.id);
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
    const deliveryAddressInput = document.getElementById('deliveryAddress');
    const searchAddressBtn = document.getElementById('searchAddressBtn');
    
    if (!addressGroup || !pickupInfo) {
        return;
    }
    
    if (mode === 'pickup') {
        if (addressDetailsBtn) addressDetailsBtn.classList.add('hidden');
        if (deliveryAddressInput) deliveryAddressInput.classList.add('hidden');
        if (searchAddressBtn) searchAddressBtn.classList.add('hidden');
        pickupInfo.classList.remove('hidden');
        state.deliveryAddress = PICKUP_ADDRESS;
        state.addressSuggestions = [];
        renderAddressSuggestions();
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
        if (deliveryAddressInput) deliveryAddressInput.classList.remove('hidden');
        if (searchAddressBtn) searchAddressBtn.classList.remove('hidden');
        pickupInfo.classList.add('hidden');
        if (state.deliveryAddress === PICKUP_ADDRESS) {
            state.deliveryAddress = '';
            if (deliveryAddressInput) deliveryAddressInput.value = '';
        }
    }
}

function renderAddressSuggestions() {
    const container = document.getElementById('addressSuggestions');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (state.deliveryType === 'pickup') {
        container.classList.add('hidden');
        container.classList.remove('visible');
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
        button.addEventListener('click', () => {
            const addressInput = document.getElementById('deliveryAddress');
            if (addressInput) {
                addressInput.value = suggestion.display_name;
                state.deliveryAddress = suggestion.display_name;
            }
            state.addressSuggestions = [];
            renderAddressSuggestions();
            showNotification('Адрес выбран', 'success');
        });
        container.appendChild(button);
    });
    
    container.classList.add('visible');
}

async function searchAddress() {
    const addressInput = document.getElementById('deliveryAddress');
    if (!addressInput) {
        console.error('Поле адреса не найдено');
        return;
    }
    
    const query = addressInput.value.trim();
    
    if (!query) {
        showNotification('Введите адрес для поиска.', 'error');
        addressInput.focus();
        setFieldError(addressInput, true);
        return;
    }
    
    try {
        showNotification('Поиск адреса...', 'info');
        
        // Добавляем заголовки для соблюдения политики использования API Nominatim
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=ru&q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'TelegramWebApp/1.0',
                'Referer': window.location.origin
            }
        });
        
        if (!response.ok) {
            // Обработка различных HTTP ошибок
            if (response.status === 503) {
                throw new Error('Сервис поиска адресов временно недоступен. Пожалуйста, попробуйте позже или введите адрес вручную.');
            } else if (response.status === 429) {
                throw new Error('Слишком много запросов. Пожалуйста, подождите немного и попробуйте снова.');
            } else if (response.status >= 500) {
                throw new Error('Ошибка сервера. Пожалуйста, попробуйте позже или введите адрес вручную.');
            } else {
                throw new Error(`Ошибка при поиске адреса (код ${response.status}). Попробуйте ввести адрес вручную.`);
            }
        }
        
        const data = await response.json();
        state.addressSuggestions = data;
        if (!data.length) {
            showNotification('Адрес не найден. Попробуйте уточнить запрос или введите адрес вручную.', 'info');
        } else {
            showNotification(`Найдено ${data.length} вариантов`, 'success');
        }
        renderAddressSuggestions();
    } catch (error) {
        console.error('Ошибка поиска адреса:', error);
        
        // Показываем понятное сообщение об ошибке
        const errorMessage = error.message || 'Не удалось найти адрес. Проверьте подключение к интернету или введите адрес вручную.';
        showNotification(errorMessage, 'error');
        
        state.addressSuggestions = [];
        renderAddressSuggestions();
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
        
        // Показываем уведомление об успешной отправке заказа
        showNotification(`Заказ отправлен! Сумма: ${orderData.total} ₽`, 'success');
        
        // Метод showPopup не поддерживается в версии 6.0+ Telegram WebApp
        // Используем только showNotification для уведомлений
        
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
        const phoneInput = document.getElementById('customerPhone');
        const recipientInput = document.getElementById('recipientName');
        const deliveryAddressInput = document.getElementById('deliveryAddress');
        if (phoneInput) phoneInput.value = '';
        if (recipientInput) recipientInput.value = '';
        if (deliveryAddressInput) deliveryAddressInput.value = PICKUP_ADDRESS;
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
    // Обработчики категорий устанавливаются в renderCategories()
    // Здесь только общие обработчики
    
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
    
    // Обработчик поиска адреса
    const searchAddressBtn = document.getElementById('searchAddressBtn');
    if (searchAddressBtn) {
        searchAddressBtn.addEventListener('click', searchAddress);
    }
    
    // Обработчик ввода адреса
    const deliveryAddressInput = document.getElementById('deliveryAddress');
    if (deliveryAddressInput) {
        deliveryAddressInput.addEventListener('input', (e) => {
            state.deliveryAddress = e.target.value;
            setFieldError(deliveryAddressInput, false);
        });
    }
    
    const phoneInput = document.getElementById('customerPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            state.customerPhone = e.target.value;
            setFieldError(phoneInput, false);
        });
    }
    const recipientInput = document.getElementById('recipientName');
    if (recipientInput) {
        recipientInput.addEventListener('input', (e) => {
            state.recipientName = e.target.value;
            setFieldError(recipientInput, false);
        });
    }
    
    // Модальное окно блюда - используем прямые обработчики
    setupItemModalHandlers();
    
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
    
    // Убираем inert и aria-hidden перед открытием
    modal.removeAttribute('inert');
    modal.removeAttribute('aria-hidden');
    
    // Убеждаемся, что все поля доступны для ввода
    const allInputs = modal.querySelectorAll('input, textarea');
    allInputs.forEach(input => {
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
        input.removeAttribute('tabindex'); // Убираем tabindex=-1, если был установлен
        input.style.pointerEvents = 'auto';
        input.style.cursor = 'text';
        input.style.opacity = '1';
        if (input.tabIndex === -1) {
            input.tabIndex = 0;
        }
    });
    
    // Открываем модальное окно
    modal.classList.add('open');
    
    // Фокусируемся на первом поле после того, как модальное окно открыто
    // Используем requestAnimationFrame для гарантии, что DOM обновлен
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                if (streetInput) {
                    streetInput.focus();
                }
            }, 50);
        });
    });
}

function closeAddressDetailsModal() {
    const modal = document.getElementById('addressDetailsModal');
    if (!modal) return;
    
    // Убираем фокус со всех элементов внутри модального окна
    const activeElement = document.activeElement;
    if (activeElement && modal.contains(activeElement)) {
        activeElement.blur();
    }
    
    // Убираем фокус со всех интерактивных элементов в модальном окне
    const allInputs = modal.querySelectorAll('input, textarea, button, select');
    allInputs.forEach(input => {
        if (input === document.activeElement) {
            input.blur();
        }
    });
    
    // Закрываем модальное окно визуально
    modal.classList.remove('open');
    
    // Используем inert атрибут вместо aria-hidden для предотвращения фокуса
    // inert автоматически управляет фокусом и доступностью
    requestAnimationFrame(() => {
        modal.setAttribute('inert', '');
        modal.setAttribute('aria-hidden', 'true');
    });
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
    const deliveryAddressInput = document.getElementById('deliveryAddress');
    
    // Сбрасываем ошибки
    if (nameInput) setFieldError(nameInput, false);
    if (phoneInput) setFieldError(phoneInput, false);
    if (deliveryAddressInput) setFieldError(deliveryAddressInput, false);
    
    // Проверка корзины
    if (state.cart.length === 0) {
        errors.push('Корзина пуста. Добавьте товары в корзину.');
        showNotification('Корзина пуста. Добавьте товары в корзину.', 'error');
        return false;
    }
    
    const phoneValue = phoneInput ? phoneInput.value.trim() : '';
    const nameValue = nameInput ? nameInput.value.trim() : '';
    
    // Валидация имени
    if (!nameValue) {
        errors.push('Укажите имя получателя.');
        if (nameInput) {
            setFieldError(nameInput, true);
            nameInput.focus();
        }
    } else if (nameValue.length < 2) {
        errors.push('Имя должно содержать минимум 2 символа.');
        if (nameInput) {
            setFieldError(nameInput, true);
            nameInput.focus();
        }
    } else {
        state.recipientName = nameValue;
    }
    
    // Валидация телефона (более гибкая)
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (!phoneValue) {
        errors.push('Введите номер телефона.');
        if (phoneInput) {
            setFieldError(phoneInput, true);
            phoneInput.focus();
        }
    } else if (!phoneRegex.test(phoneValue.replace(/\s/g, ''))) {
        errors.push('Введите корректный номер телефона (например: +7 999 123-45-67).');
        if (phoneInput) {
            setFieldError(phoneInput, true);
            phoneInput.focus();
        }
    } else {
        state.customerPhone = phoneValue;
    }
    
    // Валидация адреса доставки
    if (state.deliveryType === 'delivery') {
        const addressValue = deliveryAddressInput ? deliveryAddressInput.value.trim() : state.deliveryAddress;
        if (!addressValue || addressValue === PICKUP_ADDRESS) {
            errors.push('Укажите адрес доставки.');
            if (deliveryAddressInput) {
                setFieldError(deliveryAddressInput, true);
                deliveryAddressInput.focus();
            }
        } else if (addressValue.length < 5) {
            errors.push('Адрес должен содержать минимум 5 символов.');
            if (deliveryAddressInput) {
                setFieldError(deliveryAddressInput, true);
                deliveryAddressInput.focus();
            }
        } else {
            state.deliveryAddress = addressValue;
        }
    } else {
        state.deliveryAddress = PICKUP_ADDRESS;
    }
    
    if (errors.length) {
        // Показываем только первую ошибку, чтобы не перегружать пользователя
        showNotification(errors[0], 'error');
        return false;
    }
    
    return true;
}

// ЗАПУСК ПРИЛОЖЕНИЯ
document.addEventListener('DOMContentLoaded', initApp);