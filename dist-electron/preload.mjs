"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  onScreenshotTaken(callback) {
    electron.ipcRenderer.on("screenshot-taken", (_event, path) => callback(path));
  },
  onUpdateAvailable(callback) {
    electron.ipcRenderer.on("update-available", (_event, info) => callback(info));
  },
  onUpdateDownloaded(callback) {
    electron.ipcRenderer.on("update-downloaded", (_event, info) => callback(info));
  }
});
