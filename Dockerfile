FROM node:6-alpine
RUN apk update && apk add python make g++
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

COPY . .
CMD ["node", "server.js"]