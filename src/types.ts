import { IPublishPacket } from "mqtt";

export type Message = {
  id: number;
  topic: string;
  message: string;
  packet: IPublishPacket;
};
