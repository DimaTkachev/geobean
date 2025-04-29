FROM node:16-alpine

# Установка зависимостей
RUN apk add --no-cache mysql-client bash

WORKDIR /app

# Копируем скрипт ожидания
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5001

CMD ["/wait-for-db.sh", "db", "node", "src/server.js"]