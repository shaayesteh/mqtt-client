import { MqttClient } from "mqtt";
import { usePersistState } from "./use-persist-state.tsx";

export type UseSubscribeArgs = {
  client: MqttClient;
};

export function useSubscribe({ client }: UseSubscribeArgs) {
  const [topics, setTopics] = usePersistState<string[]>("topics", []);

  function subscribe(topic: string) {
    client.subscribe(topic, (err, granted) => {
      if (err) {
        alert("something went wrong for subscribing");
        return;
      }

      if (!granted) {
        return;
      }

      setTopics((topics) => [...topics, ...granted.map((g) => g.topic)]);
    });
  }

  function unsubscribe(topic: string) {
    setTopics((topics) => topics.filter((t) => t !== topic));
  }

  return {
    topics,
    subscribe,
    unsubscribe,
  };
}
