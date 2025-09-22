import { Show } from 'solid-js';
import { TYPE_TAG_TEXT_MAP } from '../constants/maps';
import { useAppContext } from '../context/appContext';
import { buffImageUrl, tagImageUrl } from '../utils';

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
