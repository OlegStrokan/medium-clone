FROM node:16

WORKDIR /app

COPY package.json yarn.lock vite.config.ts ./

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "preview"]
