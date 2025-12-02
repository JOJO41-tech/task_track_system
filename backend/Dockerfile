# backend/Dockerfile
FROM node:20-alpine
WORKDIR /app

# copy package first to install deps
COPY package*.json ./
RUN npm ci

# copy rest
COPY . .

ENV PORT=5000
EXPOSE 5000

CMD ["node", "index.js"]
