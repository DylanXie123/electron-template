import { ipcRenderer } from 'electron';
import fs from 'original-fs';

const readDir = (path: string) => {
  const dirents = fs.readdirSync(path, { withFileTypes: true });
  return dirents.map(dirent => ({
    name: dirent.name,
    isDirectory: dirent.isDirectory(),
    isFile: dirent.isFile(),
    isBlockDevice: dirent.isBlockDevice(),
    isCharacterDevice: dirent.isCharacterDevice(),
    isFIFO: dirent.isFIFO(),
    isSocket: dirent.isSocket(),
    isSymbolicLink: dirent.isSymbolicLink(),
  }));
}

const statSync = (path: string) => {
  const stat = fs.statSync(path);
  return {
    size: stat.size,
    blksize: stat.blksize,
    blocks: stat.blocks,
    isDirectory: stat.isDirectory(),
    isFile: stat.isFile(),
  }
}

const existSync = (path: string) => fs.existsSync(path);

const addLitsener = (path: string, listener: (filename: string) => void) => {
  fs.watch(path, { recursive: true }, (event, filename) => {
    if (event === 'rename') {
      listener(filename);
    }
  });
}

const openPath = (fullPath: string) => {
  return ipcRenderer.invoke('openPath', fullPath) as Promise<string>;
};

const showItem = (fullPath: string) => {
  return ipcRenderer.send('showItemInFolder', fullPath);
};

const fsAPI = {
  readDir,
  statSync,
  existSync,
  addLitsener,
  openPath,
  showItem,
};

export default fsAPI;
