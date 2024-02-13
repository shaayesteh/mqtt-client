import { useEffect, useState } from "react";

export type UseArrayStorageArgs = {
  key: string;
};

export function useArrayStorage<TData>({ key }: UseArrayStorageArgs) {
  let init = [];
  try {
    init = JSON.parse(localStorage.getItem(key) || "[]");
  } catch (e) {
    console.error("error parsing local storage", e);
  }

  const [value, setValue] = useState<TData[]>(init);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
