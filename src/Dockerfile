FROM node:10.16-alpine

RUN apk clean apk update apk add --no-cache git npm nodejs npm make

ARG LAYMAN_GS_HOST
ARG LAYMAN_GS_PORT

RUN mkdir /code

COPY ./ /code/
COPY package.json /code
COPY node_modules /code/node_modules

WORKDIR /code

# RUN npm install
RUN npm run serve-dev


