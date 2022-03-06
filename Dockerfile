FROM node:16.4.2-slim

WORKDIR /app

ENV NODE_ENV production
EXPOSE 3000

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

CMD ["bash", "-c", "npm start"]
