import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import { posix, sep } from 'path';
import IgnoreDB from './ignoreDB';
import MovieDB from './movieDB';
import Store from 'electron-store';
// import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  MovieDB.initDatabase();
  IgnoreDB.initDatabase();

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  Store.initRenderer();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// app.whenReady().then(() => {
//   installExtension(REACT_DEVELOPER_TOOLS)
//       .then((name) => console.log(`Added Extension:  ${name}`))
//       .catch((err) => console.log('An error occurred: ', err));
// });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('relauch', () => {
  app.relaunch();
  app.exit(0);
});

ipcMain.handle('showOpenDialog', (_event, option) => {
  const paths = dialog.showOpenDialogSync(option);
  if (paths) {
    return paths.map(path => path.split(sep).join(posix.sep));
  } else {
    return undefined;
  }
});

ipcMain.handle('showMessageBox', (_event, option) =>
  dialog.showMessageBoxSync(option),
);

ipcMain.handle('openPath', (_event, path: string) => {
  return shell.openPath(path.split(posix.sep).join(sep));
});

ipcMain.on('showItemInFolder', (_event, path: string) => {
  return shell.showItemInFolder(path.split(posix.sep).join(sep))
});
