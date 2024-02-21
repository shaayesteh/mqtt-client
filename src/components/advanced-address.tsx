import { useForm } from "react-hook-form";
import mqtt, { IClientOptions } from "mqtt";

type Connect = Parameters<typeof mqtt.connect>;

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
  onConnect: (data: IClientOptions) => void;
  onDisconnect: () => void;
  defaultValues?: ConnectForm;
};

export function AdvancedAddress({
  isConnecting,
  onConnect,
  isConnected,
  onDisconnect,
  defaultValues,
}: ConnectProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConnectForm>({ defaultValues });

  function onSubmit(data: ConnectForm) {
    const fullAddress = `${data.host}${data.address}:${data.port}/${data.path}`;
    onConnect({
      fullAddress,
      host: "",
      address: "",
      port: undefined,
      path: "",
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="host">Host</label>
      <select {...register("host", { required: true })} id="host">
        <option value="ws://">ws://</option>
        <option value="wss://">wss://</option>
      </select>
      <label htmlFor="address">Address</label>
      <input
        {...register("address", { required: true })}
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

      <span>{errors.address?.message}</span>
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
  );
}
