FROM node:16

WORKDIR /app/permission

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .


CMD ["yarn", "start:dev"]
