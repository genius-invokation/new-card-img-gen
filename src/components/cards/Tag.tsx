import { Show } from 'solid-js';
import { TYPE_TAG_TEXT_MAP, TYPE_TAG_IMG_NAME_MAP } from '../../constants/maps';
import { useAppContext } from '../../context/appContext';

const tagImageUrl = (tag: string) => `/assets/UI_Gcg_Tag_${TYPE_TAG_IMG_NAME_MAP[tag]}.png`;
const buffImageUrl = (buff: string) => `/assets/UI_Gcg_Buff_Common_${TYPE_TAG_IMG_NAME_MAP[buff]}.png`;

export const Tag = (props: { type: 'character' | 'cardType' | 'cardTag'; tag: string; className?: string }) => {
  const { language = 'zh' } = useAppContext();
  return (
    <Show when={TYPE_TAG_TEXT_MAP[language][props.tag]}>
      <div class={`tag ${props.className ?? ''}`} data-tag-type={props.type}>
        <div class="tag-icon-container">
          <Show when={props.tag.startsWith('GCG_TAG_ELEMENT_')} fallback={<div class="tag-icon-mask" style={{ '--image': `url("${tagImageUrl(props.tag)}")` }} />}> 
            <img class="tag-icon-image" src={buffImageUrl(props.tag)} />
          </Show>
        </div>
        <div class="tag-text">{TYPE_TAG_TEXT_MAP[language][props.tag]}</div>
      </div>
    </Show>
  );
};
