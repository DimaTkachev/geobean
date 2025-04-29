FROM node:22-alpine

WORKDIR /app

# Сначала копируем файлы зависимостей
COPY package*.json ./
COPY ./wait-for.sh /app/wait-for.sh

# Установка npm пакетов
RUN npm install

# Копируем остальные файлы
COPY . .

# Устанавливаем права на скрипт
RUN chmod +x /app/wait-for.sh

EXPOSE 5000

# Используем абсолютный путь к скрипту
CMD ["app/wait-for.sh", "db", "node", "src/server.js"]