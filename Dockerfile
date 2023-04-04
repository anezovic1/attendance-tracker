FROM node:latest

WORKDIR ./project/js

COPY ./js/package*.json ./
RUN npm install

COPY . ..

EXPOSE 8080
CMD ["node", "index.js"]