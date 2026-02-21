# IYUC Store frontend: Vite + React (Lovable)
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000
# Vite: --host 0.0.0.0 so container is reachable; --port 3000 to match compose
CMD ["sh", "-c", "npx vite --host 0.0.0.0 --port 3000"]
