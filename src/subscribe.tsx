import { useState } from "react";
import { MqttClient } from "mqtt";

export type SubscribeProps = {
  client: MqttClient;
};

export function Subscribe({ client }: SubscribeProps) {
  const [topic, setTopic] = useState("");

  function subscribe() {
    client.subscribe("test/alish/response", (err, granteds) => {
      if (err) {
        alert("something went wrong for subscribing");
        return;
      }

      if (!granteds) {
        console.log("nothing granted");
        return;
      }

      for (const granted of granteds) {
        alert(`granted access to ${granted.topic}`);
      }
    });
  }

  return (
    <div style={{ border: "1px solid black" }}>
      <label htmlFor="topic">Topic</label>
      <input
        name="topic"
        id="topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button onClick={subscribe}>subscribe</button>
    </div>
  );
}
