import { useForm } from "react-hook-form";

export type SubscribeProps = {
  subscribe: (topic: string) => Promise<string>;
};

export type SubscribeForm = {
  topic: string;
};

export function Subscribe({ subscribe }: SubscribeProps) {
  const { handleSubmit, register, reset } = useForm<SubscribeForm>();

  function onSubmit(data: SubscribeForm) {
    subscribe(data.topic)
      .then((topic) => {
        alert(`subscribe ${topic}`);
      })
      .catch(() => {
        alert("something went wrong for subscribing");
      })
      .finally(reset);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ border: "1px solid black" }}
    >
      <label htmlFor="topic">Topic</label>
      <input
        {...register("topic", {
          required: true,
        })}
        id="topic"
      />
      <button type="submit">subscribe</button>
    </form>
  );
}
