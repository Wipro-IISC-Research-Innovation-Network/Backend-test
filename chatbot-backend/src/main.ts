import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { IoAdapter } from '@nestjs/platform-socket.io'; // Add IoAdapter import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for HTTP requests
  app.enableCors({
    origin: 'http://localhost:8001', // Allow requests from your development frontend
    credentials: true,
  });

  // Attach the WebSocket gateway and use the WsAdapter
  app.useWebSocketAdapter(new WsAdapter(app));

  // Attach the Socket.IO adapter
  app.useWebSocketAdapter(new IoAdapter(app)); // Add this line

  // Start the server
  await app.listen(3001);
}

bootstrap();
