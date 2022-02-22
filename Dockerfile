# Install dependencies only when needed
FROM node:17-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
# Remove old SWC platform data
# RUN rm -r node_modules/@next/swc-linux-x64-gnu &>- || echo 'Go next. The swc-linux-x64-gnu directory does not exist'
# Update browserslist
# RUN npx browserslist@latest --update-db
# COPY . .
# RUN yarn add sharp
RUN yarn install

# Rebuild the source code only when needed
FROM node:17-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build
# RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:17-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs --from=builder  /app/.next ./.next
COPY --chown=nextjs:nodejs --from=builder /app/public ./public

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

USER nextjs
CMD ["yarn", "start"]