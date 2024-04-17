"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const openai_1 = require("openai");
const ioredis_1 = require("ioredis");
const firebase_admin_1 = require("firebase-admin");
const admin = require("firebase-admin");
const OPENAI_API_KEY = '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';
const openai = new openai_1.default({ apiKey: "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" });
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
    }),
    databaseURL: "https://console.firebase.google.com/u/5/project/wipod-talkbot/firestore/data/~2FAskBot",
};
firebase_admin_1.default.initializeApp(firebaseConfig);
let AppGateway = class AppGateway {
    constructor() {
        this.redis = new ioredis_1.default();
    }
    async handleMessage(message) {
        try {
            const cachedResponse = await this.redis.get(`cache_${message}`);
            if (cachedResponse) {
                this.server.emit('bot-message', cachedResponse);
            }
            else {
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
                    await this.redis.set(`cache_${message}`, botResponse);
                    this.server.emit('bot-message', botResponse);
                    const firestore = firebase_admin_1.default.firestore();
                    const chatRef = firestore.collection('AskBot').doc();
                    await chatRef.set({
                        userMessage: message,
                        botResponse: botResponse,
                        timestamp: firebase_admin_1.default.firestore.FieldValue.serverTimestamp(),
                    });
                }
                else {
                    console.error('GPT-3 response was empty:', response);
                }
            }
        }
        catch (error) {
            console.error('Error generating response from GPT-3:', error);
        }
    }
};
exports.AppGateway = AppGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AppGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('user-message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "handleMessage", null);
exports.AppGateway = AppGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8001, { cors: true })
], AppGateway);
//# sourceMappingURL=app.gateway.js.map