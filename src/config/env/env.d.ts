declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PORT: number;
    readonly DB_HOST: string;
    readonly DB_PORT: number;
    readonly DB_USER: string;
    readonly DB_PASSWORD: string;
    readonly DB_NAME: string;
    readonly USER_AUTH_SECRET: string;
  }
}
