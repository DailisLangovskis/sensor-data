FROM node:10.16-alpine

RUN apk --update add --no-cache git nodejs npm make g++

ARG LAYMAN_GS_HOST
ARG LAYMAN_GS_PORT

RUN mkdir /code


COPY src /code/src
COPY package.json /code
COPY node_modules /code/node_modules

WORKDIR /code

RUN npm install
RUN node node_modules/hslayers-ng/scripts/bootstrap-isolate.js


