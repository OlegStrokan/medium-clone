FROM node:16

WORKDIR /app/user

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .


CMD ["yarn", "start:dev"]
