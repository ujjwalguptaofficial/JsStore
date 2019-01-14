const electron = require('electron');
const path = require('path')
const url = require('url');

export class ElectronApp {
    constructor() {
        this.app_ = null;
        this.mainWindow_ = null;
    }

    init() {
        this.app_ = electron.app;
        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        this.app_.on('ready', this.createWindow_)

        // Quit when all windows are closed.
        this.app_.on('window-all-closed', () => {
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                this.app_.quit()
            }
        })

        this.app_.on('activate', () => {
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (this.mainWindow_ === null) {
                this.createWindow_()
            }
        })

    }

    createWindow_() {
        this.mainWindow_ = new electron.BrowserWindow();
        this.mainWindow_.loadURL(url.format({
            pathname: path.join(__dirname, '../index.html'),
            protocol: 'file:'

        }))

        // Open the DevTools.
        this.mainWindow_.webContents.openDevTools()

        // Emitted when the window is closed.
        this.mainWindow_.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            this.mainWindow_ = null
        })
    }
}