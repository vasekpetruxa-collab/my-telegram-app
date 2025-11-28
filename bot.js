// Telegram Bot для обработки заказов из Web App
console.log('🚀 Начало загрузки бота...');
const { Telegraf } = require('telegraf');
console.log('✅ Telegraf загружен');
require('dotenv').config();
console.log('✅ .env загружен');

// Инициализация бота
console.log('🔧 Инициализация бота...');
const bot = new Telegraf(process.env.BOT_TOKEN);
console.log('✅ Бот инициализирован');

// Проверка подключения к Telegram API перед запуском
console.log('🔍 Проверка подключения к Telegram API...');
bot.telegram.getMe()
    .then(me => {
        console.log('✅ Подключение к Telegram API успешно!');
        console.log('   Имя бота:', me.first_name);
        console.log('   Username:', me.username);
    })
    .catch(err => {
        console.error('❌ Ошибка подключения к Telegram API:', err.message);
        console.error('   Проверьте токен бота и интернет-соединение');
    });

// Хранилище заказов (в реальном проекте используйте базу данных)
const orders = [];
// Хранилище message_id для обновления сообщений
// Структура: orderId -> { customerMessageId, customerChatId, adminMessages: [{ messageId, adminId }] }
const orderMessages = new Map();

// ============================================
// КЛАВИАТУРА БОТА
// ============================================

// Создание постоянной клавиатуры (Reply Keyboard)
function getMainKeyboard() {
    return {
        keyboard: [
            [
                { text: '🍕 Меню' },
                { text: '📋 Мои заказы' }
            ],
            [
                { text: '📊 Статус заказа' },
                { text: 'ℹ️ Помощь' }
            ]
        ],
        resize_keyboard: true, // Автоматически подстраивать размер кнопок
        one_time_keyboard: false // Клавиатура остается видимой
    };
}

// ============================================
// ОСНОВНЫЕ КОМАНДЫ БОТА
// ============================================

// Команда /start - приветствие и показ панели бота
// Также обрабатываем команду /жми как алиас для /start
const startCommandHandler = async (ctx) => {
    try {
        const commandName = ctx.message?.text?.startsWith('/жми') ? '/жми' : '/start';
        console.log(`\n📋 === ОБРАБОТКА КОМАНДЫ ${commandName} ===`);
        console.log(`✅ Команда ${commandName} получена от пользователя:`, ctx.from.id, ctx.from.username || 'без username');
        console.log('Start payload:', ctx.startPayload || 'нет параметра');
        console.log('WEB_APP_URL из .env:', process.env.WEB_APP_URL);
        
        const webAppUrl = process.env.WEB_APP_URL || 'https://your-domain.com';
        console.log('Используемый URL для Web App:', webAppUrl);
        
        const welcomeMessage = `
🍕 Добро пожаловать в гастропаб БУНКЕР!

Я помогу вам сделать заказ. Используйте кнопки ниже для навигации:

• 🍕 Меню - открыть меню и оформить заказ
• 📋 Мои заказы - посмотреть ваши заказы
• 📊 Статус заказа - узнать статус последнего заказа
• ℹ️ Помощь - справка по боту

Используйте кнопку "🍕 Меню" ниже для оформления заказа.
    `;
    
        console.log('📤 Отправка приветственного сообщения с клавиатурой...');
        await ctx.reply(welcomeMessage, {
            reply_markup: getMainKeyboard()
        });
        console.log(`✅ Ответ на ${commandName} отправлен успешно`);
        console.log(`📋 === КОМАНДА ${commandName} ОБРАБОТАНА ===\n`);
    } catch (error) {
        console.error('❌ ОШИБКА при обработке команды /start:', error);
        console.error('Детали ошибки:', error.message);
        console.error('Stack trace:', error.stack);
        try {
            await ctx.reply('❌ Произошла ошибка. Попробуйте еще раз.');
        } catch (replyError) {
            console.error('❌ Ошибка при отправке сообщения об ошибке:', replyError);
        }
    }
};

// Регистрируем обработчик для команды /start
bot.start(startCommandHandler);

// Регистрируем команду /жми как алиас для /start
bot.command('жми', startCommandHandler);

// Команда /menu - открыть Web App с меню ресторана
bot.command('menu', async (ctx) => {
    try {
        console.log('\n📋 === ОБРАБОТКА КОМАНДЫ /menu ===');
        console.log('✅ Команда /menu получена от пользователя:', ctx.from.id);
        console.log('WEB_APP_URL из .env:', process.env.WEB_APP_URL);
        
        const webAppUrl = process.env.WEB_APP_URL || 'https://your-domain.com';
        console.log('Используемый URL для Web App:', webAppUrl);
        
        console.log('📤 Отправка сообщения с кнопкой Web App...');
        await ctx.reply('🍕 Откройте меню для оформления заказа:', {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: '🍕 Открыть меню',
                        web_app: { url: webAppUrl }
                    }
                ]]
            }
        });
        console.log('✅ Ответ на /menu отправлен успешно');
        console.log('📋 === КОМАНДА /menu ОБРАБОТАНА ===\n');
    } catch (error) {
        console.error('❌ ОШИБКА при обработке команды /menu:', error);
        console.error('Детали ошибки:', error.message);
        console.error('Stack trace:', error.stack);
        try {
            await ctx.reply('❌ Произошла ошибка при открытии меню. Попробуйте еще раз.');
        } catch (replyError) {
            console.error('❌ Ошибка при отправке сообщения об ошибке:', replyError);
        }
    }
});

// Команда /help - помощь
bot.command('help', async (ctx) => {
    console.log('✅ Команда /help получена от пользователя:', ctx.from.id);
    const helpText = `
📖 Доступные команды:

/start - Начать работу с ботом
/menu - Открыть меню
/help - Показать эту справку
/orders - Посмотреть мои заказы (только для вас)
/stats - Статистика заказов (только для администратора)
/allorders - Все заказы (только для администратора)

💡 Для оформления заказа используйте кнопку "Открыть меню"
    `;
    await ctx.reply(helpText);
    console.log('✅ Ответ на /help отправлен');
});

