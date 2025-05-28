FROM node:16-alpine

RUN apk add --no-cache mysql-client bash

WORKDIR /app

COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY ./src ./src
COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 5001

CMD ["/wait-for-db.sh", "db", "./start.sh"]