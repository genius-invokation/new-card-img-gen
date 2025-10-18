import { createServer } from "vite";
import puppeteer from "puppeteer";
import path from "node:path";
import exitHook from "exit-hook";
import type { FormValue } from "../src/components/form/Forms";
import { Elysia, t } from "elysia";
import type {} from "../src/vite-env";
import type { Version } from "../src/types";

const server = await createServer({
  root: path.resolve(import.meta.dirname, ".."),
  server: {
    port: 1337,
    watch: null,
  },
});
await server.listen();
let address = server.httpServer?.address()!;
if (typeof address !== "string") {
  address = `http://localhost:${address.port}`;
}

const browser = import.meta.env.CHROMIUM_BROWSER_URL
  ? await puppeteer.connect({
      browserURL: import.meta.env.CHROMIUM_BROWSER_URL,
    })
  : await puppeteer.launch({
      // headless: false,
      args: ["--no-sandbox"],
    });
const page = await browser.newPage();
await page.goto(address, { waitUntil: "networkidle0" });

enum Language {
  CHS = "CHS",
  EN = "EN",
}

const bunServer = new Elysia()
  .onError(({ error }) => {
    return {
      success: false,
      error: "message" in error ? error.message : String(error),
    };
  })
  .post(
    "/render",
    async ({ body }) => {
      const data: FormValue = {
        general: {
          displayId: body.displayId ?? true,
          displayStory: body.displayStory ?? true,
          mode: body.id > 100000 ? "singleActionCard" : "character",
          characterId: body.id,
          actionCardId: body.id,
          cardbackImage:
            body.cardbackImage ?? "UI_Gcg_CardBack_Championship_11",
          language: body.language ?? "CHS",
          version: (body.version as Version) ?? "latest",
          authorName: body.authorName,
          authorImageUrl:
            body.authorImageUrl ?? new URL("./vite.svg", address).href,
        },
        newItems: {
          actionCards: [],
          characters: [],
          entities: [],
          keywords: [],
        },
      };
      return {
        success: true,
        url: await page.evaluate((data) => window.renderCardImage(data), data),
      };
    },
    {
      body: t.Object({
        id: t.Number(),
        language: t.Optional(t.Enum(Language)),
        cardbackImage: t.Optional(t.String()),
        version: t.Optional(t.String()),
        authorName: t.Optional(t.String()),
        authorImageUrl: t.Optional(t.String()),
        displayId: t.Optional(t.Boolean({ default: true })),
        displayStory: t.Optional(t.Boolean({ default: true })),
        mirroredLayout: t.Optional(t.Boolean({ default: false })),
      }),
    },
  )
  .listen(process.env.PORT || 3000);
console.log(
  `Elysia running at http://${bunServer.server?.hostname}:${bunServer.server?.port}`,
);

exitHook(() => {
  browser.close();
  server.close();
});
