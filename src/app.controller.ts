import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RabbitMqService } from './rabbitmq-service';

@Controller()
export class AppController {
	constructor(private readonly rabbitMqService: RabbitMqService) {}

	@Post("/start")
	public startRabbitMqService(): void {
		this.rabbitMqService.start();
	}

	@Post("/send-messages-to-queue/:queueName")
	public sendMessageToQueue(@Param('queueName') queueName: string, @Body('messages') messages: any[]) {
		messages.forEach((message) => {
			this.rabbitMqService.sendMessageToQueue(queueName, Buffer.from(JSON.stringify(message)));
		})
	}

	@Post("/send-message-to-fanout-exchange")
	public sendMessageToFanoutExchange(@Body('messages') messages: any[]) {
		messages.forEach((message) => {
			this.rabbitMqService.sendMessageToFanoutExchange(message);
		})
	}

	@Post("/send-message-to-direct-exchange")
	public sendMessageToDirectExchange(@Body('messages') messages: any[]) {
		messages.forEach((message) => {
			this.rabbitMqService.sendMessageToDirectExchange(message);
		})
	}

	@Post("/send-message-to-topic-exchange")
	public sendMessageToTopicExchange(@Body('messages') messages: any[]) {
		messages.forEach((message) => {
			this.rabbitMqService.sendMessageToTopicExchange(message);
		})
	}

	@Post("/send-message-to-headers-exchange")
	public sendMessageToHeadersExchange(@Body('messages') messages: any[]) {
		messages.forEach((message) => {
			this.rabbitMqService.sendMessageToHeadersExchange(message);
		})
	}
	
	@Get("/consume-queue/:queueName")
	public consumeQueue(@Param('queueName') queueName: string): any {
		return this.rabbitMqService.consumeQueue(queueName);
	}

	
	@Get("/get-message-from-queue/:queueName")
	public getMessageFromQueue(@Param('queueName') queueName: string): any {
		return this.rabbitMqService.getMessagesFromQueue(queueName);
	}

}
