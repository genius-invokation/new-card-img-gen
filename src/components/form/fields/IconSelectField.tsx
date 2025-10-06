import { createUniqueId, For, Match, Show, Switch } from "solid-js";
import { assetsImageUrl } from "../../../utils";
import { useFieldContext } from "../shared";

const Icon = (props: { useMask?: boolean; src: string }) => {
  return (
    <Switch>
      <Match when={props.useMask}>
        <div
          class="w-8 h-8 mask-contain mask-center mask-(--mask-url) bg-neutral"
          style={{
            "--mask-url": `url(${props.src})`,
          }}
        />
      </Match>
      <Match when={true}>
        <img class="w-8 h-8" src={props.src} />
      </Match>
    </Switch>
  );
};

export interface IconSelectFieldProps {
  iconNames: string[];
  useMask?: boolean;
}

export default function IconSelectField(props: IconSelectFieldProps) {
  const field = useFieldContext<string | undefined>();

  const value = () => field().state.value;
  const setValue = (v?: string | undefined) => field().handleChange(v);

  let dropdown!: HTMLUListElement;
  const dropdownId = createUniqueId();

  return (
    <>
      <button
        type="button"
        class="select w-min"
        popoverTarget={dropdownId}
        style={{
          "anchor-name": `--${dropdownId}`,
        }}
      >
        <Show
          when={value()}
          fallback={<span class="whitespace-nowrap">使用自定义图标</span>}
        >
          {(value) => (
            <Icon useMask={props.useMask} src={assetsImageUrl(value())} />
          )}
        </Show>
      </button>
      <ul
        class="dropdown menu bg-base-100 rounded-box z-1 p-2 shadow-sm grid grid-cols-4 gap-2"
        popover
        id={dropdownId}
        style={{
          "position-anchor": `--${dropdownId}`,
        }}
        ref={dropdown}
      >
        <For each={props.iconNames}>
          {(iconName) => (
            <li
              class="btn btn-sm btn-shadow btn-square data-selected:btn-secondary"
              bool:data-selected={value() === iconName}
              onClick={() => {
                setValue(iconName);
                dropdown.hidePopover();
              }}
            >
              <Icon useMask={props.useMask} src={assetsImageUrl(iconName)} />
            </li>
          )}
        </For>
        <li
          class="btn btn-sm btn-shadow btn-square data-selected:btn-secondary"
          bool:data-selected={!value()}
          onClick={() => {
            setValue();
            dropdown.hidePopover();
          }}
          title="自定义图标"
        >
          …
        </li>
      </ul>
    </>
  );
}
