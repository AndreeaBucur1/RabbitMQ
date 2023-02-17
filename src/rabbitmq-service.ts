import * as amqp from "amqplib"

export class RabbitMqService {

    private connection: amqp.Connection;
    private channel: amqp.Channel;
    public nonDurable = 'non-durable';
    public async start(): Promise<void> {
        await this.connect()
            .then(async () => {
                console.log("[AMQP] Connected successfully!");
                await this.createChannel()
                    .then(() => {
                        console.log("[AMQP] Channel created successfully!");
                        
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
    }

    public async disconnect() {
        try {
          await this.channel.close();
          await this.connection.close();
          console.log('Disconnected from RabbitMQ');
        } catch (error) {
          console.error('Error disconnecting from RabbitMQ', error);
        }
    }

    public sendMessage(queue, message) {
        this.channel.sendToQueue(queue, message, {});
    }

    public consume(queue) {
        this.channel.consume(queue, (message) => {
            const content = message.content.toString();
            const data = JSON.parse(content);
            console.log(data);
            
        })
    }

    private async connect(): Promise<void> {
        this.connection = await amqp.connect("amqp://localhost");
    }

    private async createChannel(): Promise<void> {
        this.channel = await this.connection.createChannel();
    }

}