FROM node:26-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci

COPY . .
RUN npm run build-storybook
RUN npx playwright install --with-deps chromium

CMD ["npm", "run", "storybook"]

FROM nginx:alpine AS app

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY --from=builder /app/storybook-static /usr/share/nginx/html

EXPOSE 8030

ENTRYPOINT ["/entrypoint.sh"]
