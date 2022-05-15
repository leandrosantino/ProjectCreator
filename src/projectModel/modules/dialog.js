function createDialog(dialog){

    function Directory(args = {
        title,
        openFile,
        openDirectory,
        multSelection,
        window,
        sync: false,
    }){

        const options = {
            title: args.title,
            properties: []
        }

        args.openFile ? options.properties.push('openFile' ): null
        args.openDirectory ? options.properties.push('openDirectory'): null
        args.multSelection ? options.properties.push('multiSelections'): null


        if(args.sync){
            return dialog.showOpenDialogSync(args.window, options)
        }else{
            return dialog.showOpenDialog(args.window, options)
        }
    }
    
    function Success(args={
        title,
        msg,
        type,
        window,
        sync: false,
        
    }){
        const options = {
            title: args.title,
            message: args.msg,
            type:  args.type,
        }

        if(args.sync){
            return dialog.showMessageBoxSync(args.window, options);
        }else{
            return dialog.showMessageBox(args.window, options);
        }


    }

    function error(msg){
        dialog.showErrorBox('Alerta!!', msg)
    }

    return {
        Directory,
        Success,
        error
    }


}

module.exports = createDialog