FROM node:20

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules && npm install

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]

EXPOSE 5173