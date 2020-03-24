FROM docker

RUN apk --update add --no-cache nodejs npm

COPY ./ /code/

WORKDIR /code/

RUN npm install
