# Stage 1 — build
FROM node:20-alpine AS builder
WORKDIR /app
# Install build deps
COPY package*.json ./
RUN npm ci
# Copy source and build
COPY . .
RUN npm run build

# Stage 2 — production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# copy package.json to install prod deps only
COPY package*.json ./
RUN npm ci --omit=dev

# copy build output & public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
# expose port and run
EXPOSE 3000
CMD ["npm", "start"]
