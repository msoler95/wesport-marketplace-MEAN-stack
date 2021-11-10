FROM node:6.10-alpine

WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["npm install"]
CMD ["node", "server.js"]