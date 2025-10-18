FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
ENV NODE_ENV=production
EXPOSE 1337 3000
CMD ["bun", "scripts/server.ts"]
