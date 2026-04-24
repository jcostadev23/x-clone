FROM node:22-alpine AS builder

WORKDIR /server

COPY package.json package-lock.json ./
RUN npm ci --omit=dev=false

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /server

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /server/dist ./dist

EXPOSE 4000

CMD ["node", "dist/server.js"]
