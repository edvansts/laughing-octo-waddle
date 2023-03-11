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
    readonly EXPO_ACCESS_TOKEN: string;
    readonly CLOUDINARY_CLOUD_NAME: string;
    readonly CLOUDINARY_API_KEY: string;
    readonly CLOUDINARY_API_SECRET: string;
    readonly GOOGLE_API_CLIENT_ID: string;
    readonly GOOGLE_API_CLIENT_SECRET: string;
    readonly GOOGLE_API_REDIRECT_URI: string;
    readonly GOOGLE_API_REFRESH_TOKEN: string;
  }
}
