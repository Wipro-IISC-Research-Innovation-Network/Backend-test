// ... (existing imports)
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import OpenAI from 'openai';
import Redis from 'ioredis'; // Import ioredis
import firebaseAdmin from 'firebase-admin'; // Import Firebase Admin
import * as admin from 'firebase-admin';

const OPENAI_API_KEY = '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'; // Use your API key here
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

const openai = new OpenAI({ apiKey: "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"});

// Your Firebase Admin config
const firebaseConfig = {
  credential: admin.credential.cert({
    
    type: "service_account",
    project_id: "wipod-talkbot",
    private_key_id: "e9e45124cfc428ca8948d9c5f1eff3cb93cf985f",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCgNbbEq8vIdbKE\n1oYH9gI8Yb/kAZ20zyMGwC1BkqMEQkZ5LuyLtLh9k61AYjE1U9HSG0WBWG/LbA06\nH8HalPoXuoiURr+MRbyEZhrcJ16JD906gUQzfvC1BIewARuqjcfuOOYu0t1CJ6el\nCw5U6N53pFRZvyb7fMrA7bxvezP6wGcf06ScoRUx54ieyFHLGj/m8k4LjmCFC95v\nAcaso04vAaBs2hMd7Z2Gs/izUBkV03qVQ7hsvm3nMI7XtdEliMV6lMfjBRXQ+ZTB\n4QQtdMicL+yvTWEB65eyd6URxFkPuF4ZKJSXW+rzRJEumMAzQcy4vkmWIsMeZTLR\nnGBvbKhBAgMBAAECggEABg5xxdaOwhm88Wugrn1c0UaKuAZdnV+1PcSXEWMHOZp9\nyof9FjzzOoASLRxpKtBr3qr8QisDMuf3Sgq4S9iU6b+5+Q0Bob5jJYgsnMT6PGk2\nnkcTunSiid1NedhY4OYyOC27eeqrxZv1KPaViJ0zB8fVDn187kXl7kwucvJv4RtE\nk7TOfXeEUYT16p23VAtgcrCkgMHA3O86awqGDDQmL2wTra3aRmVpHErMiV2G83dV\nQs1CBr2FX+90H1U1HTcHleNNX5RGhgHK3gYzs2A68uSwaLQA4nkoxDrsXhOz4H3j\nP4Pp34hIiAdvGTnbsRw7bHHNBNTeKe9TOtL/eGflbwKBgQDXKupOSCPAgNDMoV4d\npnMd3Sn3T+6BvZ7FlxdHgMD8yXwXSJvvK7BtXMUCNUa9R72wfRJwcrGV/evWUWKo\nqpplkaQQ2luSJFh3KMYqBpBGGAKt3koCVgT42dHOE+wPcccEh3spTn+n96CvZ3SR\ntoxFq4DjMBTDztE+DcGjtsNdkwKBgQC+nOLpFP4aJs3x65OlDk/5k9+r4x8pDcjR\nT65z78b/p7qjDQq9DjjmNdNkNjc0VWsDYIWDSdDmbv7CrFDxJ68bDIyPrWgLUUDF\n/kH9sHvNkqDxlqQJ8X0y+zErkS+oZvGilOplMZhQzAI1gqNWbWyStbI34vDOnHTj\ncR2CdAMnWwKBgQCsXy7xo40wrIGZTTTun+fc5s61140E1vmY5V+64oS4flkw9fQl\n+GQQWJ9jE3cmL5DhEHFzMA7gUFlcijp1UKb7817yOVveicttOnb2N+fgn1+WFlxH\n3s2A5k7TvtX/0XBUSoz6HG7cCt7pZgHWsd1R+wD4AA7Chq7N/YtBMir0jQKBgBXA\no6iDy8fCO+hqwOuqKXhK5tCf17OArjUsybTTXTtZsdPfriULFXU4GUqrYTtosBCv\nmCz2ZI+XhR1EOux6YeJNWVEgMepwuFqf/HnuBQLdw94uGcREucvynJbjN7QZI2Qx\naFpqAX7e+TWQFgHL9QL9FzyHeoGpmzFFfF+hy6ZXAoGAN6L5Z3+VPKv37CAIFcSY\ngIPkUDMPN69sgkRb20CBM88NFK6LpnhMzMpWc3t/cuYAGwSUcxvkFaMdhoORrbUc\nLLJ83Rb41awSan3EYSzhkuncQ7Alz2M2n0TYDyVdihcMrfneAlaKyxEXGHIkolVx\ngPcoX9EwOlwgFL538M4wM9w=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-czzuc@wipod-talkbot.iam.gserviceaccount.com",
    client_id: "101953970531072609002",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-czzuc%40wipod-talkbot.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  
  } as admin.ServiceAccount),
  databaseURL: "https://console.firebase.google.com/u/5/project/wipod-talkbot/firestore/data/~2FAskBot",
};

// Initialize Firebase Admin
firebaseAdmin.initializeApp(firebaseConfig);

@WebSocketGateway(8001, { cors: true })
export class AppGateway {
  @WebSocketServer()
  server: Server;

  private redis: Redis = new Redis(); // Create a Redis client

  @SubscribeMessage('user-message')
  async handleMessage(@MessageBody() message: string) {
    try {
      // Check if the response is cached in Redis
      const cachedResponse = await this.redis.get(`cache_${message}`);

      if (cachedResponse) {
        this.server.emit('bot-message', cachedResponse);
      } else {
        const messages = [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message },
        ];

        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 1024,
        });

        if (response && response.choices && response.choices.length > 0) {
          const botResponse = response.choices[0].message.content;

          // Cache the response in Redis
          await this.redis.set(`cache_${message}`, botResponse); // Cache forever until we manually delete the data

          this.server.emit('bot-message', botResponse);

          // Store the user question and bot response in Firebase
          const firestore = firebaseAdmin.firestore();
          const chatRef = firestore.collection('AskBot').doc();  // Use the 'Chats' collection
          await chatRef.set({
            userMessage: message,
            botResponse: botResponse,
            timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          console.error('GPT-3 response was empty:', response);
        }
      }
    } catch (error) {
      console.error('Error generating response from GPT-3:', error);
    }
  }
}
