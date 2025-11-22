import { Show, Switch, Match, For } from "solid-js";
import { useRenderContext } from "../../context";
import type { DescriptionToken, ParsedDescription } from "../../types";
import { DESCRIPTION_ICON_IMAGES } from "../../constants";
import { remapColors } from "../../parser";
import { nar, tagImageUrl } from "../../utils";
import { Text } from "./Text";
import "./Token.css";

export const Token = (props: { token: DescriptionToken }) => {
  const renderContext = useRenderContext();
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
              <Text text={t().text} />
            </span>
          )}
        </Match>
        <Match when={nar(t, (t) => t.type === "boxedKeyword")}>
          {(t) => (
            <span class="description-variable">
              <Text text={t().text} />
            </span>
          )}
        </Match>
        <Match when={nar(t, (t) => t.type === "icon")}>
          {(t) =>
            (() => {
              const def = DESCRIPTION_ICON_IMAGES[t().id] || {};
              return (
                <Switch>
                  <Match when={def.imageUrl}>
                    <span class="icon-nobreak">
                      <img class="description-icon" src={def.imageUrl} />
                      &nbsp;
                    </span>
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
                    >
                      &nbsp;
                    </span>
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
              <Text text={renderContext().names.get(t().id) || `#${t().id}`} />
            </span>
          )}
        </Match>
        <Match when={t().type === "lineBreak"}>
          <br />
        </Match>
        <Match when={nar(t, (t) => t.type === "errored")}>
          {(t) => (
            <span class="description-token description-errored">
              <Text text={t().text} />
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
