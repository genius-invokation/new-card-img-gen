import { PAGE_TITLE_ICON } from "../constants";
import { Text } from "./Text";

export const PageTitle = (props: { text: string }) => (
  <div class="page-title-wrapper">
    <img class="page-title-icon" src={PAGE_TITLE_ICON} />
    <div class="page-title">
      <Text text={props.text} />
    </div>
    <div class="page-title-tail">
      <svg width="80" height="192">
        <polyline
          points="0,37.2 8,37.2 69,96 8,156 0,156"
          fill="#f7f7ebbb"
          stroke="#ded3c3ff"
          stroke-width="6"
        />
      </svg>
    </div>
  </div>
);
