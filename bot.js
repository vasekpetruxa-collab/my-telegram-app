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

// ============================================
// ОСНОВНЫЕ КОМАНДЫ БОТА
// ============================================

// Команда /start - приветствие и запуск Web App
bot.start(async (ctx) => {
    const welcomeMessage = `
🍕 Добро пожаловать в гастропаб БУНКЕР!

Я помогу вам сделать заказ. Нажмите на кнопку ниже, чтобы открыть меню:
    `;
    
    await ctx.reply(welcomeMessage, {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: '🍕 Открыть меню',
                    web_app: { url: process.env.WEB_APP_URL || 'https://your-domain.com' }
                }
            ]]
        }
    });
});

// Команда /menu - открыть меню
bot.command('menu', async (ctx) => {
    await ctx.reply('Открываю меню...', {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: '🍕 Открыть меню',
                    web_app: { url: process.env.WEB_APP_URL || 'https://your-domain.com' }
                }
            ]]
        }
    });
});

// Команда /help - помощь
bot.command('help', async (ctx) => {
    const helpText = `
📖 Доступные команды:

/start - Начать работу с ботом
/menu - Открыть меню
/help - Показать эту справку
/orders - Посмотреть мои заказы (только для вас)
/stats - Статистика заказов (только для администратора)

💡 Для оформления заказа используйте кнопку "Открыть меню"
    `;
    await ctx.reply(helpText);
});

// Команда /orders - показать заказы пользователя
bot.command('orders', async (ctx) => {
    const userId = ctx.from.id;
    const userOrders = orders.filter(order => order.user?.id === userId);
    
    if (userOrders.length === 0) {
        await ctx.reply('У вас пока нет заказов. Сделайте первый заказ через меню! 🍕');
        return;
    }
    
    let message = `📋 Ваши заказы (${userOrders.length}):\n\n`;
    
    userOrders.slice(-5).reverse().forEach((order, index) => {
        const date = new Date(order.timestamp).toLocaleString('ru-RU');
        message += `${index + 1}. Заказ от ${date}\n`;
        message += `   Сумма: ${order.total} ₽\n`;
        message += `   Тип: ${order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}\n`;
        message += `   Статус: ${order.status || 'Принят'}\n\n`;
    });
    
    await ctx.reply(message);
});

// Команда /stats - статистика (только для администратора)
bot.command('stats', async (ctx) => {
    const adminIds = (process.env.ADMIN_IDS || '').split(',').map(id => parseInt(id.trim()));
    
    if (!adminIds.includes(ctx.from.id)) {
        await ctx.reply('❌ У вас нет доступа к этой команде.');
        return;
    }
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
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
});

// ============================================
// ОБРАБОТКА ДАННЫХ ИЗ WEB APP
// ============================================

// Обработка данных, отправленных из Web App
// Обрабатываем ВСЕ типы обновлений для диагностики

// Обработчик для ВСЕХ обновлений (для диагностики)
bot.use(async (ctx, next) => {
    console.log('\n🔔 ПОЛУЧЕНО ОБНОВЛЕНИЕ');
    console.log('Тип обновления:', ctx.updateType);
    console.log('Время:', new Date().toISOString());
    
    if (ctx.updateType === 'message') {
        console.log('📨 Это сообщение');
        console.log('hasWebApp:', !!ctx.message?.web_app);
        console.log('hasWebAppData:', !!ctx.message?.web_app_data);
    }
    
    return next();
});

bot.on('message', async (ctx) => {
    // Пропускаем команды - они обрабатываются отдельно
    if (ctx.message?.text && ctx.message.text.startsWith('/')) {
        return; // Команды обрабатываются bot.command()
    }
    
    // Логируем все входящие сообщения для отладки
    console.log('\n=== ПОЛУЧЕНО СООБЩЕНИЕ ===');
    console.log('Время:', new Date().toISOString());
    console.log('Тип сообщения:', ctx.message?.text ? 'text' : 'other');
    console.log('hasWebApp:', !!ctx.message?.web_app);
    console.log('hasWebAppData:', !!ctx.message?.web_app_data);
    console.log('Ключи объекта message:', Object.keys(ctx.message || {}));
    
    // Детальный вывод структуры сообщения
    if (ctx.message?.web_app_data) {
        console.log('📦 web_app_data найден:', JSON.stringify(ctx.message.web_app_data, null, 2));
    }
    if (ctx.message?.web_app) {
        console.log('📦 web_app найден:', JSON.stringify(ctx.message.web_app, null, 2));
    }
    
    // Полное сообщение (первые 500 символов для читаемости)
    const fullMessage = JSON.stringify(ctx.message, null, 2);
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
    else if (ctx.message?.text && ctx.message.text.startsWith('{')) {
        try {
            JSON.parse(ctx.message.text);
            webAppData = ctx.message.text;
            console.log('✅ Данные найдены в формате: text (JSON)');
        } catch (e) {
            // Не JSON
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
        
        console.log('Получен заказ:', orderData);
        
        // Добавляем статус и ID заказа
        const order = {
            ...orderData,
            orderId: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            status: 'new',
            createdAt: new Date().toISOString()
        };
        
        // Сохраняем заказ
        orders.push(order);
        
        // Формируем сообщение для пользователя
        const orderMessage = formatOrderMessage(order);
        
        // Отправляем подтверждение пользователю
        await ctx.reply(orderMessage, {
            parse_mode: 'HTML'
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

// Форматирование сообщения о заказе
function formatOrderMessage(order) {
    const deliveryTypeText = order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка';
    const paymentMethodText = order.paymentMethod === 'cod' ? 'При получении' : 'Онлайн';
    
    let message = `
✅ <b>Заказ принят!</b>

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
    
    message += `\n\n⏰ Мы свяжемся с вами в ближайшее время!`;
    
    return message;
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
    
    const adminMessage = `
🔔 <b>Новый заказ!</b>

📋 Номер: <code>${order.orderId}</code>
👤 Клиент: ${order.recipientName}
📞 Телефон: ${order.phone}
💰 Сумма: ${order.total} ₽
🚚 Тип: ${order.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}
    `;
    
    console.log('Отправка уведомлений администраторам...');
    
    for (const adminId of adminIds) {
        try {
            console.log(`Отправка уведомления администратору ${adminId}...`);
            await bot.telegram.sendMessage(adminId, adminMessage, { parse_mode: 'HTML' });
            console.log(`✅ Уведомление успешно отправлено администратору ${adminId}`);
        } catch (error) {
            console.error(`❌ Ошибка отправки уведомления администратору ${adminId}:`, error.message);
            if (error.response) {
                console.error('Детали ошибки:', error.response);
            }
        }
    }
}

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
        bot.startPolling({
            allowedUpdates: ['message', 'callback_query'],
            dropPendingUpdates: false
        });
        
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