// Команда /orders - показать заказы пользователя
bot.command('orders', async (ctx) => {
    console.log('✅ Команда /orders получена от пользователя:', ctx.from.id);
    const userId = ctx.from.id;
    const userOrders = orders.filter(order => order.user?.id === userId);
    
    console.log('Всего заказов в системе:', orders.length);
    console.log('Заказов пользователя:', userOrders.length);
    
    if (userOrders.length === 0) {
        await ctx.reply('У вас пока нет заказов. Сделайте первый заказ через меню! 🍕');
        console.log('✅ Ответ на /orders отправлен (нет заказов)');
        return;
    }
    
    let message = `📋 Ваши заказы (${userOrders.length}):\n\n`;
    
    userOrders.slice(-5).reverse().forEach((order, index) => {
        const date = new Date(order.timestamp || order.createdAt).toLocaleString('ru-RU');
        message += `${index + 1}. Заказ от ${date}\n`;
        message += `   Сумма: ${order.total} ₽\n`;
        message += `   Тип: ${order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}\n`;
        message += `   Статус: ${order.status || 'Принят'}\n\n`;
    });
    
    await ctx.reply(message, {
        reply_markup: getMainKeyboard()
    });
    console.log('✅ Ответ на /orders отправлен (есть заказы)');
});

// Команда /status - показать статус последнего заказа
bot.command('status', async (ctx) => {
    console.log('✅ Команда /status получена от пользователя:', ctx.from.id);
    const userId = ctx.from.id;
    const userOrders = orders.filter(order => order.user?.id === userId);
    
    if (userOrders.length === 0) {
        await ctx.reply('У вас пока нет заказов. Сделайте первый заказ через меню! 🍕', {
            reply_markup: getMainKeyboard()
        });
        console.log('✅ Ответ на /status отправлен (нет заказов)');
        return;
    }
    
    // Берем последний заказ
    const lastOrder = userOrders[userOrders.length - 1];
    const date = new Date(lastOrder.createdAt || lastOrder.timestamp).toLocaleString('ru-RU');
    
    const statusMessage = `
📊 <b>Статус вашего заказа</b>

📋 Номер заказа: <code>${lastOrder.orderId}</code>
📅 Дата: ${date}
💰 Сумма: ${lastOrder.total} ₽
🚚 Тип: ${lastOrder.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}
📊 Статус: ${lastOrder.status === 'new' ? '🆕 Новый' : lastOrder.status === 'processing' ? '⏳ В обработке' : lastOrder.status === 'ready' ? '✅ Готов' : lastOrder.status === 'delivered' ? '🚚 Доставлен' : '❓ Неизвестно'}
    `;
    
    await ctx.reply(statusMessage, {
        parse_mode: 'HTML',
        reply_markup: getMainKeyboard()
    });
    console.log('✅ Ответ на /status отправлен');
});

// Команда /stats - статистика (только для администратора)
bot.command('stats', async (ctx) => {
    console.log('✅ Команда /stats получена от пользователя:', ctx.from.id);
    const adminIds = (process.env.ADMIN_IDS || '').split(',').map(id => parseInt(id.trim()));
    
    console.log('ADMIN_IDS из .env:', adminIds);
    console.log('ID пользователя:', ctx.from.id);
    console.log('Является администратором:', adminIds.includes(ctx.from.id));
    
    if (!adminIds.includes(ctx.from.id)) {
        await ctx.reply('❌ У вас нет доступа к этой команде.');
        console.log('❌ Доступ запрещен для пользователя:', ctx.from.id);
        return;
    }
    
    const totalOrders = orders.length;
    console.log('📊 Проверка массива orders:');
    console.log('   Длина массива:', totalOrders);
    console.log('   Содержимое массива:', JSON.stringify(orders, null, 2));
    
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
    const pickupOrders = orders.filter(o => o.deliveryType === 'pickup').length;
    const deliveryOrders = orders.filter(o => o.deliveryType === 'delivery').length;
    
    const statsMessage = `
📊 Статистика заказов:

Всего заказов: ${totalOrders}
Общая выручка: ${totalRevenue} ₽
Самовывоз: ${pickupOrders}
Доставка: ${deliveryOrders}
    `;
    
    await ctx.reply(statsMessage);
    console.log('✅ Ответ на /stats отправлен');
    
    // Выводим в консоль для диагностики
    console.log('\n📊 Статистика запрошена администратором:');
    console.log('Всего заказов:', totalOrders);
    console.log('Все заказы:', orders.map(o => ({ id: o.orderId, total: o.total, time: o.createdAt })));
});

