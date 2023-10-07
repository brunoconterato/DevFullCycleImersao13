import Queue from "./Queue";
import amqp from "amqplib";

export default class RabitMQAdapter implements Queue {
  connection: any;

  async connect(): Promise<void> {
    this.connection = await amqp.connect("amqp://localhost");
  }

  async on(queueName: string, callback: (data: any) => void): Promise<void> {
    const channel = await this.connection.createChannel();
    channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, async function (msg: any) {
      console.log(msg);
    });
  }

  async publish(queueName: string, data: any): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  }
}
