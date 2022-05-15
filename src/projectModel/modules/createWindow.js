function createBrowserWindows(BrowserWindow, ipcMain){

    const path = require('path')
    const devTools = true
    const icon = path.join(__dirname, '../Pictures/Icon2.ico')

    class MainWindow{
        constructor(args, callback){
            Object.keys(args).forEach(key =>{
                this[key] = args[key]
            })
            return this.create(callback)
        };

        create(callback){
            this.window = new BrowserWindow({
                width: this.width,
                height: this.height,
                icon: icon,
                title: 'Finance',
                frame: this.frame,
                minHeight: this.height,
                minWidth: this.width,
                titleBarOverlay: {
                    color: 'rgb(211, 211, 211)',
                    symbolColor: '#2f3241',
                },
                show: false,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: true,
                    devTools: devTools,
                    enableRemoteModule: false,
                    preload: path.join(this.source, 'preload.js')
                }
            })
            this.window.loadFile(path.join(this.source, 'index.html'))
            this.window.once('ready-to-show', ()=>{
                callback()
            });
            return this.window
        };
        
    }

    class ModalWindow{
        constructor(args){
            Object.keys(args).forEach(key =>{
                this[key] = args[key]
                this.isOpen = false
            })
        };

        show(callback = Function){
            this.window = new BrowserWindow({
                parent: this.parent,
                resizable: false,
                icon: icon,
                autoHideMenuBar: true,
                frame: this.frame,
                titleBarOverlay: {
                    color: 'rgb(211, 211, 211)',
                    symbolColor: '#2f3241',
                },
                show: false,
                minimizable: false,
                maximizable: false,
                movable: true,
                width: this.width,
                height: this.height,
                modal: true,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: true,
                    devTools: devTools,
                    enableRemoteModule: false,
                    preload: path.join(this.source, 'preload.js')
                }
            })
            
            if(!this.isOpen){                
                this.window.loadFile(path.join(this.source, 'index.html'))
                this.window.once('ready-to-show', ()=>{
                    
                    this.window.show()
                    callback()
                    this.isOpen = true
                });
                this.window.on('close', ()=>{
                    this.isOpen = false
                })
            }
        };

        get(){
            return this.window
        };

        close(){
            this.window.close()
            this.isOpen = false
        }        
    }

    function createMain(args, callback){
        windows['main'] = new MainWindow(args, callback)
    }

    function create(name, args){
        windows[name] = new ModalWindow(args)

        ipcMain.on(`open_${name}`, (event)=>{
            windows[name].show()
            if(args.onOpen){
                args.onOpen()
            }
            event.returnValue = true
            
        })
        ipcMain.on(`close_${name}`, (event)=>{
            windows[name].close()
            if(args.onClose){
                args.onClose()
            }
            event.returnValue = true
        })

    }

    const windows = {
        createMain,
        create,
    }

    return windows
    
}

module.exports = createBrowserWindows