const {app, BrowserWindow, ipcMain} = require('electron')
const createBrowserWindows = require('./modules/createWindow.js')
const createDialog = require('./modules/dialog.js')
const dialog = createDialog(require('electron').dialog)
const path = require('path')

const reload = 1
if(reload == 1){
    require("electron-reload")(__dirname, {
        electron: require(`${__dirname}/node_modules/electron`),
    });
}
 
const windows = createBrowserWindows({
    BrowserWindow, 
    ipcMain,
    devTools: true,
})

app.on('ready', ()=>{
    windows.createMain({
        width: 1170, 
        height: 655,
        frame: true,
        source: path.join(__dirname, './windows/main'),
    }, init)
})
app.on('window-all-closed', ()=>{
    app.exit();
    app.quit();
});

function init(){
    windows.main.show()
}