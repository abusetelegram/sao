FROM node:alpine

ENV GITHUB_USERNAME=
ENV GITHUB_PASSWORD=
ENV GIST_FILENAME=
ENV GIST_ID=
ENV BOT_TOKEN=
ENV BOT_NAME=
ENV TELEGRAM_USER_ID=

WORKDIR /usr/src/app
COPY . .

RUN yarn

CMD ["node", "main.js"]