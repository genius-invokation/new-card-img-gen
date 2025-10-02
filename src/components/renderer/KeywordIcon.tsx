import { Show, Switch, Match, createMemo } from "solid-js";
import { useRenderContext } from "../../context";
import { entityIconUrl, type AnyChild } from "../../utils";
import "./KeywordIcon.css";

interface KeywordIconProps {
  item: AnyChild;
  class?: string;
}

export const KeywordIcon = (props: KeywordIconProps) => {
  const renderContext = useRenderContext();

  const prepareEntity = () =>
    renderContext().prepareSkillToEntityMap.get(props.item.id);

  // TODO: use a pre-calculated map
  const vehicleEntity = createMemo(() =>
    props.item.type === "GCG_SKILL_TAG_VEHICLE"
      ? renderContext().genericEntities.find(
          (et) =>
            "skills" in et && et.skills.find((sk) => sk.id === props.item.id),
        )
      : void 0,
  );

  const isSkillMask = () =>
    ["GCG_SKILL_TAG_A", "GCG_SKILL_TAG_E", "GCG_SKILL_TAG_Q"].includes(
      props.item.type,
    );

  return (
    <Show when={props.item.type !== "GCG_RULE_EXPLANATION"}>
      <Switch
        fallback={
          <img
            class={`buff-icon ${props.class || ""}`}
            src={entityIconUrl(props.item)}
          />
        }
      >
        <Match when={prepareEntity()}>
          {(ent) => (
            <img
              class={`buff-icon ${props.class || ""}`}
              src={entityIconUrl(ent() as AnyChild)}
            />
          )}
        </Match>
        <Match when={vehicleEntity()}>
          {(veh) => (
            <img
              class={`buff-icon ${props.class || ""}`}
              src={entityIconUrl(veh() as AnyChild)}
            />
          )}
        </Match>
        <Match when={isSkillMask()}>
          <div
            class={`buff-mask ${props.class || ""}`}
            style={{
              "mask-image": `url("${entityIconUrl(props.item)}")`,
            }}
          />
        </Match>
      </Switch>
    </Show>
  );
};
