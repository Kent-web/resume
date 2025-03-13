const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();

app.use(express.json());
const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Клавиатура услуг
const services = [
  ['Мелкий ремонт', 'repair'],
  ['Сборка техники', 'tech'],
  ['Доставка', 'delivery'],
  ['Документы', 'docs'],
  ['Клининг', 'cleaning']
].map(([text, data]) => ([{ text, callback_data: data }]));

// Обработчик /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Выберите услугу:', {
    reply_markup: { inline_keyboard: services }
  });
});

// Обработка заявок
bot.on('callback_query', (query) => {
  const { chat } = query.message;
  const service = query.data;
  
  bot.sendMessage(chat.id, `Введите описание задачи (${service}):`);
  
  bot.once('message', (msg) => {
    const request = `НОВАЯ ЗАЯВКА!\nУслуга: ${service}\nИмя: ${msg.from.first_name}\nСообщение: ${msg.text}`;
    
    // Замените на ваш канал или chat_id админа
    bot.sendMessage('@ваш_канал', request)
      .then(() => bot.sendMessage(chat.id, '✅ Заявка отправлена!'))
      .catch(() => bot.sendMessage(chat.id, '❌ Ошибка отправки'));
  });
});

// Сервер для Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
