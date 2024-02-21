import { useForm } from "react-hook-form";

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
  onConnect: (data: ConnectForm) => void;
  onDisconnect: () => void;
  defaultValues?: ConnectForm;
};

export function SingleAddress({
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

  function onSubmitSimple(data: ConnectForm) {
    const fullAddress = `${data.fullAddress}`;
    onConnect({
      fullAddress,
    });
  }
  return (
    <form onSubmit={handleSubmit(onSubmitSimple)}>
      <label htmlFor="address">Address</label>
      <input
        {...register("fullAddress", {
          required: {
            message: "address is required",
            value: true,
          },
        })}
        placeholder="address"
        id="address"
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
