import { Packet } from "mqtt";
import { useForm } from "react-hook-form";

export type PublishProps = {
  publish: (topic: string, message: string) => Promise<Packet | undefined>;
};

type PublishForm = {
  topic: string;
  message: string;
};

export function Publish({ publish }: PublishProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PublishForm>({});

  function onSubmit({ topic, message }: PublishForm) {
    publish(topic, message)
      .then(() => {
        alert("published");
      })
      .catch(() => {
        alert("not published");
      });
  }

  return (
    <div style={{ border: "1px solid black" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="topic">Topic</label>
        <input {...register("topic", { required: true })} id="topic" />
        <span style={{ color: "red" }}>{errors.topic?.message}</span>
        <label htmlFor="message">message</label>
        <textarea
          {...register("message", {
            required: true,
            minLength: {
              message: "message should at least be 20 length",
              value: 20,
            },
          })}
          id="message"
        />
        <span style={{ color: "red" }}>{errors.message?.message}</span>
        <button type="submit">publish</button>
      </form>
    </div>
  );
}
