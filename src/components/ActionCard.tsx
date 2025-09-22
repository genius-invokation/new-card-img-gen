import { Show, For } from 'solid-js';
import type { ParsedActionCard } from '../types/app';
import { useAppContext } from '../context/appContext';
import { Tag } from './Tag';
import { Cost } from './Cost';
import { CardFace } from './CardFace';
import { Children } from './Children';
import { Description } from './Token';

export const ActionCard = (props: { card: ParsedActionCard }) => {
  const { displayId, language = 'zh' } = useAppContext();
  const card = () => props.card;
  return (
    <div class="action-card">
      <div class="action-card-info figure">
        <div class="action-card-title">
          {card().name}
          {displayId && <span class="id-box">ID: {card().id}</span>}
        </div>
        <div class="action-card-tags">
          <Tag type="cardType" tag={card().type} />
          <For each={card().tags}>{(tag) => <Tag type="cardTag" tag={tag} />}</For>
        </div>
        <div class="dashed-line" />
        <div class={`action-card-description action-card-description-${language}`}>
          <Description description={card().parsedDescription} />
        </div>
        <Show when={card().children.length > 0}>
          <Children children={card().children} />
        </Show>
      </div>
      <CardFace isLegend={card().tags.includes('GCG_TAG_LEGEND')} className="action-card-image-container" cardFace={card().cardFace}>
        <Cost type="actionCard" cost={card().playCost.length === 0 ? [{ type: 'GCG_COST_DICE_SAME', count: 0 }] : card().playCost.length === 1 && card().playCost[0].type === 'GCG_COST_LEGEND' ? [{ type: 'GCG_COST_DICE_SAME', count: 0 }, ...card().playCost] : card().playCost} />
      </CardFace>
    </div>
  );
};
