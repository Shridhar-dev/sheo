FROM node:18-slim

WORKDIR /usr/src/app

# Enable corepack for using pnpm
RUN corepack enable 

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 8000

CMD [ "pnpm", "run", "start" ]
