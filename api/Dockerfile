FROM node:18-alpine3.16 as builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN yarn --only=builder

COPY  . .

EXPOSE 3000
EXPOSE 9229

RUN yarn build


FROM node:18-alpine3.16 as server

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN yarn --prod --only=production

COPY . .
COPY --from=builder ./app/dist ./dist

EXPOSE 3000

CMD ["yarn", "start"]
