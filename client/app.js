const { app, BrowserWindow, ipcMain } = require('electron')
const { v4: uuidv4 } = require('uuid');
const screenshot = require('screenshot-desktop');

var socket = require('socket.io-client')('http://192.168.0.115:5000');
// var socket = require('socket.io-client')('http://192.168.0.103:5000');
// var socket = require('socket.io-client')('http://localhost:5000');
// var socket = require('socket.io-client')('http://127.0.0.1:5000');
var interval;

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.removeMenu();
    win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    // if platform is mac don't quit in background.
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on("start-share", function(event, arg) {

    var uuid = uuidv4();
    socket.emit("join-message", uuid);
    event.reply("uuid", uuid);

    interval = setInterval(function() {
        screenshot().then((img) => {
            var imgStr = new Buffer(img).toString('base64');

            var obj = {};
            obj.room = uuid;
            obj.image = imgStr;

            socket.emit("screen-data", JSON.stringify(obj));
        })
    }, 100)
})

ipcMain.on("stop-share", function(event, arg) {
    clearInterval(interval);
})


socket.on('connect', () => {
    console.log('Successfully connected to the server!');
});

socket.on('connect_error', (error) => {
    console.error('Connection failed:', error);
});