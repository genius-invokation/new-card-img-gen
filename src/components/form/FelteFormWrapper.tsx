/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  Form,
  Traverse,
  Paths,
  FormConfigWithoutTransformFn,
  KnownHelpers,
} from "@felte/core";
import type { KnownStores } from "../../../node_modules/@felte/solid/dist/esm/create-accessor.d.ts";
import { createForm as createFormFelte } from "@felte/solid";
import {
  createContext,
  useContext,
  type Component,
  type ComponentProps,
} from "solid-js";

type FelteAccessor<T extends Record<string, any>> = (<R>(
  selector: (storeValue: T) => R,
) => R) &
  (<P extends Paths<T> = Paths<T>, V extends Traverse<T, P> = Traverse<T, P>>(
    path: P,
  ) => V) &
  ((path: string) => any) &
  (() => T);

export type FelteContextValue<Data extends Record<string, any>> = Omit<
  Form<Data>,
  "form"
> &
  KnownHelpers<Data, Paths<Data>> &
  Omit<KnownStores<Data>, "data"> & {
    data: FelteAccessor<Data>;
  };

export interface FelteFormProps<Data extends Record<string, any>>
  extends ComponentProps<"form"> {
  config: FormConfigWithoutTransformFn<Data>;
}

// Felte do not have a good way to pass data from "form" "ViewModel" to custom field "View".
// https://github.com/pablo-abc/felte/issues/202
// So we write a createContext here thus field can fetch `{ data }` from `useContext`.

const FelteContext = createContext<unknown>();

export const useFelteContext = <Data extends Record<string, any>>() => {
  const value = useContext(FelteContext);
  if (!value) {
    throw new Error("useFelteContext must be used within a FelteForm");
  }
  return value as FelteContextValue<Data>;
};

export const createForm = <Data extends Record<string, any>>(
  config: FormConfigWithoutTransformFn<Data>,
): [Component<ComponentProps<"form">>, FelteContextValue<Data>] => {
  const { form, ...rest } = createFormFelte<Data>(config);
  void form;
  return [
    (props) => (
      <FelteContext.Provider value={rest}>
        <form use:form {...props} />
      </FelteContext.Provider>
    ),
    rest as unknown as FelteContextValue<Data>,
  ];
};
