# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .
RUN npm run build


# Stage 2: Production image
FROM node:18-alpine AS runner

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/build ./build

ENV NODE_ENV=production
EXPOSE 5500

CMD ["npm", "start"]
