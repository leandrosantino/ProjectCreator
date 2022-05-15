function createPageHome(window){
    const path = require('path')
    const pathPackage = '../../../../src/projectModel/package.json'
    const package_ = require(pathPackage)
    const fs = require('fs')
    const events = window.events

    function createPage(){
        const ejs = window.ejs 

        function getElements(){
            page.name = document.querySelector('#name')
            page.local = document.querySelector('#local')
            page.btlocal = document.querySelector('#btlocal')
            page.create = document.querySelector('#btCreate')
        }

        function render(dados){
            const html = ejs.create(path.join(__dirname, './home.ejs'), dados) 
            app.innerHTML = html
            getElements()
        }

        const page = {
            render,
        }
        
        return page
    }

    function createLogicCore(){

        function createProject(name, local){
            return new Promise((resolve, reject)=>{
                if(name && local){

                    package_.name = name
                    fs.writeFileSync(
                        path.join(__dirname, pathPackage),
                        JSON.stringify(package_, null, 4),
                        {encoding:"utf-8", indent: 4}
                    )
                    
                    var ncp = require('ncp').ncp;
                    ncp.limit = 16;
    
                    const source = path.join(__dirname, '../../../../src/projectModel')
                    const destini = path.join(local, name)
                    
                    ncp(source, destini,(err)=>{
    
                        if (err) {
                            reject(err);
                        }
                        resolve('Folders copied recursively');
    
                    });
                    
                }else{
                    window.ipc.send('dialogError', 'Preencha todos os campos para continuar!')
                }
            })
        }

        function setLocal(input){
            const local = window.ipc.sendSync('getlocal')
            console.log(local)
            input.value = local
        }

        function init(){
            console.log('init')
            events.send('render', {})
        }

        return {
            init,
            print,
            createProject,
            setLocal,
        }

    }

    const page = createPage()
    const logicCore  = createLogicCore()

    events.on('render', (args)=>{
        page.render(args)

        events.DOM('click', page.btlocal, ()=>{
            logicCore.setLocal(page.local)
        })
        events.DOM('click', page.create, ()=>{
            logicCore.createProject(page.name.value, page.local.value)
                .then(()=>{
                    window.ipc.sendSync('dialog', 'Project created successfully!!!')
                    page.name.value = ''
                    page.local.value = ''
                })
        })
        
    })

    return {
        render: logicCore.init,
    }
}

module.exports = createPageHome