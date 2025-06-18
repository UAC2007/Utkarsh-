FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Stage 2 — Final image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app .

EXPOSE 4000

CMD ["node", "server.js"]
