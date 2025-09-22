import { Show, Switch, Match } from 'solid-js';
import { useAppContext } from '../context/appContext';
import { MISSING_ICONS_URL } from '../constants/maps';
import { cardFaceUrl, tagImageUrl } from '../utils';

interface KeywordIconProps {
  id: number;
  tag: string;
  image?: string;
  class?: string; // prefer class prop
}

export const KeywordIcon = (props: KeywordIconProps) => {
  const { prepareSkillToEntityMap, data } = useAppContext();

  const chooseImage = (id: number, image?: string) =>
    image
      ? cardFaceUrl(image)
      : id in MISSING_ICONS_URL
      ? MISSING_ICONS_URL[id]
      : tagImageUrl('GCG_CARD_EVENT');

  const prepareEntityId = () => prepareSkillToEntityMap.get(props.id);
  const prepareEntity = () => data.entities.find(e => e.id === prepareEntityId());
  const vehicleEntity = () =>
    props.tag === 'GCG_SKILL_TAG_VEHICLE'
      ? data.entities.find(e => e.id === Number(props.id.toString().slice(0, -1)))
      : undefined;

  const getBuffIcon = (e: { id: number } | undefined, fallback?: string) => {
    // Some entity records may expose buffIcon dynamically; treat as optional string property
    return (e && (e as unknown as { buffIcon?: string }).buffIcon) || fallback;
  };
  const isSkillMask = () => ['GCG_SKILL_TAG_A', 'GCG_SKILL_TAG_E', 'GCG_SKILL_TAG_Q'].includes(props.tag);

  return (
    <Show when={props.tag !== 'GCG_RULE_EXPLANATION'}>
      <Switch fallback={<img class={`buff-icon ${props.class || ''}`} src={chooseImage(props.id, props.image)} />}>        
        <Match when={prepareEntity()}>
          {(ent) => (
            <img
              class={`buff-icon ${props.class || ''}`}
              src={chooseImage(ent().id, getBuffIcon(ent()))}
            />
          )}
        </Match>
        <Match when={vehicleEntity()}>
          {(veh) => (
            <img
              class={`buff-icon ${props.class || ''}`}
              src={chooseImage(veh().id, getBuffIcon(veh(), props.image))}
            />
          )}
        </Match>
        <Match when={isSkillMask()}>
          <div
            class={`buff-mask ${props.class || ''}`}
            style={{ 'mask-image': `url("${chooseImage(props.id, props.image)}")` }}
          />
        </Match>
      </Switch>
    </Show>
  );
};
