FROM node:18

# Обновляем npm до последней версии
RUN npm install -g npm@latest

WORKDIR /app
COPY package.json .
COPY package-lock.json .

# Очистка кэша и установка зависимостей
RUN npm cache clean --force && npm install

COPY . .
CMD ["npm", "start"]
