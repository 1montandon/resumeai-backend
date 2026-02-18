FROM node:22-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build app
RUN npx prisma generate

# App runs on 3333 (must match fly.toml internal_port)
ENV PORT=3333

EXPOSE 3333

CMD ["npm", "start"]
