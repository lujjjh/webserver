export class FS {
  constructor(private directoryHandle: FileSystemDirectoryHandle) {}

  async getFile(path: string) {
    path = path.replace(/^\/*/, "");
    const segments = path.split(/[/\\]+/g);
    let handle = this.directoryHandle;
    while (segments.length > 1) {
      const name = segments.shift()!;
      try {
        handle = await handle.getDirectoryHandle(name);
      } catch {
        return null;
      }
    }
    const name = segments.shift()!;
    if (!name) {
      return null;
    }
    let fileHandle;
    try {
      fileHandle = await handle.getFileHandle(name);
    } catch {
      return null;
    }
    return await fileHandle.getFile();
  }
}
