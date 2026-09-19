FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN npm ci

FROM dependencies AS api-build

COPY . .
RUN npm run build --workspace @repo/api

FROM dependencies AS web-build

ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY . .
RUN npm run build --workspace @repo/web

FROM node:22-alpine AS production-dependencies

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN npm ci --omit=dev

FROM node:22-alpine AS api

ENV NODE_ENV=production
ENV PORT=3001
WORKDIR /app

COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=production-dependencies /app/apps/api/package.json ./apps/api/package.json
COPY --from=api-build /app/apps/api/dist ./apps/api/dist
COPY --from=api-build /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001

CMD ["node", "apps/api/dist/main.js"]

FROM node:22-alpine AS web

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
WORKDIR /app

COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=production-dependencies /app/apps/web/package.json ./apps/web/package.json
COPY --from=production-dependencies /app/packages/contracts ./packages/contracts
COPY --from=web-build /app/apps/web/.next ./apps/web/.next

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace", "@repo/web"]
