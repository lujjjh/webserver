export const arrayBufferFromReadableStream = async (stream: ReadableStream) => {
  let data = Uint8Array.of();
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) data = new Uint8Array([...data, ...value]);
  }
  return data.buffer;
};
