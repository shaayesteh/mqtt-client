import { useForm } from "react-hook-form";
import { WS_ADDRESS_PATTERN } from "../utils/patterns.ts";

export type ConnectForm = {
  address: string;
};

export type ConnectProps = {
  isConnecting: boolean;
  isConnected: boolean;
  onConnect: (data: ConnectForm) => void;
  onDisconnect: () => void;
  defaultValues?: ConnectForm;
};

export function Connect({
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

  return (
    <form onSubmit={handleSubmit(onConnect)}>
      <label htmlFor="address">Address</label>
      <input
        {...register("address", {
          required: {
            message: "address is required",
            value: true,
          },
          pattern: {
            value: WS_ADDRESS_PATTERN,
            message: "address is not valid",
          },
        })}
        placeholder="address"
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
