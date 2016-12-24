FROM ubuntu:latest

MAINTAINER Aamir Latif <aamir@vendr.tech>

FROM node:alpine

RUN npm install sails -g

RUN mkdir -p /service/app
WORKDIR /service/app

COPY package.json /service/app
RUN npm install

COPY . /service/app

EXPOSE 80

CMD NODE_ENV=production sails lift