const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const ipcMain = electron.ipcMain;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let loadWindow = null;
let unloadWindow = null;
let deleteWindow = null;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1500, 
    height: 1000,
    title: 'T.R.S'
  });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    app.quit();
  });
}

function createLoadWindow() {
  // Create the browser window.
  loadWindow = new BrowserWindow({
    width: 400, 
    height: 300,
    title: 'Load Truck'
  });

  loadWindow.setMenu(null);

  loadWindow.webContents.on('did-finish-load', () => {
    loadWindow.show();
    loadWindow.focus();
  });

  // and load the index.html of the app.
  loadWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'loadWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Emitted when the window is closed.
  loadWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    loadWindow = null;
  });
}

function createUnloadWindow() {
  // Create the browser window.
  unloadWindow = new BrowserWindow({
    width: 400, 
    height: 180,
    title: 'Unload Truck'
  });

  unloadWindow.setMenu(null);

  unloadWindow.webContents.on('did-finish-load', () => {
    unloadWindow.show();
    unloadWindow.focus();
  });

  // and load the index.html of the app.
  unloadWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'unloadWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Emitted when the window is closed.
  unloadWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    unloadWindow = null;
  });
}

function createDeleteWindow() {
  // Create the browser window.
  deleteWindow = new BrowserWindow({
    width: 400, 
    height: 180,
    title: 'Remove Truck'
  });

  deleteWindow.setMenu(null);

  deleteWindow.webContents.on('did-finish-load', () => {
    deleteWindow.show();
    deleteWindow.focus();
  });

  // and load the index.html of the app.
  deleteWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'deleteWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Emitted when the window is closed.
  deleteWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    deleteWindow = null;
  });
}

// Catch 'open-load-window'
ipcMain.on('open-load-window', function(e, value) {
  createLoadWindow();
  mainWindow.webContents.send('truck:id', value);
});

// Catch 'open-unload-window'
ipcMain.on('open-unload-window', function(e, value) {
  createUnloadWindow();
  mainWindow.webContents.send('unload:id', value);
});

// Catch 'open-delete-window'
ipcMain.on('open-delete-window', function(e, value) {
  console.log(value);
  createDeleteWindow();
  mainWindow.webContents.send('delete:id', value);
});

// Catch 'yes-unload'
ipcMain.on('yes-unload', function(e, value) {
  console.log(value);
  mainWindow.webContents.send('unload', value);
  if (unloadWindow) {
    unloadWindow.close();
  }
});

// Catch 'no-unload'
ipcMain.on('no-unload', function(e, value) {
  if (unloadWindow) {
    unloadWindow.close();
  }
});

// Catch 'yes-delete'
ipcMain.on('yes-delete', function(e, value) {
  console.log(value);
  mainWindow.webContents.send('delete', value);
  if (deleteWindow) {
    deleteWindow.close();
  }
});

// Catch 'no-delete'
ipcMain.on('no-delete', function(e, value) {
  if (deleteWindow) {
    deleteWindow.close();
  }
});

// Catch 'load_data'
ipcMain.on('load_data', function(e, data) {
  mainWindow.webContents.send('load_data', data);
  if (loadWindow) {
    loadWindow.close();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
