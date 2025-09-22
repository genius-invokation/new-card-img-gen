import { useAppContext } from '../context/appContext';
import { MISSING_ICONS_URL, TYPE_TAG_IMG_NAME_MAP } from '../constants/maps';
import { cardFaceUrl, tagImageUrl } from '../utils';

export const KeywordIcon = (props: { id: number; tag: string; image?: string; className?: string }) => {
  const { prepareSkillToEntityMap, data } = useAppContext();
  const chooseImage = (id: number, image?: string) => image ? cardFaceUrl(image) : id in MISSING_ICONS_URL ? MISSING_ICONS_URL[id] : tagImageUrl('GCG_CARD_EVENT');
  if (props.tag === 'GCG_RULE_EXPLANATION') return <></>;
  if (prepareSkillToEntityMap.get(props.id)) {
    const prepareState = data.entities.find(e => e.id === prepareSkillToEntityMap.get(props.id));
    return prepareState ? <img class="buff-icon" src={chooseImage(prepareState.id, (prepareState as any).buffIcon)} /> : <></>;
  } else if (props.tag === 'GCG_SKILL_TAG_VEHICLE') {
    const vehicleCard = data.entities.find(e => e.id === Number(props.id.toString().slice(0, -1)));
    return <img class="buff-icon" src={chooseImage(vehicleCard ? vehicleCard.id : props.id, vehicleCard ? (vehicleCard as any).buffIcon : props.image)} />;
  } else if ([ 'GCG_SKILL_TAG_A', 'GCG_SKILL_TAG_E', 'GCG_SKILL_TAG_Q'].includes(props.tag)) {
    return <div class="buff-mask" style={{ 'mask-image': `url("${chooseImage(props.id, props.image)}")` }} />;
  } else {
    return <img class="buff-icon" src={chooseImage(props.id, props.image)} />;
  }
};
