/// <reference types="vite/client" />

declare module "solid-js" {
  namespace JSX {
    interface DirectiveFunctions {
      form: (el: HTMLFormElement) => void;
      field: (el: HTMLElement) => void;
    }
  }
}

export {};
