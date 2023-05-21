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

	@Post("/send-messages-to-exchange/:exchangeType")
	public sendMessagesToExchange(@Param('exchangeType') exchangeType: string, @Body('messages') messages: any[]) {
		messages.forEach((message) => {
			this.rabbitMqService.sendMessageToExchange(exchangeType, message);
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
