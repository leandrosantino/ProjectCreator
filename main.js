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

const windows = createBrowserWindows({
    BrowserWindow, 
    ipcMain,
    devTools: false,
})

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
            title: args.title,
            openDirectory: true,
            window: windows[args.window]
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
            msg: args.msg,
            type:  'info',
            window: windows[args.window],
            sync: true
        });
        event.returnValue = resp
    })

}