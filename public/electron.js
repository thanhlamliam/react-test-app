const { app, BrowserWindow, WebContentsView, ipcMain } = require('electron');
const path = require('node:path');
const http = require('node:http');

// function startHttpServer() {
//   console.log("creating http server...")
//   const server = http.createServer((req, res) => {
//     console.log("startHttpServer req: ", req)
//   })

//   server.listen(3000, () => {
//     console.log("HTTP server listening on port 3000")
//   })
// }

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

app.commandLine.appendSwitch('ignore-certificate-errors')

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // Prevent the default behavior
  event.preventDefault();
  // Allow the certificate
  callback(true);
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),

      // plugins: true,
      nodeIntegration: false,
      contextIsolation: true,
      // webSecurity: false,
      // allowDisplayingInsecureContent: true,
      // allowRunningInsecureContent: true
    },
  });

  mainWindow.loadURL("https://211.174.185.31:44390/sap/bc/gui/sap/its/webgui?sap-client=810&sap-language=EN#")

  mainWindow.webContents.session.webRequest.onBeforeRequest(
    { urls: ["https://211.174.185.31:44390/*", "https://vhbzzwsdwd01.sap.erp.lgensol.com:44380/*"] },
    // { urls: ["*://*/*"] },
    (details, callback) => {
      // console.log("onBeforeRequest: ", details.url)
      // console.log("uploadData: ", JSON.stringify(details.uploadData))
      const [bytes] = details?.uploadData || [];
      // console.log("bytes: ", bytes)
      console.log("text: ", bytes?.bytes?.toString("utf8"))
      
      callback(true);
    }
  )

  mainWindow.webContents.session.webRequest.onCompleted(
    {
      urls: ["https://211.174.185.31:44390/*", "https://vhbzzwsdwd01.sap.erp.lgensol.com:44380/*"]
    },
    (details) => {
      // console.log("Details: ", details)
      console.log("URL: ", details.url)
    }
  )

  // mainWindow.addEventListener("DOMContentLoaded", () => {
  //   const title = document.title
  
  //   console.log("Page title: ", title)
  // })



  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // const leftView = new WebContentsView()
  // leftView.webContents.loadURL('https://211.174.185.31:44390/sap/bc/gui/sap/its/webgui?sap-client=810&sap-language=EN#')
  // console.log("leftView: ", leftView.webContents)
  // leftView.webContents.loadURL('https://www.youtube.com/')
  // mainWindow.contentView.addChildView(leftView)
  // leftView.setBounds({ x: 0, y: 0, width: 1000, height: 1000 })

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  // startHttpServer();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// ipcMain.on('channel1', (e, args) => {
//   console.log("11111111: ", e)
//   console.log("22222222: ", args)
// })
