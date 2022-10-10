import { contextBridge } from 'electron';
import apiKey from './apiKey';
import { movieDBAPI, ignoreDBAPI, storageAPI } from './dbAPI';
import electronAPI from './electronAPI';
import fsAPI from './fsAPI';

contextBridge.exposeInMainWorld('fsAPI', fsAPI);
contextBridge.exposeInMainWorld('apiKey', apiKey);
contextBridge.exposeInMainWorld('movieDBAPI', movieDBAPI);
contextBridge.exposeInMainWorld('ignoreDBAPI', ignoreDBAPI);
contextBridge.exposeInMainWorld('storageAPI', storageAPI);
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// https://github.com/electron/electron/issues/9920#issuecomment-575839738
declare global {
  interface Window {
    fsAPI: typeof fsAPI;
    apiKey: typeof apiKey;
    movieDBAPI: typeof movieDBAPI;
    ignoreDBAPI: typeof ignoreDBAPI;
    storageAPI: typeof storageAPI;
    electronAPI: typeof electronAPI;
  }
}