// Команда /testorder - тестовая отправка заказа (для диагностики)
bot.command('testorder', async (ctx) => {
    try {
        console.log('\n🧪 === НАЧАЛО ОБРАБОТКИ /testorder ===');
        console.log('✅ Команда /testorder получена от пользователя:', ctx.from.id);
        
        // Создаем тестовый заказ
        console.log('📝 Создание тестового заказа...');
        const testOrder = {
            items: [{ id: 1, name: 'Тестовая пицца', quantity: 1, price: 500 }],
            subtotal: 500,
            deliveryCost: 0,
            total: 500,
            user: ctx.from,
            timestamp: new Date().toISOString(),
            cutlery: 0,
            paymentMethod: 'cod',
            phone: '+79999999999',
            deliveryType: 'pickup',
            recipientName: 'Тестовый пользователь',
            address: 'Тестовый адрес',
            addressDetails: {}
        };
        console.log('✅ Тестовый заказ создан:', testOrder);
        
        // Добавляем статус и ID заказа
        console.log('🆔 Генерация ID заказа...');
        const order = {
            ...testOrder,
            orderId: `TEST-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            status: 'new',
            createdAt: new Date().toISOString()
        };
        console.log('✅ ID заказа сгенерирован:', order.orderId);
        
        // Сохраняем заказ
        console.log('💾 Сохранение заказа в массив orders...');
        console.log('   Текущее количество заказов ДО:', orders.length);
        orders.push(order);
        console.log('💾 Тестовый заказ сохранен в массив orders');
        console.log('📊 Всего заказов в системе ПОСЛЕ:', orders.length);
        console.log('📋 Проверка сохранения:', orders.length > 0 ? '✅ Заказ сохранен' : '❌ Заказ НЕ сохранен');
        
        // Формируем сообщение
        console.log('📝 Формирование сообщения о заказе...');
        const orderMessage = formatOrderMessage(order);
        console.log('✅ Сообщение сформировано');
        
        // Отправляем подтверждение
        console.log('📤 Отправка подтверждения пользователю...');
        await ctx.reply(orderMessage, {
            parse_mode: 'HTML',
            reply_markup: getMainKeyboard()
        });
        console.log('✅ Подтверждение отправлено пользователю');
        
        // Уведомляем администраторов
        console.log('📤 Отправка уведомлений администраторам...');
        await notifyAdmins(ctx, order);
        console.log('✅ Уведомления администраторам отправлены');
        
        await ctx.reply('✅ Тестовый заказ создан и обработан! Проверьте команду /stats', {
            reply_markup: getMainKeyboard()
        });
        console.log('✅ Тестовый заказ обработан');
        console.log('🧪 === ЗАВЕРШЕНИЕ ОБРАБОТКИ /testorder ===\n');
    } catch (error) {
        console.error('❌ ОШИБКА при обработке /testorder:', error);
        console.error('Детали ошибки:', error.message);
        console.error('Stack trace:', error.stack);
        try {
            await ctx.reply('❌ Произошла ошибка при создании тестового заказа: ' + error.message);
        } catch (replyError) {
            console.error('❌ Ошибка при отправке сообщения об ошибке:', replyError);
        }
    }
});

// Команда /test - простая проверка работы бота
bot.command('test', async (ctx) => {
    console.log('\n🧪 === ОБРАБОТКА КОМАНДЫ /test ===');
    console.log('✅ Команда /test получена от пользователя:', ctx.from.id);
    console.log('   Имя:', ctx.from.first_name);
    console.log('   Username:', ctx.from.username);
    try {
        await ctx.reply('✅ Бот работает! Команда /test получена и обработана.');
        console.log('✅ Ответ на /test отправлен');
        console.log('🧪 === КОМАНДА /test ОБРАБОТАНА ===\n');
    } catch (error) {
        console.error('❌ ОШИБКА при обработке /test:', error);
        console.error('Детали ошибки:', error.message);
        console.error('Stack trace:', error.stack);
    }
});

// Команда /allorders - показать все заказы (только для администратора)
bot.command('allorders', async (ctx) => {
    console.log('✅ Команда /allorders получена от пользователя:', ctx.from.id);
    const adminIds = (process.env.ADMIN_IDS || '').split(',').map(id => parseInt(id.trim()));
    
    console.log('ADMIN_IDS из .env:', adminIds);
    console.log('ID пользователя:', ctx.from.id);
    console.log('Является администратором:', adminIds.includes(ctx.from.id));
    
    if (!adminIds.includes(ctx.from.id)) {
        await ctx.reply('❌ У вас нет доступа к этой команде.');
        console.log('❌ Доступ запрещен для пользователя:', ctx.from.id);
        return;
    }
    
    if (orders.length === 0) {
        await ctx.reply('📋 Заказов пока нет.');
        console.log('✅ Ответ на /allorders отправлен (нет заказов)');
        return;
    }
    
    let message = `📋 Все заказы (${orders.length}):\n\n`;
    
    orders.slice(-10).reverse().forEach((order, index) => {
        const date = new Date(order.createdAt || order.timestamp).toLocaleString('ru-RU');
        message += `${index + 1}. Заказ ${order.orderId || 'N/A'}\n`;
        message += `   Время: ${date}\n`;
        message += `   Клиент: ${order.recipientName || 'N/A'}\n`;
        message += `   Телефон: ${order.phone || 'N/A'}\n`;
        message += `   Сумма: ${order.total} ₽\n`;
        message += `   Тип: ${order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}\n\n`;
    });
    
    await ctx.reply(message);
    console.log('✅ Ответ на /allorders отправлен (есть заказы)');
});

// ============================================
// ОБРАБОТКА ДАННЫХ ИЗ WEB APP
// ============================================

// Обработка данных, отправленных из Web App
// Обрабатываем ВСЕ типы обновлений для диагностики

// Обработчик для ВСЕХ обновлений (для диагностики)
// ВАЖНО: Этот middleware должен быть ПОСЛЕ регистрации команд, чтобы не мешать их обработке
bot.use(async (ctx, next) => {
    try {
        console.log('\n🔔 ПОЛУЧЕНО ОБНОВЛЕНИЕ');
        console.log('Тип обновления:', ctx.updateType);
        console.log('Время:', new Date().toISOString());
        console.log('Update ID:', ctx.update.update_id);
        
        // Если это команда, сразу передаем управление дальше (команды обрабатываются отдельно)
        if (ctx.updateType === 'message' && ctx.message?.text?.startsWith('/')) {
            console.log('📝 Это команда, передаю управление обработчику команд...');
            await next();
            console.log('✅ Команда обработана');
            return;
        }
        
        // Логируем ПОЛНУЮ структуру обновления для диагностики (только для не-команд и не-кнопок)
        if (ctx.updateType === 'message' && 
            !['🍕 Меню', '📋 Мои заказы', '📊 Статус заказа', 'ℹ️ Помощь'].includes(ctx.message?.text)) {
            const updateStr = JSON.stringify(ctx.update, null, 2);
            console.log('📋 Полная структура обновления:');
            console.log(updateStr);
        }
        
        if (ctx.updateType === 'message') {
            console.log('📨 Это сообщение');
            console.log('Текст:', ctx.message?.text || 'нет текста');
            console.log('isCommand:', ctx.message?.text?.startsWith('/') || false);
            console.log('hasWebApp:', !!ctx.message?.web_app);
            console.log('hasWebAppData:', !!ctx.message?.web_app_data);
            
            // Детальная проверка web_app_data
            if (ctx.message?.web_app_data) {
                console.log('🎯🎯🎯 web_app_data ОБНАРУЖЕН В MIDDLEWARE!');
                console.log('web_app_data структура:', JSON.stringify(ctx.message.web_app_data, null, 2));
                console.log('web_app_data.data:', ctx.message.web_app_data.data);
                console.log('web_app_data.data тип:', typeof ctx.message.web_app_data.data);
                console.log('web_app_data.data длина:', ctx.message.web_app_data.data?.length);
                console.log('⚠️ ВАЖНО: Это обновление должно быть обработано обработчиком bot.on(message:web_app_data)');
            } else {
                console.log('❌ web_app_data НЕ найден в сообщении');
                console.log('Все ключи message:', Object.keys(ctx.message || {}));
                
                // Проверяем все возможные варианты
                if (ctx.message?.web_app) {
                    console.log('⚠️ Найден web_app, но не web_app_data');
                    console.log('web_app:', JSON.stringify(ctx.message.web_app, null, 2));
                }
            }
        }
        
        // ВАЖНО: Передаем управление дальше, чтобы обработчики могли обработать обновление
        console.log('⏭️ Переход к следующему обработчику...');
        await next();
        console.log('✅ Middleware завершен, обработчики должны были обработать обновление');
    } catch (error) {
        console.error('❌ ОШИБКА в middleware обработчике:', error);
        console.error('Детали ошибки:', error.message);
        console.error('Stack trace:', error.stack);
        throw error; // Пробрасываем ошибку дальше
    }
});

// Специальный обработчик ТОЛЬКО для web_app_data (высший приоритет)
// ВАЖНО: Заказы обрабатываются ТОЛЬКО через web_app_data (кнопка "Открыть меню")
// tg.sendData() отправляет данные через этот механизм
bot.on('message:web_app_data', async (ctx) => {
    console.log('\n🎯🎯🎯 СПЕЦИАЛЬНЫЙ ОБРАБОТЧИК ДЛЯ WEB_APP_DATA ВЫЗВАН!');
    console.log('⏰ Время:', new Date().toISOString());
    console.log('👤 Пользователь:', ctx.from.id, ctx.from.username || 'без username');
    console.log('📦 web_app_data объект:', JSON.stringify(ctx.message.web_app_data, null, 2));
    console.log('📦 web_app_data.data:', ctx.message.web_app_data.data);
    console.log('📦 web_app_data.data тип:', typeof ctx.message.web_app_data.data);
    console.log('📦 web_app_data.data длина:', ctx.message.web_app_data.data?.length);
    
    try {
        // Парсим данные заказа
        const orderData = JSON.parse(ctx.message.web_app_data.data);
        console.log('✅ Данные успешно распарсены из JSON');
        console.log('📋 Структура заказа:');
        console.log('   items:', orderData.items?.length || 0, 'позиций');
        console.log('   total:', orderData.total);
        console.log('   recipientName:', orderData.recipientName);
        console.log('   phone:', orderData.phone);
        console.log('   deliveryType:', orderData.deliveryType);
        
        // Добавляем статус и ID заказа
        // ВАЖНО: Используем orderId из данных, если он есть (для совместимости)
        const order = {
            ...orderData,
            orderId: orderData.orderId || `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            status: orderData.status || 'new',
            createdAt: orderData.createdAt || new Date().toISOString(),
            user: ctx.from // Сохраняем информацию о пользователе (перезаписываем, если было в orderData)
        };
        
        console.log('🔍 Проверка данных заказа после обработки:');
        console.log('   orderId:', order.orderId);
        console.log('   status:', order.status);
        console.log('   user.id:', order.user?.id);
        console.log('   user.username:', order.user?.username);
        
        // Сохраняем заказ
        orders.push(order);
        console.log('💾 Заказ сохранен в массив orders');
        console.log('📊 Всего заказов в системе:', orders.length);
        console.log('📋 Последний заказ:', {
            orderId: order.orderId,
            total: order.total,
            recipientName: order.recipientName,
            phone: order.phone,
            userId: order.user?.id
        });
        
        // Формируем сообщение для пользователя
        const orderMessage = formatOrderMessage(order, true);
        
        // Отправляем подтверждение пользователю
        console.log('📤 Отправка подтверждения пользователю...');
        const customerMsg = await ctx.reply(orderMessage, {
            parse_mode: 'HTML',
            reply_markup: getMainKeyboard()
        });
        console.log('✅ Подтверждение отправлено пользователю');
        console.log('   Message ID:', customerMsg.message_id);
        console.log('   Chat ID:', customerMsg.chat.id);
        
        // Сохраняем message_id для заказчика
        orderMessages.set(order.orderId, {
            customerMessageId: customerMsg.message_id,
            customerChatId: ctx.from.id
        });
        console.log('💾 message_id сохранен для заказчика');
        
        // Уведомляем администраторов
        console.log('📤 Отправка уведомлений администраторам...');
        await notifyAdmins(ctx, order);
        console.log('✅ Уведомления администраторам отправлены');
        console.log('🎯🎯🎯 ОБРАБОТКА WEB_APP_DATA ЗАВЕРШЕНА УСПЕШНО!');
        
    } catch (error) {
        console.error('❌ ОШИБКА обработки данных из Web App:');
        console.error('   Тип ошибки:', error.name);
        console.error('   Сообщение:', error.message);
        console.error('   Stack trace:', error.stack);
        console.error('   Данные, которые вызвали ошибку:', ctx.message.web_app_data.data);
        
        try {
            await ctx.reply('❌ Произошла ошибка при обработке заказа. Пожалуйста, попробуйте еще раз.');
        } catch (replyError) {
            console.error('❌ Ошибка при отправке сообщения об ошибке:', replyError);
        }
    }
});

