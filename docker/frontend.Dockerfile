# IYUC Store frontend: Medusa Next.js Starter (Next 15, React 19, Yarn 4)
# Copied into frontend/ by setup-frontend.sh
FROM node:20-alpine

RUN corepack enable && corepack prepare yarn@4.12.0 --activate

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install --immutable

COPY . .

ENV NODE_ENV=development
EXPOSE 3000
CMD ["sh", "-c", "yarn dev --turbopack -H 0.0.0.0 -p 3000"]
