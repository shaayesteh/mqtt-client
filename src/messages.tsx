import { Message } from "./types.ts";

export type MessageProps = {
  messages: Message[];
  onRemove: (message: Message) => void;
};

export function Messages({ messages, onRemove }: MessageProps) {
  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          <h3>topic: {message.topic}</h3>
          <p>message: {message.message}</p>
          <button onClick={() => onRemove(message)}>remove</button>
        </div>
      ))}
    </>
  );
}
