import { Show } from "solid-js";
import type { ParsedSkill } from "../types/app";
import { useAppContext } from "../context/appContext";
import { TYPE_TAG_TEXT_MAP } from "../constants/maps";
import { Cost } from "./Cost";
import { Children } from "./Children";
import { Description } from "./Token";
import { cardFaceUrl } from "../utils";

export const SkillBox = (props: { skill: ParsedSkill }) => {
  const { displayId, language = "zh" } = useAppContext();
  const skill = () => props.skill;
  return (
    <Show when={!skill().hidden}>
      <div class="skill-box figure">
        <div class="skill-type">
          {TYPE_TAG_TEXT_MAP[language][skill().type]}
        </div>
        {skill().playCost && <Cost type="skill" cost={skill().playCost} />}
        <div
          class="skill-icon"
          style={{
            "mask-image": `url("${cardFaceUrl(skill().icon ?? "")}")`,
          }}
        />
        <div class="skill-title">
          {skill().name}
          {displayId && <span class="id-box">ID: {skill().id}</span>}
        </div>
        <div class={`skill-description skill-description-${language}`}>
          <Description description={skill().parsedDescription} />
        </div>
        <Show when={skill().children.length > 0}>
          <Children children={skill().children} />
        </Show>
      </div>
    </Show>
  );
};
