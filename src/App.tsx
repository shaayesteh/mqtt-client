import { Publish } from "./publish.tsx";
import { Subscribe } from "./subscribe.tsx";
import { Messages } from "./messages.tsx";
import { Connect } from "./components/connect.tsx";
import { useMqttClient } from "./hooks/use-mqtt-client.ts";

function App() {
  const {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    subscribedTopics,
    isConnecting,
    isConnected,
    messages,
    removeMessage,
  } = useMqttClient({
    onConnect: (address) => {
      localStorage.setItem("address", address);
    },
  });

  return (
    <>
      <div>
        <Connect
          isConnecting={isConnecting}
          onConnect={(data) => connect({ address: data.fullAddress })}
          isConnected={isConnected}
          onDisconnect={disconnect}
          defaultValues={{
            host: "ws://",
            address: "",
            port: "8083",
            path: "",
            fullAddress: "",
          }}
        />
        connect : {isConnected ? "connected" : "not connected yet"}
      </div>
      {isConnected && (
        <>
          <Publish publish={publish} />
          <div>
            subscribed topics:
            {subscribedTopics.length === 0 && "no subscribed topics"}
            <ul>
              {subscribedTopics.map((t) => (
                <li key={t}>
                  {t}{" "}
                  <button onClick={() => unsubscribe(t)}>unsubscribe</button>
                </li>
              ))}
            </ul>
          </div>
          <Subscribe subscribe={subscribe} />
          <Messages
            filter="test/+/response"
            messages={messages}
            onRemove={removeMessage}
          />
        </>
      )}
    </>
  );
}

export default App;
