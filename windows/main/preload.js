const contextBridge = require('../../src/projectModel/modules/globalPreload.js')()

contextBridge.addPages({
    'home': require('./pages/home/create.js')
})

contextBridge.init()