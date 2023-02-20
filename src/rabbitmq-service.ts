import { Injectable } from "@nestjs/common";
import * as amqp from "amqplib"

@Injectable()
export class RabbitMqService {

    private connection: amqp.Connection;
    private channel: amqp.Channel;
    private nonDurable = 'non-durable';
    private durable = 'durable';

    public async start(): Promise<void> {
        await this.connect()
            .then(async () => {
                console.log("[AMQP] Connected successfully!");
                await this.createChannel()
                    .then(() => {
                        console.log("[AMQP] Channel created successfully!");
                        this.createQueues();
                    })
            })
            this.connection.on("error", (err) => {
                console.error("Connection error:", err);
              });
              
              this.channel.on("error", (err) => {
                console.error("Channel error:", err);
              });
    }   

    public createQueues() {
        this.channel.assertQueue(this.nonDurable, {durable: false, autoDelete: true,});
        this.channel.assertQueue(this.durable, {durable: true, autoDelete: false,});

    }

    public sendMessage(queue, message) {
        this.channel.sendToQueue(queue, message, {});
    }

    public consumeQueue(queue) {
        this.channel.consume(queue, (message) => {
            const content = message.content.toString();
            const data = JSON.parse(content);
            console.log(`[AMQP] Consume messages from queue ${queue}: `, data);
            
        })
    }

    public async getMessagesFromQueue(queue) {
        await this.channel.get(queue).then(
            (message) => {
                if (message) {
                    const content = message.content.toString();
                    const data = JSON.parse(content);
                    console.log(`[AMQP] Get message from queue ${queue}: `, data);
                }
            }
        )
    }

    private async connect(): Promise<void> {
        this.connection = await amqp.connect("amqp://localhost");
    }

    private async createChannel(): Promise<void> {
        this.channel = await this.connection.createChannel();
    }

}