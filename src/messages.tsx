import { Message } from "./types.ts";
import { filterTopic } from "./utils/mqtt-topic-filter.ts";

export type MessageProps = {
  filter?: string;
  messages: Message[];
  onRemove: (message: Message) => void;
};

export function Messages({ messages, onRemove, filter }: MessageProps) {
  const filteredMessages = filter
    ? messages.filter((m) => filterTopic(m.topic, filter))
    : messages;

  return (
    <>
      {filter && (
        <p>
          showing <strong>{filter}</strong> topic
        </p>
      )}
      {filteredMessages.map((message) => (
        <div key={message.id}>
          <h3>topic: {message.topic}</h3>
          <p>message: {message.message}</p>
          <button onClick={() => onRemove(message)}>remove</button>
        </div>
      ))}
    </>
  );
}
