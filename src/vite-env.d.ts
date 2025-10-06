/// <reference types="vite/client" />

declare module "solid-js" {
  namespace JSX {
    interface DirectiveFunctions {
      form: (el: HTMLFormElement) => void;
      field: (el: HTMLElement) => void;
    }
  }
}

declare module "@gi-tcg/static-data" {
  interface CharacterRawData {
    cardFaceUrl?: string;
    iconUrl?: string;
  }

  interface SkillRawData {
    iconUrl?: string;
  }

  interface EntityRawData {
    cardFaceUrl?: string;
    buffIconUrl?: string;
  }

  interface ActionCardRawData {
    cardFaceUrl?: string;
  }
}

declare module "csstype" {
  interface StandardPropertiesHyphen {
    "anchor-name"?: string;
    "position-anchor"?: string;
  }
}

export {};
