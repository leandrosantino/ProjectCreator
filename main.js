const {app, BrowserWindow, ipcMain} = require('electron')
const createBrowserWindows = require('./modules/createWindow.js')
const createDialog = require('./modules/dialog.js')
const dialog = createDialog(require('electron').dialog)
const path = require('path')

const reload = 0
if(reload == 1){
    require("electron-reload")(__dirname, {
        electron: require(`${__dirname}/node_modules/electron`),
    });
}

const windows = createBrowserWindows(BrowserWindow, ipcMain)

app.on('ready', ()=>{
    windows.createMain({
        width: 700, 
        height: 450,
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

    ipcMain.on('getlocal', (event, args)=>{
        dialog.Directory({
            title: 'Selecionar a pasta do projeto',
            openDirectory: true,
            window: windows.main
        }).then(resp => {
            if(!resp.canceled){
                event.returnValue = resp.filePaths[0]
            }else{
                event.returnValue = false
            };
        })
    })

    ipcMain.on('dialogError', (event, args)=>{
        dialog.error(args)
        event.returnValue = true
    })

    ipcMain.on('dialog', (event, args)=>{
        const resp = dialog.Success({
            title: 'Project Creator',
            msg: args,
            type:  'info',
            window: windows.main,
            sync: true
        });
        event.returnValue = resp
    })

}