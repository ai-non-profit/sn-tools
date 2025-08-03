import { app, BrowserWindow, Menu, net, protocol, shell } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import initDownload from './api/events/download-video';
import initUploadVideo from './api/events/upload-video';
import initEdit from './api/events/edit-video';
import initSelectFolder from './api/events/setting';
import fixPath from 'fix-path';
import initVersion from './api/events/version';
import { PassThrough } from 'node:stream';
import { getSettings } from './api/dal/setting';
import initYoutube from './api/events/youtube';
import log from 'electron-log';
import { updateElectronApp } from 'update-electron-app';

log.initialize();

updateElectronApp({
  logger: log,
}); // additional configuration options available

fixPath();

let mainWindow: BrowserWindow;
log.transports.file.level = 'info';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=1024');

function createMenu() {
  const currentMenu = Menu.getApplicationMenu();

  // Create the new menu item (or submenu)
  const newMenu = {
    label: 'Tools',
    submenu: [
      {
        label: 'Open Log',
        click: () => {
          const logFilePath = log.transports.file.getFile().path;
          shell.showItemInFolder(logFilePath);
        }
      },
      {
        label: 'Open Download Folder',
        click: () => {
          const downloadDir = getSettings().downloadDir;
          shell.showItemInFolder(downloadDir);
        }
      }
    ]
  };

  // If a menu exists, append your new one
  let menu;
  if (currentMenu) {
    const menuItems = currentMenu.items.concat(Menu.buildFromTemplate([newMenu]).items);
    menu = Menu.buildFromTemplate(menuItems);
  } else {
    // No current menu (very rare), build a fresh one
    menu = Menu.buildFromTemplate([newMenu]);
  }

  Menu.setApplicationMenu(menu);
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: false,
    },
  });

  // Create menu bar
  createMenu();

  // Register custom protocol
  protocol.registerStreamProtocol('stream', (request, callback) => {
    const videoId = request.url.replace('stream://video/', '');
    const videoUrl = atob(videoId);

    const videoStream = new PassThrough();
    const settings = getSettings();

    log.info('Streaming video from URL:' + videoUrl);

    const clientRequest = net.request({
      method: 'GET',
      url: videoUrl,
      session: undefined // Optional: use Electron session
    });

    log.info(settings.tiktokCookies);

    // Set any cookies or headers required for auth
    clientRequest.setHeader('Cookie', settings.tiktokCookies);
    clientRequest.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
    clientRequest.setHeader('referer', 'https://www.tiktok.com/');
    // clientRequest.setHeader('Authorization', 'Bearer ...');

    clientRequest.on('response', (res) => {
      res.on('data', chunk => videoStream.write(chunk));
      res.on('end', () => videoStream.end());
      res.on('error', err => {
        log.error('Streaming error:', err);
        videoStream.destroy(err);
      });

      callback({
        statusCode: 200,
        headers: res.headers,
        data: videoStream,
      });
    });

    clientRequest.end();
  });


  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);
  // if (!fs.existsSync(outroDir)) fs.mkdirSync(outroDir);
  // if (!fs.existsSync(editDir)) fs.mkdirSync(editDir);

  initSelectFolder(mainWindow);
  initVersion(mainWindow);
  initYoutube(mainWindow);

  mainWindow.webContents.on("did-finish-load", () => {
    initDownload(mainWindow);
    initEdit(mainWindow);
    initUploadVideo(mainWindow);
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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