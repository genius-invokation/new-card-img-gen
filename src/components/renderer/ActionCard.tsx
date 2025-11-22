import { Show, For } from "solid-js";
import type { ParsedActionCard } from "../../types";
import { useGlobalSettings } from "../../context";
import { Tag } from "./Tag";
import { Cost } from "./Cost";
import { CardFace } from "./CardFace";
import { Children } from "./Children";
import { Description } from "./Token";
import { Text } from "./Text";
import "./ActionCard.css";

export const ActionCard = (props: { card: ParsedActionCard }) => {
  const { displayId, language } = useGlobalSettings();
  const card = () => props.card;
  return (
    <div class="action-card">
      <div class="action-card-info figure">
        <div class="action-card-title">
          <Text text={card().name} />
          <Show when={displayId()}>
            <span class="id-box">ID: {card().id}</span>
          </Show>
        </div>
        <div class="action-card-tags">
          <Tag type="cardType" tag={card().type} />
          <For each={card().tags}>
            {(tag) => <Tag type="cardTag" tag={tag} />}
          </For>
        </div>
        <div class="dashed-line" />
        <div
          class={`action-card-description`}
          data-justify={["CHS", "CHT"].includes(language())}
        >
          <Description description={card().parsedDescription} />
        </div>
        <Show when={card().children.length > 0}>
          <Children children={card().children} />
        </Show>
      </div>
      <CardFace
        item={card()}
        isLegend={card().tags.includes("GCG_TAG_LEGEND")}
        class="action-card-image-container"
      >
        <Cost
          type="actionCard"
          cost={
            card().playCost.length === 0
              ? [{ type: "GCG_COST_DICE_SAME", count: 0 }]
              : card().playCost.length === 1 &&
                card().playCost[0].type === "GCG_COST_LEGEND"
              ? [{ type: "GCG_COST_DICE_SAME", count: 0 }, ...card().playCost]
              : card().playCost
          }
        />
      </CardFace>
    </div>
  );
};
