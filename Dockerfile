FROM node:21-alpine3.18 as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY packages ./packages 
RUN npm install --global pnpm
RUN pnpm install --only=production
COPY . .



# Etapa de producción
FROM builder as deploy

COPY --from=builder /app ./
ARG RAILWAY_STATIC_URL
ARG PUBLIC_URL
ARG PORT
RUN pnpm install --frozen-lockfile --production
RUN npm install dotenv --save
CMD ["npm", "start"]