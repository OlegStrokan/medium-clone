FROM node:16

RUN mkdir -p /app/user
WORKDIR /app/user

COPY package.json ./
COPY yarn.lock ./

RUN yarn global add @nestjs/cli
RUN yarn

COPY ./src .


CMD ["yarn", "start:dev"]
