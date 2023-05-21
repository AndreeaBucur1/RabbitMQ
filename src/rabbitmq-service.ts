import { Injectable } from "@nestjs/common";
import * as amqp from "amqplib"
import { queues } from "./queues";
import { exchanges } from "./exchanges";
@Injectable()
export class RabbitMqService {

	private connection: amqp.Connection;
	private channel: amqp.Channel;


	public async start(): Promise<void> {
		await this.connect()
			.then(async () => {
				console.log("[AMQP] Connected successfully!");
				await this.createChannel()
					.then(() => {
						console.log("[AMQP] Channel created successfully!");
						this.createExchanges();
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
		for (const queue of queues) {
			this.createQueue(queue.queueName, queue.options);
			this.bind(queue.queueName, queue.exchange, queue.routingKey, queue.headers);
			this.consumeQueue(queue.queueName);
		}
	}

	public createQueue(queueName: string, options: amqp.Options.AssertQueue) {
		this.channel.assertQueue(queueName, options);
	}

	public createExchanges() {
		for (const exchange in exchanges) {
			this.channel.assertExchange(exchanges[exchange].exchangeName, exchanges[exchange].type);
		}
	}

	private bind(queueName: string, exchangeName: string, routingKey: string, headers?: any) {
		this.channel.bindQueue(queueName,  exchangeName, routingKey, headers);
	}




	public sendMessageToQueue(queue, message) {
		this.channel.sendToQueue(queue, message);
	}

	public sendMessageToExchange(exchange, message) {
		const routingKey = message.routingKey ? message.routingKey : '';
		const headers = message.headers ? message.headers : undefined;
		const msg = Buffer.from(JSON.stringify(message));
		this.channel.publish(exchanges[exchange].exchangeName, routingKey, msg, headers);
	}



	private async connect(): Promise<void> {
		this.connection = await amqp.connect("amqp://localhost");
	}

	private async createChannel(): Promise<void> {
		this.channel = await this.connection.createChannel();
	}

	public consumeQueue(queue) {
		console.log(`[AMQP] Create consumer for queue ${queue}`);
		
		this.channel.consume(queue, (message) => {
			const content = message.content.toString();
			const data = JSON.parse(content);
			console.log(`[AMQP] Consume message from queue ${queue}: `, data);
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

}