// ============================================
// ОБРАБОТЧИКИ КНОПОК КЛАВИАТУРЫ
// ============================================

// Обработчик нажатий кнопок клавиатуры
// Обработчик кнопки "Меню" в Reply Keyboard
// Эта кнопка открывает Web App для создания заказа
bot.hears(['🍕 Меню', 'Меню'], async (ctx) => {
    console.log('✅ Нажата кнопка "Меню" в Reply Keyboard');
    const webAppUrl = process.env.WEB_APP_URL || 'https://your-domain.com';
    console.log('Web App URL:', webAppUrl);
    
    await ctx.reply('🍕 Откройте меню для оформления заказа:', {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: '🍕 Открыть меню',
                    web_app: { url: webAppUrl }
                }
            ]]
        }
    });
    console.log('✅ Сообщение с кнопкой Web App отправлено');
});

bot.hears(['📋 Мои заказы', 'Мои заказы'], async (ctx) => {
    console.log('✅ Нажата кнопка "Мои заказы"');
    const userId = ctx.from.id;
    const userOrders = orders.filter(order => order.user?.id === userId);
    
    if (userOrders.length === 0) {
        await ctx.reply('У вас пока нет заказов. Сделайте первый заказ через меню! 🍕', {
            reply_markup: getMainKeyboard()
        });
        return;
    }
    
    let message = `📋 Ваши заказы (${userOrders.length}):\n\n`;
    
    userOrders.slice(-5).reverse().forEach((order, index) => {
        const date = new Date(order.timestamp || order.createdAt).toLocaleString('ru-RU');
        message += `${index + 1}. Заказ от ${date}\n`;
        message += `   Сумма: ${order.total} ₽\n`;
        message += `   Тип: ${order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}\n`;
        message += `   Статус: ${order.status || 'Принят'}\n\n`;
    });
    
    await ctx.reply(message, {
        reply_markup: getMainKeyboard()
    });
});

