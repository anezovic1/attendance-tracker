FROM node:latest

WORKDIR ./project/

COPY ./package*.json ./
RUN npm install

COPY . ..

EXPOSE 8080
CMD ["node", "index.js"]