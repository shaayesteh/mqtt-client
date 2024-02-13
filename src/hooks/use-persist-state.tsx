import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function usePersistState<S>(
  key: string,
  defaultValue: S,
): [S, Dispatch<SetStateAction<S>>];
export function usePersistState<S = undefined>(
  key: string,
): [S | undefined, Dispatch<SetStateAction<S | undefined>>];

export function usePersistState<S>(key: string, defaultValue?: S) {
  const item = localStorage.getItem(key);
  let init = defaultValue;

  try {
    init = item ? JSON.parse(item) : undefined;
  } catch (e) {
    /* empty */
  }

  const [value, setValue] = useState<S | undefined>(init);

  useEffect(() => {
    localStorage.setItem(
      key,
      typeof value == "string" ? value : JSON.stringify(value),
    );
  }, [key, value]);

  return [value, setValue] as const;
}
