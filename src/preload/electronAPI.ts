import { ipcRenderer } from "electron";
import type { MessageBoxSyncOptions, OpenDialogSyncOptions } from "electron/common";

const electronAPI = {
  relauch: () => ipcRenderer.send('relauch'),
  showOpenDialog: (option: OpenDialogSyncOptions) =>
    ipcRenderer.invoke("showOpenDialog", option) as Promise<string[] | undefined>,
  showMessageBox: (option: MessageBoxSyncOptions) =>
    ipcRenderer.invoke("showMessageBox", option) as Promise<number>,
}

export default electronAPI;
