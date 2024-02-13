import { useSerial } from "./use-serial.tsx";
import { Message } from "../types.ts";
import { usePersistState } from "./use-persist-state.tsx";

export function useMessages() {
  const [messages, setMessages] = usePersistState<Message[]>("messages", []);

  const { getId } = useSerial({ init: (messages.at(-1)?.id || 0) + 1 });

  function onMessageReceived(message: Omit<Message, "id">) {
    const id = getId();
    setMessages((messages) => {
      return [...messages, { ...message, id }];
    });
  }

  function removeMessage(message: Message) {
    setMessages((messages) => messages.filter((m) => m !== message));
  }

  return {
    messages,
    onMessageReceived,
    removeMessage,
  };
}
