FROM node:26-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci

COPY . .
RUN npx playwright install --with-deps chromium

CMD ["npm", "run", "storybook"]

FROM ubuntu:24.04 AS test

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl gnupg fontconfig fonts-liberation fonts-dejavu-core \
  && curl -fsSL https://deb.nodesource.com/setup_26.x | bash - \
  && apt-get install -y --no-install-recommends nodejs \
  && fc-cache -f \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci

COPY . .
RUN npx playwright install --with-deps chromium

CMD ["npm", "run", "test"]
