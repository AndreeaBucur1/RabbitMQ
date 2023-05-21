import { Injectable } from "@nestjs/common";
import * as amqp from "amqplib"
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
		for (const queue of this.queues) {
			this.createQueue(queue.queueName, queue.options);
			this.bind(queue.queueName, queue.exchange, queue.routingKey, queue.headers);
			// this.consumeQueue(queue.queueName);
		}
	}

	public createQueue(queueName: string, options: amqp.Options.AssertQueue) {
		this.channel.assertQueue(queueName, options);
	}

	public createExchanges() {
		for (const exchange in this.exchanges) {
			this.channel.assertExchange(this.exchanges[exchange].exchangeName, this.exchanges[exchange].type);
		}
	}

	private bind(queueName: string, exchangeName: string, routingKey: string, headers?: any) {
		this.channel.bindQueue(queueName,  exchangeName, routingKey, headers);
	}




	public sendMessageToQueue(queue, message) {
		this.channel.sendToQueue(queue, message);
	}

	public sendMessageToExchange(exchange, message) {
		this.channel.publish(exchange, "", message);
	}

	public sendMessageToFanoutExchange( message) {
		this.channel.publish(this.exchanges.fanout.exchangeName, '', Buffer.from(JSON.stringify(message)));
	}

	public sendMessageToDirectExchange(message) {
		this.channel.publish(this.exchanges.direct.exchangeName, message.routingKey, Buffer.from(JSON.stringify(message)));
	}

	public sendMessageToTopicExchange(message) {
		this.channel.publish(this.exchanges.topic.exchangeName, message.routingKey, Buffer.from(JSON.stringify(message)));
	}

	public sendMessageToHeadersExchange(message) {
		this.channel.publish(this.exchanges.headers.exchangeName, '', Buffer.from(JSON.stringify(message)), {headers: message.headers});
	}





	private exchanges = {
		"fanout": {
			exchangeName: 'training_exchange_fanout',
			type: 'fanout'
		},
		"direct": {
			exchangeName: 'training_exchange_direct',
			type: 'direct'
		},
		"topic": {
			exchangeName: 'training_exchange_topic',
			type: 'topic'
		},
		"headers": {
			exchangeName: 'training_exchange_headers',
			type: 'headers'
		},
		
	}
	private queues = [
		{
			queueName: 'training_queue1',
			options: {durable: true, autoDelete: true},
			exchange: 'training_exchange_fanout',
			routingKey: ''
		},
		{
			queueName: 'training_queue2',
			options: {durable: false, autoDelete: false},
			exchange: 'training_exchange_fanout',
			routingKey: ''

		},
		{
			queueName: 'training_order_direct',
			options: {durable: false, autoDelete: true},
			exchange: 'training_exchange_direct',
			routingKey: 'order'

		},
		{
			queueName: 'training_shipment_direct',
			options: {durable: false, autoDelete: true},
			exchange: 'training_exchange_direct',
			routingKey: 'shipment'
		},
		{
			queueName: 'training_order_topic',
			options: {durable: false, autoDelete: true},
			exchange: 'training_exchange_topic',
			routingKey: 'order.#'

		},
		{
			queueName: 'training_shipment_topic',
			options: {durable: false, autoDelete: true},
			exchange: 'training_exchange_topic',
			routingKey: 'shipment.#'
		},
		{
			queueName: 'training_order_headers_US',
			options: {durable: false, autoDelete: true},
			exchange: 'training_exchange_headers',
			routingKey: '',
			headers: {
				type: "order",
				region: "US"
			}
		},
		{
			queueName: 'training_shipment_headers_US',
			options: {durable: false, autoDelete: true},
			exchange: 'training_exchange_headers',
			routingKey: '',
			headers: {
				type: "shipment",
				region: "US"
			}
		},
		{
			queueName: 'training_order_headers_RO',
			options: {durable: false, autoDelete: true},
			exchange: 'training_exchange_headers',
			routingKey: '',
			headers: {
				type: "order",
				region: "RO"
			}
		},
		{
			queueName: 'training_shipment_headers_RO',
			options: {durable: false, autoDelete: true},
			exchange: 'training_exchange_headers',
			routingKey: '',
			headers: {
				type: "shipment",
				region: "RO"
			}		
		},
	]

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