FROM node:10.16-alpine

RUN apk --update add --no-cache git openssh nodejs npm make

ARG LAYMAN_GS_HOST
ARG LAYMAN_GS_PORT

RUN mkdir /code

COPY ./ /code/

WORKDIR /code

RUN npm install


