import { Show, Switch, Match, For } from "solid-js";
import { useAppContext } from "../context/appContext";
import type { DescriptionToken, ParsedDescription } from "../types/app";
import { DESCRIPTION_ICON_IMAGES } from "../constants/maps";
import { remapColors } from "../parsers/description";
import { tagImageUrl } from "../utils";

export const Token = (props: { token: DescriptionToken }) => {
  const { names } = useAppContext();
  const t = () => props.token;
  return (
    <Show when={t().type}>
      <Switch fallback={<></>}>
        <Match
          when={
            t().type === "plain" &&
            (t() as DescriptionToken & { type: "plain" })
          }
        >
          {(t) => (
            <span
              class={`description-${t().style()}`}
              style={{
                "--color": remapColors({ color: t().color }) || "",
                "--outline":
                  remapColors({ color: t().color, style: "outline" }) || "",
              }}
            >
              {t().text}
            </span>
          )}
        </Match>
        <Match when={t().type === "boxedKeyword"}>
          <span class="description-variable">{(t() as any).text}</span>
        </Match>
        <Match when={t().type === "icon"}>
          {(() => {
            const def = DESCRIPTION_ICON_IMAGES[(t() as any).id] || {};
            return (
              <Switch>
                <Match when={def.imageUrl}>
                  <img class="description-icon" src={def.imageUrl} />
                </Match>
                <Match when={def.tagIcon}>
                  <span
                    class={`description-icon-tag ${
                      (t() as any).overrideStyle()
                        ? "description-" + (t() as any).overrideStyle()
                        : ""
                    }`}
                    style={{ "--image": `url("${tagImageUrl(def.tagIcon!)}")` }}
                  />
                </Match>
              </Switch>
            );
          })()}
        </Match>
        <Match when={t().type === "reference"}>
          <span
            class={`description-token ref-${(t() as any).refType} ${
              (t() as any).overrideStyle()
                ? "description-" + (t() as any).overrideStyle()
                : ""
            }`}
            style={{ "--manual-color": (t() as any).manualColor || "" }}
          >
            {names.get((t() as any).id) || `#${(t() as any).id}`}
          </span>
        </Match>
        <Match when={t().type === "lineBreak"}>
          <br />
        </Match>
        <Match when={t().type === "errored"}>
          <span class="description-token description-errored">
            {(t() as any).text}
          </span>
        </Match>
      </Switch>
    </Show>
  );
};

export const Description = (props: { description: ParsedDescription }) => (
  <>
    <For each={props.description}>{(token) => <Token token={token} />}</For>
  </>
);