bot.hears(['📊 Статус заказа', 'Статус заказа'], async (ctx) => {
    console.log('✅ Нажата кнопка "Статус заказа"');
    const userId = ctx.from.id;
    const userOrders = orders.filter(order => order.user?.id === userId);
    
    if (userOrders.length === 0) {
        await ctx.reply('У вас пока нет заказов. Сделайте первый заказ через меню! 🍕', {
            reply_markup: getMainKeyboard()
        });
        return;
    }
    
    const lastOrder = userOrders[userOrders.length - 1];
    const date = new Date(lastOrder.createdAt || lastOrder.timestamp).toLocaleString('ru-RU');
    
    const statusMessage = `
📊 <b>Статус вашего заказа</b>

📋 Номер заказа: <code>${lastOrder.orderId}</code>
📅 Дата: ${date}
💰 Сумма: ${lastOrder.total} ₽
🚚 Тип: ${lastOrder.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}
📊 Статус: ${lastOrder.status === 'new' ? '🆕 Новый' : lastOrder.status === 'processing' ? '⏳ В обработке' : lastOrder.status === 'ready' ? '✅ Готов' : lastOrder.status === 'delivered' ? '🚚 Доставлен' : '❓ Неизвестно'}
    `;
    
    await ctx.reply(statusMessage, {
        parse_mode: 'HTML',
        reply_markup: getMainKeyboard()
    });
});

bot.hears(['ℹ️ Помощь', 'Помощь'], async (ctx) => {
    console.log('✅ Нажата кнопка "Помощь"');
    const helpText = `
📖 Доступные команды:

/start - Начать работу с ботом
/menu - Открыть меню
/help - Показать эту справку
/orders - Посмотреть мои заказы
/status - Статус последнего заказа
/stats - Статистика заказов (только для администратора)

💡 Используйте кнопки клавиатуры для быстрого доступа к функциям
💡 Кнопка меню внизу экрана открывает Web App с меню
    `;
    await ctx.reply(helpText, {
        reply_markup: getMainKeyboard()
    });
});

