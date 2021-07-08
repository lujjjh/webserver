declare global {
  interface ImportMetaEnv {
    VITE_WEBSERVER_PUB_SUFFIX: string;
  }
}

export const webserverPubSuffix = import.meta.env.VITE_WEBSERVER_PUB_SUFFIX;
