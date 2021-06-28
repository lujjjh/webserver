declare global {
  interface ImportMetaEnv {
    VITE_LOCALHOST_ORIGIN: string;
  }
}

export const localhostOrigin = import.meta.env.VITE_LOCALHOST_ORIGIN;
