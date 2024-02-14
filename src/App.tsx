import { Publish } from "./publish.tsx";
import { Subscribe } from "./subscribe.tsx";
import { Messages } from "./messages.tsx";
import { Connect } from "./components/connect.tsx";
import { useMqttClient } from "./hooks/use-mqtt-client.ts";

function App() {
  const {
    client,
    connect,
    disconnect,
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
          onConnect={connect}
          isConnected={isConnected}
          onDisconnect={disconnect}
          defaultValues={{
            address: localStorage.getItem("address") || "",
          }}
        />
        connect : {isConnected ? "connected" : "not connected yet"}
      </div>
      {client && isConnected && (
        <>
          <Publish client={client} />
          <Subscribe client={client} />
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
