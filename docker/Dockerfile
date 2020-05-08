FROM node:10.16-alpine

RUN apk --update add --no-cache git openssh nodejs npm make

ARG LAYMAN_GS_HOST
ARG LAYMAN_GS_PORT

RUN mkdir /code
WORKDIR /code

COPY ./src /code/src
COPY package.json /code

RUN npm install
RUN node node_modules/hslayers-ng/scripts/bootstrap-isolate.js



