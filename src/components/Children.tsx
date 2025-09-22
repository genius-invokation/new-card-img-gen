import { For } from 'solid-js';
import type { ParsedChild } from '../types/app';
import { useAppContext } from '../context/appContext';
import { KEYWORD_CARDBACK_BOTTOM, KEYWORD_CARDBACK_REPEAT, KEYWORD_CARD_FRAME, COST_READONLY_ENTITIES } from '../constants/maps';
import { KeywordIcon } from './KeywordIcon';
import { KeywordTag } from './KeywordTag';
import { Cost } from './Cost';
import { Description } from './Token';

const cardFaceUrl = (cardFace: string) => `images/${cardFace}.png`;

export const Children = (props: { children: ParsedChild[] }) => {
  const { displayId, language = 'zh', prepareSkillToEntityMap } = useAppContext();
  return (
    <div class="child-layout">
      <For each={props.children}>{(keyword) => (
        <div class="keyword-box-wrapper">
          <div class="keyword-line" />
          {'cardFace' in keyword && (keyword as any).cardFace && (
            <div class="keyword-card">
              <img src={KEYWORD_CARDBACK_BOTTOM} class="keyword-card-back-bottom" />
              <div class="keyword-card-back-repeat" style={{ '--image': `url("${KEYWORD_CARDBACK_REPEAT}")` }} />
              <img src={cardFaceUrl((keyword as any).cardFace)} class="keyword-card-face" />
              <img src={KEYWORD_CARD_FRAME} class="keyword-card-frame" />
            </div>
          )}
          <div class="keyword-box">
            <div class="keyword-buff-box">
              {!('cardFace' in keyword && (keyword as any).cardFace) && (
                <KeywordIcon id={(keyword as any).id} tag={'type' in keyword ? (keyword as any).type : 'GCG_RULE_EXPLANATION'} image={'buffIcon' in keyword ? (keyword as any).buffIcon : 'icon' in keyword ? (keyword as any).icon : undefined} />
              )}
              <div class="keyword-title-box">
                <div class="keyword-title">{(keyword as any).name}</div>
                <div class="keyword-tags">
                  <KeywordTag tag={'type' in keyword ? (keyword as any).type : 'GCG_RULE_EXPLANATION'} />
                  {'tags' in keyword && (keyword as any).tags.map((tag: string) => <KeywordTag tag={tag} />)}
                  {prepareSkillToEntityMap.has((keyword as any).id) && <KeywordTag tag="GCG_TAG_PREPARE_SKILL" />}
                  {displayId && (
                    <div class="id-box"><div class="keyword-tag-text">ID: {(keyword as any).id}</div></div>
                  )}
                  {prepareSkillToEntityMap.has((keyword as any).id) && displayId && (
                    <div class="id-box"><div class="keyword-tag-text">ID: {prepareSkillToEntityMap.get((keyword as any).id)}</div></div>
                  )}
                </div>
              </div>
            </div>
            {'playCost' in keyword && (
              <Cost type="keyword" cost={(keyword as any).playCost.length === 0 ? [{ type: 'GCG_COST_DICE_SAME', count: 0 }] : (keyword as any).playCost} readonly={COST_READONLY_ENTITIES.includes((keyword as any).id) || prepareSkillToEntityMap.has((keyword as any).id)} />
            )}
            <div class={`keyword-description keyword-description-${language}`}>
              <Description description={(keyword as any).parsedDescription} />
            </div>
          </div>
        </div>
      )}</For>
    </div>
  );
};
