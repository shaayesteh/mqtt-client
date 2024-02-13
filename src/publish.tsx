import {MqttClient} from "mqtt";
import {useForm} from "react-hook-form";

export type PublishProps = {
  client: MqttClient
}

type PublishForm = {
  topic: string,
  message: string
}

export function Publish({client}: PublishProps) {

  const {handleSubmit ,register, formState: {errors}} = useForm<PublishForm>({
  defaultValues: {
    topic: 'test/alish',
    message: 'hello world'
  }
  })

  function publish({topic,message}: PublishForm) {


    client.publish(topic, message, (error, packet) => {
      if (error) {
        alert(error)
        return;
      }

      if (packet?.cmd === 'publish') {
        alert(`published to ${packet.topic}`)
      }

    })
  }

  return <div style={{border: '1px solid black'}}>
    <form onSubmit={handleSubmit(publish)}>
      <label htmlFor='topic'>Topic</label>
      <input {...register('topic', {required: true})} />
      <span style={{color: 'red'}}>{errors.topic?.message}</span>
      <label htmlFor='message'>message</label>
      <textarea {...register('message', {required: true, minLength: {message: 'message should at least be 20 length', value: 20}})} />
      <span style={{color: 'red'}}>{errors.message?.message}</span>
      <button type='submit'>publish</button>
    </form>
  </div>
}