# -- Build TypeScript --------------------------------------------------------
FROM node:16.4.2-slim AS build

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

RUN npm run build

# -- Run server --------------------------------------------------------------
FROM node:16.4.2-slim AS run

WORKDIR /app
EXPOSE 3000
ENV NODE_ENV production

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY --from=build /app/out /app/out

CMD [ "npm", "start" ]