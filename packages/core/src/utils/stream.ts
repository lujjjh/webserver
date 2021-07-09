export const arrayBufferFromReadableStream = async (stream: ReadableStream) => {
  let chunks: Uint8Array[] = [];
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  const totalByteLength = chunks.reduce((value, array) => value + array.byteLength, 0);
  const data = new Uint8Array(totalByteLength);
  let bytesWritten = 0;
  for (const chunk of chunks) {
    data.set(chunk, bytesWritten);
    bytesWritten += chunk.byteLength;
  }
  return data.buffer;
};
