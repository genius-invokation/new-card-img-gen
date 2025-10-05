import type { PlayCost } from "@gi-tcg/static-data";
import { createEffect, createMemo, For, Index, Show } from "solid-js";
import { useFelteContext } from "./FelteFormWrapper";

export interface CostFieldProps {
  name: string;
}

const COST_TYPE_NAME_MAP: Record<string, string> = {
  GCG_COST_DICE_VOID: "无色",
  GCG_COST_DICE_CRYO: "冰",
  GCG_COST_DICE_HYDRO: "水",
  GCG_COST_DICE_PYRO: "火",
  GCG_COST_DICE_ELECTRO: "雷",
  GCG_COST_DICE_ANEMO: "风",
  GCG_COST_DICE_GEO: "岩",
  GCG_COST_DICE_DENDRO: "草",
  GCG_COST_DICE_SAME: "同色",
  GCG_COST_ENERGY: "能量",
  GCG_COST_LEGEND: "秘传",
  // GCG_COST_SPECIAL_ENERGY: "特殊能量",
};

export const PlayCostField = (props: CostFieldProps) => {
  const { data, addField, setFields, unsetField } = useFelteContext();

  const costItems = () => (data(props.name) as PlayCost[]) || [];

  // createEffect(() => console.log(costItems()));

  const ALL_COST_TYPES = Object.keys(COST_TYPE_NAME_MAP);

  // should not use `createMemo` since `costItems()` "reference" won't change
  const selectableTypes = (currentSelected?: string) => {
    const existsTypes = new Set(costItems().map((c) => c.type));
    const restTypes = ALL_COST_TYPES.filter(
      (t) => !existsTypes.has(t) || t === currentSelected,
    );
    return restTypes;
  };

  const addCostItem = () => {
    const newCostItem: PlayCost = { type: selectableTypes()[0], count: 1 };
    addField(props.name, newCostItem);
  };
  const deleteCostItem = (index: number) => {
    unsetField(`${props.name}.${index}`);
  };

  return (
    <div class="grid grid-cols-[auto_auto_auto] gap-2">
      <Index each={costItems()}>
        {(_, idx) => {
          const diceType = () => data(`${props.name}.${idx}.type`) as string;
          return (
            <>
              <select
                name={`${props.name}.${idx}.type`}
                class="select flex-grow"
              >
                <For each={selectableTypes(diceType())}>
                  {(type) => (
                    <option value={type} selected={diceType() === type}>
                      {COST_TYPE_NAME_MAP[type]}
                    </option>
                  )}
                </For>
              </select>
              <input
                type="number"
                min="1"
                name={`${props.name}.${idx}.count`}
                class="input"
              />
              <button
                type="button"
                class="btn btn-square btn-error btn-dash"
                onClick={() => deleteCostItem(idx)}
              >
                &cross;
              </button>
            </>
          );
        }}
      </Index>
      <button
        type="button"
        class="col-span-full btn btn-success btn-soft"
        onClick={addCostItem}
        disabled={selectableTypes().length === 0}
      >
        +
      </button>
    </div>
  );
};
