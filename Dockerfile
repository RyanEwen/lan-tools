FROM node:16.6.0

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install -q

RUN npm run build-prod

CMD ["node", "."]
