FROM node:16

WORKDIR /app/token

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .


CMD ["yarn", "start:dev"]
