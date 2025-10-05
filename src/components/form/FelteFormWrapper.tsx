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
  createEffect,
  createMemo,
  on,
  untrack,
  useContext,
  type Accessor,
  type Component,
  type ComponentProps,
  type Setter,
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

export interface FieldBindingsOption<T> {
  equal?: (a: T, b: T) => boolean;
  setterGuard?: (value: unknown) => value is T;
}

/**
 * Creates a two way binding from Custom field's value signal to Felte's form data.
 * 
 * ## Example
 * ```ts
 * // eslint-disable-next-line solid/reactivity
 * const name = props.name;
 * const [value, setValue] = createSignal<string>("");
 * createFieldBindings<string>(name, value, setValue);
 * ```
 * 
 * @param name The name of this field
 * @param getter A signal getter that will be tracked to update formData
 * @param setter A setter function will be called when formData changes
 * @param option.equal A function to compare whether two values are equal. Default to `===`. 
 */
export const createFieldBindings = <FieldType,>(
  name: string,
  getter: Accessor<FieldType>,
  setter: (formValue: FieldType) => void,
  option?: FieldBindingsOption<FieldType>,
) => {
  const { setFields, data } = useFelteContext<any>();
  const equal = option?.equal ?? ((a, b) => a === b);
  const formValue = createMemo(() => data(name));
  const setterGuard =
    option?.setterGuard ?? ((value): value is FieldType => true);
  // field value -> form
  createEffect(
    on(
      getter,
      (value) => {
        const currentValue = formValue();
        if (!equal(value, currentValue)) {
          setFields(name, value);
        }
      },
      {
        // Do not 'propagate' initial field value to form
        defer: true,
      },
    ),
  );
  // form -> field value
  createEffect(() => {
    const value = untrack(getter);
    const currentValue = formValue();
    if (!equal(value, currentValue) && setterGuard(value)) {
      setter(currentValue);
    }
  });
};
