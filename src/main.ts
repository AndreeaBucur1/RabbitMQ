import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitMqService } from './rabbitmq-service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const rabbitMqService: RabbitMqService = new RabbitMqService();
  await rabbitMqService.start();
  rabbitMqService.createQueues();
  const message = {
    id: 1,
    text: "Test send message functionality"
  };
  rabbitMqService.sendMessage(rabbitMqService.nonDurable, Buffer.from(JSON.stringify(message)));
  rabbitMqService.consume(rabbitMqService.nonDurable);

}
bootstrap();
