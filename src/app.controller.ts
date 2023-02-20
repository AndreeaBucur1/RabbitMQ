import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RabbitMqService } from './rabbitmq-service';

@Controller()
export class AppController {
  constructor(private readonly rabbitMqService: RabbitMqService) {}

  @Get("/start")
  public startRabbitMqService(): void {
    this.rabbitMqService.start();
  }

  @Get("/consume-queue/:queueName")
  public consumeQueue(@Param('queueName') queueName: string): any {
    return this.rabbitMqService.consumeQueue(queueName);
  }

  
  @Get("/get-message-from-queue/:queueName")
  public getMessageFromQueue(@Param('queueName') queueName: string): any {
    return this.rabbitMqService.getMessagesFromQueue(queueName);
  }

  @Post("/send-messages-to-queue/:queueName")
  public sendMessageToQueue(@Param('queueName') queueName: string, @Body('messages') messages: any[]) {
    messages.forEach((message) => {
      this.rabbitMqService.sendMessage(queueName, Buffer.from(JSON.stringify(message)));
    })
  }
}
