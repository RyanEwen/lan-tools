FROM node:16.6.0

WORKDIR /usr/src/app

COPY ./ ./

# create production build
RUN npm ci -q
RUN npm run build-prod

# remove build files
RUN rm -rf src/
RUN npm ci -q --omit=dev

CMD ["node", "."]
