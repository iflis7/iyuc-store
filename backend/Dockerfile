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

EXPOSE 9000 5173

CMD ["./start.sh"]
