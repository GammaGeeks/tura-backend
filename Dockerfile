FROM node:20

WORKDIR /user/src/app

COPY . .

RUN npm install

RUN npm run build

RUN rm -rf ./src

EXPOSE 3000

CMD ["npm", "run", "start:prod"]