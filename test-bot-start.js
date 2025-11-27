// Тестовый скрипт для диагностики запуска бота
require('dotenv').config();
const { Telegraf } = require('telegraf');

console.log('🚀 Начало загрузки бота...');
console.log('✅ Telegraf загружен');
console.log('✅ .env загружен');
console.log('BOT_TOKEN:', process.env.BOT_TOKEN ? 'найден' : 'НЕ НАЙДЕН');
console.log('ADMIN_IDS:', process.env.ADMIN_IDS || 'не указан');
console.log('WEB_APP_URL:', process.env.WEB_APP_URL || 'не указан');

console.log('\n🔧 Инициализация бота...');
const bot = new Telegraf(process.env.BOT_TOKEN);
console.log('✅ Бот инициализирован');

console.log('\n📡 Подключение к Telegram API...');
bot.telegram.getMe()
    .then(me => {
        console.log('✅ Подключение успешно!');
        console.log('   Имя бота:', me.first_name);
        console.log('   Username:', me.username);
        console.log('   ID:', me.id);
        
        console.log('\n🚀 Запуск бота...');
        return bot.launch();
    })
    .then(() => {
        console.log('\n🤖 Бот запущен и готов к работе!');
        console.log('📱 Web App URL:', process.env.WEB_APP_URL || 'не указан');
        console.log('\n✅ Бот работает. Нажмите Ctrl+C для остановки.');
    })
    .catch((error) => {
        console.error('\n❌ Ошибка:', error.message);
        if (error.response) {
            console.error('Детали ошибки:', JSON.stringify(error.response, null, 2));
        }
        console.error('Полная ошибка:', error);
        process.exit(1);
    });

// Graceful shutdown
process.once('SIGINT', () => {
    console.log('\n🛑 Остановка бота...');
    bot.stop('SIGINT');
    process.exit(0);
});
process.once('SIGTERM', () => {
    console.log('\n🛑 Остановка бота...');
    bot.stop('SIGTERM');
    process.exit(0);
});

