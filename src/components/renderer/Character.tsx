import { For, Show, createMemo } from "solid-js";
import type { ParsedCharacter } from "../../types";
import { useGlobalSettings } from "../../context";
import {
  AVATAR_CARD_ENERGY,
  AVATAR_CARD_HP,
  SPECIAL_ENERGY_MAP,
} from "../../constants";
import { SkillBox } from "./SkillBox";
import { CardFace } from "./CardFace";
import { Tag } from "./Tag";
import { Text } from "./Text";
import "./Character.css";

export const Character = (props: { character: ParsedCharacter }) => {
  const { displayId, displayStory, language } = useGlobalSettings();
  const character = () => props.character;
  const skillsMemo = createMemo(() => character().parsedSkills);
  const normalSkill = createMemo(() => skillsMemo()[0]);
  const otherSkills = createMemo(() => skillsMemo().slice(1));
  return (
    <div class="character">
      <div class="character-header">
        <CardFace
          class="character-image-container"
          item={character()}
        >
          <div class="avatar-card-hp">
            <img src={AVATAR_CARD_HP} class="avatar-card-hp-image" />
            <div class="stroked-text-top">{character().hp}</div>
            <div class="stroked-text-bottom">{character().hp}</div>
          </div>
          <div class="energy-bar">
            <For
              each={Array.from({
                length:
                  character().id in SPECIAL_ENERGY_MAP
                    ? SPECIAL_ENERGY_MAP[character().id].count
                    : character().maxEnergy,
              })}
            >
              {() => (
                <img
                  src={
                    character().id in SPECIAL_ENERGY_MAP
                      ? SPECIAL_ENERGY_MAP[character().id].type
                      : AVATAR_CARD_ENERGY
                  }
                  class="energy"
                />
              )}
            </For>
          </div>
        </CardFace>
        <div class="character-info">
          <div class="character-title-wrapper">
            <div class="character-title">
              <Text text={character().name} />
              <Show when={displayId()}>
                <span> </span>
                <span class="id-box">ID: {character().id}</span>
              </Show>
            </div>
          </div>
          <div class="character-tags">
            <For each={character().tags}>
              {(tag) => <Tag type="character" tag={tag} />}
            </For>
          </div>
          <hr class="info-divider" />
          <p 
            class="info-story"
            data-justify={["CHS", "CHT"].includes(language())}
          >
            <Show when={displayStory()}>
              <Text text={character().storyText} />
            </Show>
          </p>
          <div class="spacer" />
          <Show when={normalSkill()}>
            {(sk: () => ParsedCharacter["parsedSkills"][number]) => (
              <SkillBox skill={sk()} />
            )}
          </Show>
        </div>
      </div>
      <For each={otherSkills()}>{(sk) => <SkillBox skill={sk} />}</For>
    </div>
  );
};
