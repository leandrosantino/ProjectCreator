const app = document.querySelector('#app')

try{

    const home = window.pages.create('home', window)

    window.events.on('teste', (args)=> console.log(args))
    
    home.render()


}catch(err){
    console.log('app-error', err)
}