import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway'; // Import AppGateway

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppGateway], // Add AppGateway to the providers
})
export class AppModule {}
