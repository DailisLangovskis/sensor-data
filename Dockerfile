FROM node:10.16-alpine

RUN apk add --no-cache git
RUN npm i pm2 -g

ARG LAYMAN_GS_HOST
ARG LAYMAN_GS_PORT

RUN mkdir /code
WORKDIR /code

ADD src /code/src
ADD package.json /code
ADD node_modules /code/node_modules

ENTRYPOINT ["pm2", "--no-daemon", "start", "/code/src/ecosystem.config.js"]

