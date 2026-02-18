FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

CMD ["node", "--experimental-strip-types", "src/server.ts"]
