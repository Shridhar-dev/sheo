FROM node:18-slim

WORKDIR /usr/src/app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

RUN cp -r .next/static .next/standalone/.next/static

CMD [ "node", ".next/standalone/server.js" ]