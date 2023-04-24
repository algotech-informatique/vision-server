FROM node:18.13.0-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN apk add --no-cache git && npm i --force

RUN apk add --no-cache \
    libreoffice \
    libreoffice-base \
    ttf-freefont

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
