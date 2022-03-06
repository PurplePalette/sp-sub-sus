FROM node:16.4.2

WORKDIR /app

ENV NODE_ENV production
EXPOSE 3000

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

CMD ["bash", "-c", "source .env && npm start"]