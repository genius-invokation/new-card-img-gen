import { Show, Switch, Match, For, type Accessor } from "solid-js";
import { useAppContext } from "../context/appContext";
import type { DescriptionToken, ParsedDescription } from "../types/app";
import { DESCRIPTION_ICON_IMAGES } from "../constants/maps";
import { remapColors } from "../parsers/description";
import { nar, tagImageUrl } from "../utils";


export const Token = (props: { token: DescriptionToken }) => {
  const { names } = useAppContext();
  const t = () => props.token;
  return (
    <Show when={t().type}>
      <Switch fallback={<></>}>
        <Match when={nar(t, (t) => t.type === "plain")}>
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
        <Match when={nar(t, (t) => t.type === "boxedKeyword")}>
          {(t) => <span class="description-variable">{t().text}</span>}
        </Match>
        <Match when={nar(t, (t) => t.type === "icon")}>
          {(t) =>
            (() => {
              const def = DESCRIPTION_ICON_IMAGES[t().id] || {};
              return (
                <Switch>
                  <Match when={def.imageUrl}>
                    <img class="description-icon" src={def.imageUrl} />
                  </Match>
                  <Match when={def.tagIcon}>
                    <span
                      class={`description-icon-tag ${
                        t().overrideStyle()
                          ? "description-" + t().overrideStyle()
                          : ""
                      }`}
                      style={{
                        "--image": `url("${tagImageUrl(def.tagIcon!)}")`,
                      }}
                    />
                  </Match>
                </Switch>
              );
            })()
          }
        </Match>
        <Match when={nar(t, (t) => t.type === "reference")}>
          {(t) => (
            <span
              class={`description-token ref-${t().refType} ${
                t().overrideStyle() ? "description-" + t().overrideStyle() : ""
              }`}
              style={{ "--manual-color": t().manualColor || "" }}
            >
              {names.get(t().id) || `#${t().id}`}
            </span>
          )}
        </Match>
        <Match when={t().type === "lineBreak"}>
          <br />
        </Match>
        <Match when={nar(t, (t) => t.type === "errored")}>
          {(t) => (
            <span class="description-token description-errored">
              {t().text}
            </span>
          )}
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
