declare function showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;

interface FileSystemHandle {
  readonly kind: "file" | "directory";
  readonly name: string;
}

interface FileSystemFileHandle {
  getFile(): Promise<File>;
}

interface FileSystemDirectoryHandle
  extends FileSystemHandle,
    AsyncIterable<FileSystemHandle> {
  getFileHandle(name: string): Promise<FileSystemFileHandle>;
  getDirectoryHandle(name: string): Promise<FileSystemDirectoryHandle>;
}
