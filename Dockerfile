FROM node:22-alpine

WORKDIR /usr/src

COPY ../package.json ./
RUN npm install

COPY ./Server ./Server
COPY ./Client ./Client

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]