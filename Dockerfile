FROM node:latest

WORKDIR /app

COPY package*.json /app/
RUN npm install
COPY /src/index.js /app

CMD node index.js

