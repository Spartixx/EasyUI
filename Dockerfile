FROM node:26-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci

COPY . .
RUN npx playwright install --with-deps chromium

CMD ["npm", "run", "storybook"]
