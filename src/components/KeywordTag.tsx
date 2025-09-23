import { Show } from "solid-js";
import { TYPE_TAG_TEXT_MAP } from "../constants/maps";
import { useAppContext } from "../context/appContext";

export const KeywordTag = (props: {
  tag: string;
  image?: string;
  className?: string;
}) => {
  const { language } = useAppContext();
  return (
    <Show when={TYPE_TAG_TEXT_MAP[language][props.tag]}>
      <div class={`keyword-tag ${props.className ?? ""}`}>
        <div class="keyword-tag-text">
          {TYPE_TAG_TEXT_MAP[language][props.tag]}
        </div>
      </div>
    </Show>
  );
};
