FROM registry.myalgotech.io/algo-node:18.13.0-alpine

WORKDIR /usr/src/app

COPY .npmrc ~/.npmrc
COPY .npmrc ./.npmrc
COPY package.json ./

COPY .npmrc ./

RUN npm i --force

RUN apk add --no-cache \
    libreoffice \
    libreoffice-base \
    ttf-freefont

COPY . .

EXPOSE 3000

CMD ["npm", "run", "webpack","&"]
CMD ["npm", "run", "start:debug"]
