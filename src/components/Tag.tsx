import { Show } from "solid-js";
import { TYPE_TAG_TEXT_MAP } from "../constants";
import { useGlobalSettings } from "../context";
import { tagImageUrl } from "../utils";
import { Text } from "./Text";
import "./Tag.css";

export const Tag = (props: {
  type: "character" | "cardType" | "cardTag";
  tag: string;
  className?: string;
}) => {
  const { language } = useGlobalSettings();
  return (
    <Show when={TYPE_TAG_TEXT_MAP[language()][props.tag]}>
      <div class={`tag ${props.className ?? ""}`} data-tag-type={props.type}>
        <div class="tag-icon-container">
          <Show
            when={props.tag.startsWith("GCG_TAG_ELEMENT_")}
            fallback={
              <div
                class="tag-icon-mask"
                style={{ "--image": `url("${tagImageUrl(props.tag)}")` }}
              />
            }
          >
            <img class="tag-icon-image" src={tagImageUrl(props.tag)} />
          </Show>
        </div>
        <div class="tag-text">
          <Text text={TYPE_TAG_TEXT_MAP[language()][props.tag]} />
        </div>
      </div>
    </Show>
  );
};
