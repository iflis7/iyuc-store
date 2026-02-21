# Development Dockerfile for Medusa (IYUC Store)
FROM node:20-alpine

WORKDIR /server

# Copy package files and Yarn config
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases .yarn/releases

# Install dependencies
RUN yarn install

# Copy source
COPY . .

# Build admin so it is served as static assets (avoids Vite dev 404s in Docker)
RUN yarn build

EXPOSE 9000 5173

CMD ["./start.sh"]
