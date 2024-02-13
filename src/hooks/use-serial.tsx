import { useRef } from "react";

export type UseSerialArgs = {
  init: number;
};

const USE_SERIAL_DEFAULT = {
  init: 1,
};

export function useSerial({ init }: UseSerialArgs = USE_SERIAL_DEFAULT) {
  const idRef = useRef(init);

  function getId() {
    return idRef.current++;
  }

  return {
    getId,
  };
}
