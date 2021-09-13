FROM node:14.17.3

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install -q

RUN npm run build-prod

CMD ["npm", "start"]
