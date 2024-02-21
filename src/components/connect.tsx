import { useState } from "react";
import { useForm } from "react-hook-form";
import { IClientOptions } from "mqtt";

export type ConnectForm = {
  host?: string;
  address?: string;
  port?: string;
  path?: string;
  fullAddress: string;
};

export type ConnectProps = {
  isConnecting: boolean;
  isConnected: boolean;
  onConnect: (data: string | IClientOptions) => void;
  onDisconnect: () => void;
  defaultValues?: ConnectForm;
};

export function Connect({
  isConnecting,
  onConnect,
  isConnected,
  onDisconnect,
}: ConnectProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IClientOptions>();

  const [showOptions, setShowOptions] = useState(false);

  function onSubmit(data: IClientOptions) {
    const address = `${data.host}${data.hostname}:${data.port}/${data.path}`;
    onConnect({
      host: "",
      hostname: "",
      port: undefined,
      path: "",
    });
  }

  function onSubmitSimple(brokerUrl: string) {
    const address = brokerUrl;
    onConnect({
      address,
    });
  }

  function toggleShowOptions() {
    setShowOptions((prevState) => !prevState);
  }

  if (showOptions) {
    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="host">Host</label>
          <select {...register("host", { required: true })} id="host">
            <option value="ws://">ws://</option>
            <option value="wss://">wss://</option>
          </select>
          <label htmlFor="address">Address</label>
          <input
            {...register("hostname", { required: true })}
            placeholder="address"
            id="address"
          />
          <label htmlFor="port">Port</label>
          <input
            {...register("port", {
              required: true,
              pattern: /^\d+$/,
            })}
            placeholder="port"
            id="port"
          />
          <label htmlFor="path">Path</label>
          <input
            {...register("path", { required: true })}
            placeholder="path"
            id="path"
          />

          <span>{errors.hostname?.message}</span>
          {isConnecting ? (
            "loading"
          ) : isConnected ? (
            <button type="button" onClick={onDisconnect}>
              disconnect
            </button>
          ) : (
            <button type="submit">connect</button>
          )}
        </form>
        <span
          onClick={() => {
            toggleShowOptions();
          }}
          style={{ cursor: "pointer", color: "red" }}
        >
          hide
        </span>
      </>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitSimple)}>
        <label htmlFor="address">Address</label>
        <input
          {...register("brokerUrl", {
            required: {
              message: "address is required",
              value: true,
            },
          })}
          placeholder="address"
          id="address"
        />
        <span>{errors.brokerUrl?.message}</span>
        {isConnecting ? (
          "loading"
        ) : isConnected ? (
          <button type="button" onClick={onDisconnect}>
            disconnect
          </button>
        ) : (
          <button type="submit">connect</button>
        )}
      </form>

      <span
        onClick={() => {
          toggleShowOptions();
        }}
        style={{ cursor: "pointer", color: "blue" }}
      >
        show options
      </span>
    </div>
  );
}
