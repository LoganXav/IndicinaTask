FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Install a simple HTTP server to serve the built application
RUN npm install -g serve

CMD ["serve", "-s", "dist"]

EXPOSE 3000
