import { Server } from 'socket.io';
export declare class AppGateway {
    server: Server;
    private redis;
    handleMessage(message: string): Promise<void>;
}
