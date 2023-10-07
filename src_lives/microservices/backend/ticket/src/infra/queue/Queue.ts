export default interface Queue {
  connect(): Promise<void>;
  on(queueName: string, callback: (data: any) => void): Promise<void>;
  publish(queueName: string, data: any): Promise<void>;
}
