import { useReducer } from "react";
import mqtt, { MqttClient } from "mqtt";
import { useMessages } from "./use-messages.tsx";

type IdleState = {
  state: "idle";
  isConnected: false;
  isConnecting: false;
  error: null;
  client: null;
};

type ConnectingState = {
  state: "connecting";
  isConnected: false;
  isConnecting: true;
  error: null;
  client: MqttClient;
};

type ConnectedState = {
  state: "connected";
  isConnected: true;
  isConnecting: false;
  error: null;
  client: MqttClient;
};

type FailedState = {
  state: "failed";
  isConnected: false;
  isConnecting: false;
  error: string;
  client: null;
};

type DisconnectedState = {
  state: "disconnected";
  isConnected: false;
  isConnecting: false;
  error: null;
  client: MqttClient;
};

export type MqttClientState =
  | IdleState
  | ConnectingState
  | ConnectedState
  | FailedState
  | DisconnectedState;

type ConnectAction = {
  type: "connect";
  payload: {
    client: MqttClient;
  };
};

type ConnectedAction = {
  type: "connected";
  payload: {
    client: MqttClient;
  };
};

type ConnectionFailedAction = {
  type: "connection-failed";
  payload: {
    error: string;
  };
};

type DisconnectAction = {
  type: "disconnect";
  payload: {
    client: MqttClient;
  };
};

export type MqttClientAction =
  | ConnectAction
  | ConnectedAction
  | ConnectionFailedAction
  | DisconnectAction;

const INITIAL_STATE: IdleState = {
  state: "idle",
  isConnecting: false,
  isConnected: false,
  client: null,
  error: null,
};

const reducer = (
  _: MqttClientState,
  action: MqttClientAction,
): MqttClientState => {
  switch (action.type) {
    case "connect":
      return {
        isConnected: false,
        state: "connecting",
        error: null,
        isConnecting: true,
        client: action.payload.client,
      };
    case "connected":
      return {
        state: "connected",
        client: action.payload.client,
        error: null,
        isConnected: true,
        isConnecting: false,
      };
    case "connection-failed":
      return {
        state: "failed",
        isConnected: false,
        isConnecting: false,
        error: action.payload.error,
        client: null,
      };
    case "disconnect":
      return {
        state: "disconnected",
        error: null,
        client: action.payload.client,
        isConnected: false,
        isConnecting: false,
      };
    default:
      throw Error("Unknown action.");
  }
};

export type UseMqttClientArgs = {
  onConnect?: (address: string) => void;
};

export type ConnectArgs = {
  address: string;
};

export function useMqttClient({ onConnect }: UseMqttClientArgs = {}) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { onMessageReceived, ...restUseMessages } = useMessages();

  function connect({ address }: ConnectArgs) {
    try {
      const client = mqtt.connect(address, {
        protocolVersion: 5,
      });

      dispatch({ type: "connect", payload: { client } });

      client.on("message", (topic, message, packet) => {
        onMessageReceived({ topic, message: message.toString(), packet });
      });

      client.on("connect", () => {
        dispatch({ type: "connected", payload: { client } });
        onConnect?.(address);
      });

      client.on("end", () => {
        dispatch({ type: "disconnect", payload: { client } });
      });

      client.on("error", () => {
        dispatch({
          type: "connection-failed",
          payload: { error: "Connection failed" },
        });
      });
    } catch (e) {
      dispatch({
        type: "connection-failed",
        payload: { error: getErrorMessage(e) },
      });
    }
  }

  function disconnect() {
    if (state.state === "connected") {
      state.client.end();
    }
  }

  return {
    ...state,
    connect,
    disconnect,
    ...restUseMessages,
  };
}

function getErrorMessage(e: unknown) {
  return e instanceof Error
    ? e.message
    : typeof e == "string"
      ? e
      : "unknown error";
}
