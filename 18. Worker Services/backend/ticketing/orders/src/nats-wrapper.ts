import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  constructor() {}

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });

      this.client.on("error", (err) => {
        console.log("Connection error");
        reject(err);
      });
    });
  }

  get client(): Stan {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting.");
    }

    return this._client;
  }
}

export const natsWrapper = new NatsWrapper();
