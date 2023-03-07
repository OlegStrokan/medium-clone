FROM node:16

WORKDIR /app/gateway

COPY package.json ./
COPY yarn.lock ./

RUN yarn global add @nestjs/cli
RUN yarn

COPY ./src .


CMD ["yarn", "start:dev"]