// Обработчик для всех сообщений (web_app_data обрабатывается отдельно)
// ВАЖНО: Этот обработчик НЕ должен обрабатывать web_app_data - это делает bot.on('message:web_app_data')
bot.on('message', async (ctx) => {
    console.log('\n🔔 ОБРАБОТЧИК bot.on(message) ВЫЗВАН');
    console.log('Текст сообщения:', ctx.message?.text?.substring(0, 100) || 'нет текста');
    console.log('hasWebAppData:', !!ctx.message?.web_app_data);
    
    // Пропускаем команды - они обрабатываются отдельно
    if (ctx.message?.text && ctx.message.text.startsWith('/')) {
        console.log('⏭️ Это команда, пропускаем');
        return; // Команды обрабатываются bot.command()
    }
    
    // ВАЖНО: Пропускаем web_app_data - обрабатывается в bot.on('message:web_app_data')
    // Если мы здесь, значит bot.on('message:web_app_data') не сработал
    if (ctx.message?.web_app_data?.data) {
        console.log('⚠️ ВНИМАНИЕ: web_app_data найден, но bot.on(message:web_app_data) не сработал!');
        console.log('⚠️ Это означает, что обработчик не зарегистрирован или не работает');
        console.log('⚠️ Попробуем обработать здесь как fallback...');
        // НЕ возвращаемся, обрабатываем как fallback
    }
    
    // Логируем остальные сообщения для отладки
    console.log('\n=== ПОЛУЧЕНО ОБЫЧНОЕ СООБЩЕНИЕ ===');
    console.log('Время:', new Date().toISOString());
    console.log('Тип сообщения:', ctx.message?.text ? 'text' : 'other');
    console.log('Текст сообщения:', ctx.message?.text || 'нет текста');
    console.log('Ключи объекта message:', Object.keys(ctx.message || {}));
    const fullMessage = JSON.stringify(ctx.message || {}, null, 2);
    console.log('Полное сообщение (первые 500 символов):', fullMessage.substring(0, 500));
    
    // Проверяем данные от Web App в разных возможных форматах
    let webAppData = null;
    
    // Вариант 1: web_app_data.data (стандартный формат Telegraf)
    if (ctx.message?.web_app_data?.data) {
        webAppData = ctx.message.web_app_data.data;
        console.log('✅ Данные найдены в формате: web_app_data.data');
    }
    // Вариант 2: web_app.data (альтернативный формат)
    else if (ctx.message?.web_app?.data) {
        webAppData = ctx.message.web_app.data;
        console.log('✅ Данные найдены в формате: web_app.data');
    }
    // Вариант 3: текст сообщения содержит JSON (если данные пришли как текст)
    else if (ctx.message?.text) {
        const trimmedText = ctx.message.text.trim();
        console.log('🔍 Проверка текста на JSON...');
        console.log('   Первые 50 символов:', trimmedText.substring(0, 50));
        console.log('   Начинается с {?:', trimmedText.startsWith('{'));
        console.log('   Заканчивается на }?:', trimmedText.endsWith('}'));
        
        if (trimmedText.startsWith('{') && trimmedText.endsWith('}')) {
            try {
                // Пробуем распарсить JSON
                const parsed = JSON.parse(trimmedText);
                console.log('✅ JSON успешно распарсен');
                console.log('   Есть items?:', !!parsed.items);
                console.log('   items - массив?:', Array.isArray(parsed.items));
                console.log('   Есть total?:', parsed.total !== undefined);
                
                // Проверяем, что это похоже на заказ (есть поля items, total и т.д.)
                if (parsed.items && Array.isArray(parsed.items) && parsed.total !== undefined) {
                    webAppData = trimmedText;
                    console.log('✅ Данные найдены в формате: text (JSON заказа)');
                } else {
                    console.log('⚠️ JSON не является заказом (нет items или total)');
                }
            } catch (e) {
                // Не валидный JSON или не заказ
                console.log('❌ Ошибка парсинга JSON:', e.message);
            }
        } else {
            console.log('⚠️ Текст не начинается с { или не заканчивается на }');
        }
    }
    
    if (!webAppData) {
        // Если это обычное сообщение, игнорируем
        console.log('ℹ️ Обычное сообщение, игнорируем');
        return;
    }
    
    console.log('📦 Данные Web App:', webAppData.substring(0, 200) + (webAppData.length > 200 ? '...' : ''));
    
    try {
        // Парсим данные заказа
        const orderData = JSON.parse(webAppData);
        
        console.log('✅ Получен заказ из JSON-сообщения:', orderData);
        console.log('🔍 Проверка структуры заказа:');
        console.log('   items:', orderData.items?.length || 0, 'позиций');
        console.log('   total:', orderData.total);
        console.log('   recipientName:', orderData.recipientName);
        console.log('   phone:', orderData.phone);
        console.log('   deliveryType:', orderData.deliveryType);
        
        // Добавляем статус и ID заказа
        // ВАЖНО: Используем orderId из JSON, если он есть (для совместимости с кнопками)
        // ВАЖНО: Перезаписываем user на ctx.from, так как это актуальная информация от Telegram
        const order = {
            ...orderData,
            orderId: orderData.orderId || `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            status: orderData.status || 'new',
            createdAt: orderData.createdAt || new Date().toISOString(),
            user: ctx.from // Сохраняем информацию о пользователе (перезаписываем, если было в orderData)
        };
        
        console.log('🔍 Используемый orderId:', order.orderId);
        console.log('   orderId из JSON:', orderData.orderId || 'не указан');
        
        console.log('🔍 Проверка данных заказа после обработки:');
        console.log('   orderId:', order.orderId);
        console.log('   user.id:', order.user?.id);
        console.log('   user.username:', order.user?.username);
        
        // Сохраняем заказ
        orders.push(order);
        console.log('💾 Заказ сохранен в массив orders');
        console.log('📊 Всего заказов в системе:', orders.length);
        console.log('📋 Последний заказ:', {
            orderId: order.orderId,
            total: order.total,
            recipientName: order.recipientName,
            phone: order.phone,
            userId: order.user?.id
        });
        
        // Формируем сообщение для пользователя
        const orderMessage = formatOrderMessage(order, true);
        
        // Отправляем подтверждение пользователю
        console.log('📤 Отправка подтверждения пользователю...');
        const customerMsg = await ctx.reply(orderMessage, {
            parse_mode: 'HTML',
            reply_markup: getMainKeyboard()
        });
        console.log('✅ Подтверждение отправлено пользователю');
        console.log('   Message ID:', customerMsg.message_id);
        
        // Сохраняем message_id для заказчика
        orderMessages.set(order.orderId, {
            customerMessageId: customerMsg.message_id,
            customerChatId: ctx.from.id
        });
        
        // Уведомляем администраторов
        console.log('📤 Вызов функции notifyAdmins...');
        await notifyAdmins(ctx, order);
        console.log('✅ Функция notifyAdmins завершена');
        
        // Здесь можно добавить интеграцию с CRM
        // await saveOrderToCRM(order);
        
    } catch (error) {
        console.error('Ошибка обработки заказа:', error);
        await ctx.reply('❌ Произошла ошибка при обработке заказа. Пожалуйста, попробуйте еще раз.');
    }
});

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

// Форматирование сообщения о заказе для заказчика
function formatOrderMessage(order, showStatus = true) {
    const deliveryTypeText = order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка';
    const paymentMethodText = order.paymentMethod === 'cod' ? 'При получении' : 'Онлайн';
    
    // Статусы заказа
    const statusEmoji = {
        'new': '🆕',
        'accepted': '✅',
        'cooking': '👨‍🍳',
        'delivering': '🚚',
        'completed': '🎉',
        'cancelled': '❌'
    };
    
    const statusText = {
        'new': 'Новый',
        'accepted': 'Принят',
        'cooking': 'Готовится',
        'delivering': 'Доставляется',
        'completed': 'Завершен',
        'cancelled': 'Отменен'
    };
    
    let statusLine = '';
    if (showStatus && order.status) {
        statusLine = `\n📊 Статус: ${statusEmoji[order.status] || '❓'} ${statusText[order.status] || order.status}\n`;
    }
    
    let message = `
${order.status === 'cancelled' ? '❌' : '✅'} <b>${order.status === 'cancelled' ? 'Заказ отменен' : order.status === 'completed' ? 'Заказ завершен!' : 'Заказ принят!'}</b>
${statusLine}
📋 Номер заказа: <code>${order.orderId}</code>
👤 Получатель: ${order.recipientName}
📞 Телефон: ${order.phone}
🚚 Тип доставки: ${deliveryTypeText}
💳 Способ оплаты: ${paymentMethodText}
    `;
    
    if (order.deliveryType === 'delivery' && order.address) {
        message += `📍 Адрес: ${order.address}\n`;
        if (order.addressDetails?.apartment) {
            message += `   Квартира: ${order.addressDetails.apartment}\n`;
        }
        if (order.addressDetails?.comment) {
            message += `   Комментарий: ${order.addressDetails.comment}\n`;
        }
    }
    
    message += `\n🛒 <b>Состав заказа:</b>\n`;
    order.items.forEach(item => {
        message += `   • ${item.name} × ${item.quantity} = ${item.price * item.quantity} ₽\n`;
    });
    
    if (order.cutlery > 0) {
        message += `   • Приборы: ${order.cutlery} шт.\n`;
    }
    
    message += `\n💰 <b>Итого: ${order.total} ₽</b>\n`;
    
    if (order.deliveryType === 'pickup') {
        message += `\n📍 Забрать заказ можно по адресу:\nг. Шахты, ул. Советская, дом 235 «Бункер»`;
    }
    
    if (order.status === 'cancelled') {
        message += `\n\n❌ Заказ был отменен администратором.`;
    } else if (order.status === 'completed') {
        message += `\n\n🎉 Спасибо за заказ! Приятного аппетита!`;
    } else {
        message += `\n\n⏰ Мы свяжемся с вами в ближайшее время!`;
    }
    
    return message;
}

// Форматирование сообщения о заказе для администратора
function formatAdminOrderMessage(order) {
    const deliveryTypeText = order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка';
    const paymentMethodText = order.paymentMethod === 'cod' ? 'При получении' : 'Онлайн';
    
    const statusEmoji = {
        'new': '🆕',
        'accepted': '✅',
        'cooking': '👨‍🍳',
        'delivering': '🚚',
        'completed': '🎉',
        'cancelled': '❌'
    };
    
    const statusText = {
        'new': 'Новый',
        'accepted': 'Принят',
        'cooking': 'Готовится',
        'delivering': 'Доставляется',
        'completed': 'Завершен',
        'cancelled': 'Отменен'
    };
    
    let message = `
🔔 <b>Новый заказ!</b>

📋 Номер: <code>${order.orderId}</code>
📊 Статус: ${statusEmoji[order.status] || '❓'} ${statusText[order.status] || order.status}
👤 Клиент: ${order.recipientName}
📞 Телефон: ${order.phone}
🚚 Тип: ${deliveryTypeText}
💳 Оплата: ${paymentMethodText}
    `;
    
    if (order.deliveryType === 'delivery' && order.address) {
        message += `📍 Адрес: ${order.address}\n`;
        if (order.addressDetails?.apartment) {
            message += `   Квартира: ${order.addressDetails.apartment}\n`;
        }
        if (order.addressDetails?.comment) {
            message += `   Комментарий: ${order.addressDetails.comment}\n`;
        }
    }
    
    message += `\n🛒 <b>Состав заказа:</b>\n`;
    order.items.forEach(item => {
        message += `   • ${item.name} × ${item.quantity} = ${item.price * item.quantity} ₽\n`;
    });
    
    if (order.cutlery > 0) {
        message += `   • Приборы: ${order.cutlery} шт.\n`;
    }
    
    message += `\n💰 <b>Итого: ${order.total} ₽</b>`;
    
    return message;
}

// Получение inline клавиатуры для управления статусом заказа
function getOrderStatusKeyboard(orderId, currentStatus) {
    const keyboard = [];
    
    if (currentStatus === 'new') {
        keyboard.push([
            { text: '✅ Принять', callback_data: `order_accept_${orderId}` },
            { text: '❌ Отклонить', callback_data: `order_reject_${orderId}` }
        ]);
    } else if (currentStatus === 'accepted') {
        keyboard.push([
            { text: '👨‍🍳 Готовить', callback_data: `order_cooking_${orderId}` }
        ]);
    } else if (currentStatus === 'cooking') {
        keyboard.push([
            { text: '🚚 Доставляется', callback_data: `order_delivering_${orderId}` }
        ]);
    } else if (currentStatus === 'delivering') {
        keyboard.push([
            { text: '🎉 Завершен', callback_data: `order_completed_${orderId}` }
        ]);
    }
    
    return keyboard.length > 0 ? { inline_keyboard: keyboard } : null;
}

// Уведомление администраторов о новом заказе
async function notifyAdmins(ctx, order) {
    const adminIdsStr = process.env.ADMIN_IDS || '';
    console.log('ADMIN_IDS из .env:', adminIdsStr);
    
    const adminIds = adminIdsStr.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    
    console.log('Список администраторов:', adminIds);
    
    if (adminIds.length === 0) {
        console.warn('⚠️ ADMIN_IDS не настроен или пуст! Уведомления администраторам не будут отправлены.');
        return;
    }
    
    const adminMessage = formatAdminOrderMessage(order);
    const keyboard = getOrderStatusKeyboard(order.orderId, order.status);
    
    console.log('Отправка уведомлений администраторам...');
    
    for (const adminId of adminIds) {
        try {
            console.log(`Отправка уведомления администратору ${adminId}...`);
            const msg = await bot.telegram.sendMessage(adminId, adminMessage, { 
                parse_mode: 'HTML',
                reply_markup: keyboard
            });
            console.log(`✅ Уведомление успешно отправлено администратору ${adminId}`);
            console.log('   Message ID:', msg.message_id);
            
            // Сохраняем message_id для администратора
            const existing = orderMessages.get(order.orderId) || {};
            if (!existing.adminMessages) {
                existing.adminMessages = [];
            }
            existing.adminMessages.push({
                messageId: msg.message_id,
                adminId: adminId
            });
            orderMessages.set(order.orderId, existing);
        } catch (error) {
            console.error(`❌ Ошибка отправки уведомления администратору ${adminId}:`, error.message);
            if (error.response) {
                console.error('Детали ошибки:', error.response);
            }
        }
    }
}

// ============================================
// ОБРАБОТКА CALLBACK QUERY (ИЗМЕНЕНИЕ СТАТУСА ЗАКАЗА)
// ============================================

bot.action(/^order_(accept|reject|cooking|delivering|completed)_(.+)$/, async (ctx) => {
    try {
        const action = ctx.match[1]; // accept, reject, cooking, delivering, completed
        const orderId = ctx.match[2];
        
        console.log(`\n🔄 Обработка изменения статуса заказа: ${action} для заказа ${orderId}`);
        console.log('Пользователь:', ctx.from.id, ctx.from.username);
        
        // Проверяем права администратора
        const adminIds = (process.env.ADMIN_IDS || '').split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        if (!adminIds.includes(ctx.from.id)) {
            await ctx.answerCbQuery('❌ У вас нет прав для изменения статуса заказа.');
            console.log('❌ Доступ запрещен для пользователя:', ctx.from.id);
            return;
        }
        
        // Находим заказ
        const order = orders.find(o => o.orderId === orderId);
        if (!order) {
            await ctx.answerCbQuery('❌ Заказ не найден. Возможно, он еще обрабатывается.');
            console.log('❌ Заказ не найден:', orderId);
            console.log('📋 Всего заказов в системе:', orders.length);
            console.log('📋 ID всех заказов:', orders.map(o => o.orderId));
            return;
        }
        
        // Определяем новый статус
        let newStatus;
        let statusText;
        switch (action) {
            case 'accept':
                newStatus = 'accepted';
                statusText = '✅ Заказ принят!';
                break;
            case 'reject':
                newStatus = 'cancelled';
                statusText = '❌ Заказ отменен.';
                break;
            case 'cooking':
                newStatus = 'cooking';
                statusText = '👨‍🍳 Заказ готовится!';
                break;
            case 'delivering':
                newStatus = 'delivering';
                statusText = '🚚 Заказ доставляется!';
                break;
            case 'completed':
                newStatus = 'completed';
                statusText = '🎉 Заказ завершен!';
                break;
            default:
                await ctx.answerCbQuery('❌ Неизвестное действие.');
                return;
        }
        
        // Обновляем статус заказа
        order.status = newStatus;
        order.updatedAt = new Date().toISOString();
        console.log(`✅ Статус заказа ${orderId} изменен на: ${newStatus}`);
        
        // Обновляем сообщение администратора
        const adminMessage = formatAdminOrderMessage(order);
        const keyboard = getOrderStatusKeyboard(order.orderId, newStatus);
        
        const orderMsg = orderMessages.get(orderId);
        if (orderMsg && orderMsg.adminMessages) {
            for (const adminMsg of orderMsg.adminMessages) {
                try {
                    await bot.telegram.editMessageText(
                        adminMsg.adminId,
                        adminMsg.messageId,
                        null,
                        adminMessage,
                        {
                            parse_mode: 'HTML',
                            reply_markup: keyboard
                        }
                    );
                    console.log(`✅ Сообщение администратора обновлено (${adminMsg.adminId})`);
                } catch (error) {
                    console.error(`❌ Ошибка обновления сообщения администратора:`, error.message);
                }
            }
        }
        
        // Уведомляем заказчика об изменении статуса
        if (orderMsg && orderMsg.customerChatId) {
            try {
                const customerMessage = formatOrderMessage(order, true);
                await bot.telegram.editMessageText(
                    orderMsg.customerChatId,
                    orderMsg.customerMessageId,
                    null,
                    customerMessage,
                    {
                        parse_mode: 'HTML'
                    }
                );
                console.log(`✅ Сообщение заказчика обновлено`);
                
                // Отправляем дополнительное уведомление
                await bot.telegram.sendMessage(
                    orderMsg.customerChatId,
                    `📢 ${statusText}`,
                    { reply_markup: getMainKeyboard() }
                );
            } catch (error) {
                console.error(`❌ Ошибка обновления сообщения заказчика:`, error.message);
                // Если не удалось обновить, отправляем новое сообщение
                try {
                    const customerMessage = formatOrderMessage(order, true);
                    await bot.telegram.sendMessage(
                        orderMsg.customerChatId,
                        customerMessage,
                        { parse_mode: 'HTML', reply_markup: getMainKeyboard() }
                    );
                    await bot.telegram.sendMessage(
                        orderMsg.customerChatId,
                        `📢 ${statusText}`,
                        { reply_markup: getMainKeyboard() }
                    );
                } catch (sendError) {
                    console.error(`❌ Ошибка отправки сообщения заказчику:`, sendError.message);
                }
            }
        }
        
        await ctx.answerCbQuery(statusText);
        console.log(`✅ Статус заказа ${orderId} успешно изменен на ${newStatus}`);
        
    } catch (error) {
        console.error('❌ Ошибка при изменении статуса заказа:', error);
        console.error('Stack trace:', error.stack);
        await ctx.answerCbQuery('❌ Произошла ошибка при изменении статуса.');
    }
});

// ============================================
// ОБРАБОТКА ОШИБОК
// ============================================

bot.catch((err, ctx) => {
    console.error('Ошибка в боте:', err);
    ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
});

// ============================================
// ЗАПУСК БОТА
// ============================================

// Запуск бота
console.log('🚀 Начинаю запуск бота...');

// Пробуем использовать startPolling вместо launch для обхода проблем с long polling
async function startBot() {
    try {
        console.log('⏳ Запуск long polling...');
        
        // Используем startPolling с явными параметрами
        await bot.telegram.deleteWebhook({ drop_pending_updates: true });
        console.log('✅ Webhook удален (если был установлен)');
        
        // Запускаем polling
        // ВАЖНО: получаем ВСЕ типы обновлений, включая web_app_data
        // Явно указываем типы обновлений, включая message (который содержит web_app_data)
        bot.startPolling({
            allowedUpdates: ['message', 'callback_query', 'edited_message'], // Получаем сообщения (включая web_app_data)
            dropPendingUpdates: false
        });
        
        console.log('⚠️ ВАЖНО: Для работы sendData() необходимо настроить Menu Button в BotFather!');
        console.log('   BotFather → /mybots → Ваш бот → Bot Settings → Menu Button');
        console.log('   URL должен быть:', process.env.WEB_APP_URL || 'не указан');
        console.log('📡 Polling настроен для получения ВСЕХ типов обновлений (включая web_app_data)');
        
        console.log('🤖 Бот запущен и готов к работе!');
        console.log('📱 Web App URL:', process.env.WEB_APP_URL || 'не указан');
        console.log('✅ Бот работает и ожидает сообщения...');
        console.log('💡 Бот использует long polling для получения обновлений');
        
    } catch (error) {
        console.error('❌ Ошибка запуска бота:', error);
        console.error('Детали ошибки:', error.message);
        if (error.response) {
            console.error('Ответ API:', JSON.stringify(error.response, null, 2));
        }
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        process.exit(1);
    }
}

// Запускаем бота
startBot();

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Экспорт для использования в других модулях
module.exports = { bot, orders };

