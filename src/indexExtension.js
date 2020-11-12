document.addEventListener('DOMContentLoaded', run = () => {
    chrome.storage.sync.get(null, r => {
        console.log(r)
        if(!r.runFlag) StartUserInterface('app')
    })
    createApp();
});



function createApp() {
    window.addEventListener('render', () => {
        window.SVGInject(document.querySelectorAll("img.icon"))
    })
    state.constructor({
        runWidgetApp: ""
    })
    render(document.querySelector('#app'), 'App')
}

function App() {
    chrome.storage.sync.get(null, r => {
        state.update('state.runWidgetApp', r.runFlag)
    })

    return  `
        <div class="column">
           <div class="row">
                Статус: ${state.runWidgetApp ? "Запущено" : "Незапущено"}
                <div jclick="${useHandler(() => {chrome.storage.sync.set({runFlag: false}); run()})}">
                    <img src="https://unpkg.com/ionicons@5.0.0/dist/svg/reload.svg" class="icon">
                </div>
           </div>
        </div>
    `
}