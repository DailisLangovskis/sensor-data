FROM node:10.16-alpine

RUN apk --update add --no-cache git openssh nodejs npm make

RUN mkdir /code
WORKDIR /code

COPY ./src /code/src
COPY ./config.js /code
COPY package.json /code

RUN npm install
RUN node node_modules/hslayers-ng/scripts/bootstrap-isolate.js



