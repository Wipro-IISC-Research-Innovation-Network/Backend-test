declare module 'openai' {
    export const ChatCompletion: {
      create: (params: any, apiKey: string) => Promise<any>;
    };
  }
  