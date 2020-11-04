FROM node:12-alpine

####################################################
# runtime dependencies

RUN apk --no-cache add multirun

RUN apk --no-cache add curl \
 && curl -fsSLO "$SUPERCRONIC_URL" \
 && echo "${SUPERCRONIC_SHA1SUM}  ${SUPERCRONIC}" | sha1sum -c - \
 && chmod +x "$SUPERCRONIC" \
 && mv "$SUPERCRONIC" "/usr/local/bin/${SUPERCRONIC}" \
 && ln -s "/usr/local/bin/${SUPERCRONIC}" /usr/local/bin/supercronic \
 && apk del curl

WORKDIR /app

####################################################
# apps dependencies

COPY package.json package-lock.json ./
RUN npm install

####################################################
# apps code

COPY src src

####################################################
# docker setup

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

ENV NODE_ENV=production \
    PORT=8080 \
    INBOX_DIR=/app/data/inbox \
    EXPORTS_DIR=/app/data/exports \
    DB_URL=

EXPOSE 8080

CMD [ "multirun", "node /app/src/server.js", "supercronic /app/src/cron" ]
