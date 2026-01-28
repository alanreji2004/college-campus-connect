FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* ./ 
RUN npm install --only=production || npm install

COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]

