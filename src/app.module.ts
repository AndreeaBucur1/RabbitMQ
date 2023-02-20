import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMqService } from './rabbitmq-service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, RabbitMqService],
})
export class AppModule {}
