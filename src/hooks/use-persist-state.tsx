import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { isCallable } from "../utils/is-callable.ts";

export function usePersistState<S>(
  key: string,
  defaultValue: S | (() => S),
): [S, Dispatch<SetStateAction<S>>];
export function usePersistState<S = undefined>(
  key: string,
): [S | undefined, Dispatch<SetStateAction<S | undefined>>];

export function usePersistState<S>(key: string, defaultValue?: S | (() => S)) {
  const [value, setValue] = useState<S | undefined>(() => {
    const item = localStorage.getItem(key);

    try {
      return item
        ? JSON.parse(item)
        : isCallable(defaultValue)
          ? defaultValue()
          : defaultValue;
    } catch (e) {
      return item;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      key,
      typeof value == "string" ? value : JSON.stringify(value),
    );
  }, [key, value]);

  return [value, setValue] as const;
}
