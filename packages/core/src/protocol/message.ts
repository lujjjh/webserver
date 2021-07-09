import { arrayBufferFromReadableStream } from "../utils/stream";

export interface RequestMessage {
  type: "request";
  url: string;
  method: string;
  headers: Record<string, string>;
  body: ArrayBuffer | null;
  credentials: RequestCredentials;
  cache: RequestCache;
  redirect: RequestRedirect;
  referrer: string;
  integrity: string;
}

export const requestToRequestMessage = async (request: Request): Promise<RequestMessage> => {
  let body = null;
  if (request.body) {
    body = await arrayBufferFromReadableStream(request.body);
  }
  const { url, method, headers, mode, credentials, cache, redirect, referrer, integrity } = request;
  return {
    type: "request",
    url,
    method,
    headers: Object.fromEntries(headers as any),
    body,
    credentials,
    cache,
    redirect,
    referrer,
    integrity,
  };
};

export const requestMessageToRequest = (requestMessage: RequestMessage): Request => {
  const { body, url, method, headers, credentials, cache, redirect, referrer, integrity } = requestMessage;
  return new Request(url, {
    body,
    method,
    headers: new Headers(headers),
    credentials,
    cache,
    redirect,
    referrer,
    integrity,
  });
};

export type ClientMessage = RequestMessage;

export interface ResponseMessage {
  body: ArrayBuffer | null;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export const responseToResponseMessage = async (response: Response): Promise<ResponseMessage> => {
  let body = null;
  if (response.body) {
    body = await arrayBufferFromReadableStream(response.body);
  }
  const { status, statusText, headers } = response;
  return {
    body,
    status,
    statusText,
    headers: Object.fromEntries(headers as any),
  };
};

export const responseMessageToResponse = (responseMessage: ResponseMessage) => {
  return new Response(responseMessage.body, {
    status: responseMessage.status,
    statusText: responseMessage.statusText,
    headers: new Headers(responseMessage.headers),
  });
};
