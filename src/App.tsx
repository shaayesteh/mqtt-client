import mqtt, { MqttClient } from "mqtt";
import { useState } from "react";
import { Publish } from "./publish.tsx";
import { Subscribe } from "./subscribe.tsx";
import { Messages } from "./messages.tsx";
import { useMessages } from "./hooks/use-messages.tsx";

function App() {
  const [client, setClient] = useState<null | MqttClient>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(localStorage.getItem("address") || "");
  const { messages, onMessageReceived, removeMessage } = useMessages();

  function connect() {
    if (!address) {
      alert("address is empty");
      return;
    }

    try {
      setLoading(true);
      localStorage.setItem("address", address);
      const client = mqtt.connect(address, {
        protocolVersion: 5,
      });
      setClient(client);

      client.on("connect", () => {
        setConnected(true);
        setLoading(false);
      });

      client.on("message", (topic, message, packet) => {
        console.log(packet);
        onMessageReceived({
          topic,
          message: message.toString(),
          packet,
        });
      });

      client.on("end", () => {
        setConnected(false);
        setLoading(false);
      });

      client.on("error", () => {
        alert("error darim perdarsag");
      });
    } catch (e) {
      console.log(e);
      alert(
        typeof e === "object" && e && "message" in e
          ? e.message
          : "something went wrong",
      );
      setLoading(false);
    }
  }

  function disconnect() {
    client?.end();
  }

  return (
    <>
      <div>
        connect : {connected ? "connected" : "not connected yet"}
        <label htmlFor="address"></label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          id="address"
          type="text"
        />
        {connected ? (
          <button onClick={disconnect}>disconnect</button>
        ) : loading ? (
          "loading"
        ) : (
          <button onClick={connect}>connect</button>
        )}
      </div>
      {client && connected && (
        <>
          <Publish client={client} />
          <Subscribe client={client} />
          <Messages messages={messages} onRemove={removeMessage} />
        </>
      )}
    </>
  );
}

export default App;
