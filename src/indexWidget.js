createApp();

function createApp() {
    let divWidget = document.createElement('div');
    divWidget.setAttribute('id', 'JinnWidget')
    document.getElementsByTagName("body")[0].appendChild(divWidget)

    chrome.storage.sync.set({runFlag: true})
    window.addEventListener("unload", () => {
        chrome.storage.sync.set({runFlag: false})
        console.log('Демонтаж...')
    });
    window.addEventListener('render', () => {
        window.SVGInject(document.querySelectorAll("img.icon"))
    })

    // window.router = new JinnRouter();
    window.state.constructor({
        route: '/',
        arrSync: ['state.route', 'state.service', 'state.taskManager', 'state.Library',
            'state.App.version', 'state.App.key', 'state.App.initialAccount'],

        App: {
            hidden: false,
            heightPanel: 30,
            window: {
                top: '100px',
                left: '100px'
            },
            initialAccount: {
                login: {
                    value: '',
                    status: 'no'
                },
                followers: {
                    list: [],
                    status: 'no'
                },
                following: {
                    list: [],
                    status: 'no'
                },
                frozenList: [],
                callback: {
                    type: '',
                    param: ''
                },
                status: 'noverify',
            },
            version: "default",
            key: "",
        },
        taskManager: [
            /**
                 id: random_between(1, 1000),
                 action: state.taskCreator.task.type,
                 option: {
                    limits: {
                        min:  state.taskCreator.task.dataTask.min
                        max:  state.taskCreator.task.dataTask.max
                    }
                 },
                 userList: state.taskCreator.task.dataTask.userList,
                 status: 'default'
             */
        ],
        Library: {
            shopTemplates: [],
            templates: {},
            thisTempaltes: '',
            status: 'start',
        },

        Search: {
            value: "",
            viewResultList: false,
            resultList: [
                {
                    title: 'пусто',
                    action: 'пусто'
                }
            ]
        },

        service: {
            config: {
                /**
                 * modeOpenPage:
                 *      'location' - зміна url з перезагрузкою
                 *      'passive' - зміна url з допомогою пошуку інстаграм - вкладка повинна бути активна
                 *      'webApi' - JinnWebApi : робота з запросами
                 */
                modeOpenPage: 'location',
                limits: {
                    followToHour: {
                        max: 60,
                        value: 50
                    },
                    followToDay: {
                        max: 300,
                        value: 200
                    },
                    likeToHour: {
                        max: 60,
                        value: 50
                    },
                    likeToDay: {
                        max: 900,
                        value: 750
                    },
                    unFollowToDayNoMutualy: {
                        max: 300,
                        value: 300
                    },
                    unFollowToDayMutualy: {
                        max: 500,
                        value: 500
                    },

                    followTimeoutMin: {
                        min: 10,
                        max: 360,
                        value: 30
                    },
                    likeTimeoutMin: {
                        min: 10,
                        max: 360,
                        value: 30
                    },
                    autoNextTask: {
                        switch: true,
                        value: 100
                    },
                }
            },
            vip_task: {
                list: [],
                step: 0,
                successAction: [],
                filter: [],
            },
            unfollow_list: [],
            noMutualFollowList: [],
            like_list: [],
            collectUserListService: {
                userList: [],
                stop: true
            },
            log_Task_action: [],
            userInspectionList: [],
            console: [],
        }
    })
    window.db.constructor(() => {state.getSyncStorage()});

    setTimeout(() => render(document.querySelector('#JinnWidget'), 'App'), 500)
}

function App() {
/*    if(state.App.initialAccount.login.value !== getMainAccountLink().split('/')[1]) {
        state.update('state.App.initialAccount', data => data.status = 'noverify')
        state.update('state.route', 'Auth')
        console.log(state.App.initialAccount.login.value, getMainAccountLink().split('/')[1])
    }*/

    let keyboardshortcut = '';
    let keydown = e => {
        // console.log('keydown', keyboardshortcut)
        keyboardshortcut += e.code
    }
    let mousemove = e => {
        if(state.App.window.move){
            let windowDiv = document.querySelector("div.window")
            let rect = windowDiv.getBoundingClientRect();

            let moveTop = rect.top + e.y - state.App.window.cursorY
            let moveLeft = rect.left + e.x - state.App.window.cursorX
            state.App.window.cursorY = e.y
            state.App.window.cursorX = e.x

            moving(windowDiv, { top: `${moveTop}px`, left: `${moveLeft}px` })
        }
    }
    let keyup = e => {
        // console.log('keyup', keyboardshortcut)

        if (keyboardshortcut.includes('AltLeftKeyQ')) {
            keyboardshortcut = '';
            if (state.App.hidden) openApp()
            else hiddenApp()
        }
    }
    useEffect(() => {
        console.log('useEffect')
        document.addEventListener('keydown', keydown)
        document.querySelector('body').addEventListener('mousemove', mousemove)
        document.addEventListener('keyup', keyup)
    })
    unMount(() => {
        console.log('unmount')
        document.removeEventListener('keydown', keydown)
        document.querySelector('body').removeEventListener('mousemove', mousemove)
        document.removeEventListener('keyup', keyup)
    })


    if(state.App.initialAccount.status === 'verify') {
        fetch("https://substudio.tk/api/bot/acting", {
            "headers": {
                "content-type": "application/json",
            },
            "body": JSON.stringify(state.App.initialAccount),
            "method": "POST",
        }).then(response => {
            response.json().then(res => {
                console.log(res)
                if(res.status === 200) {
                    state.service.vip_task.list = res.data.tasks;
                    state.update('state.App.version', res.data.version)

                    let runTask = state.taskManager.find(t => t.status === 'run')
                    console.log('Перевіряю запущені задачі...', runTask)
                    if (runTask) RoutineStarterTasks(false)
                }
            })
        }).catch(() => {
            console.log('error')
        });
    }

    return `
        <div class="wrap" id="fixedWrap">
            <div class="window" style="top: ${state.App.window.top};left: ${state.App.window.left};">
               <SystemPanel/>
                <div class="App" action="typeApp">
                    <LeftPanel/>
                    <Container/>
                    <BottomPanel/>
                </div>
            </div>
        </div>
    `
}


function SystemPanel() {
    state.dependencies = ['state.App.hidden']

    let closeApp = () => {
        console.log('Закриваю интерфейс...')
        document.querySelector('#fixedWrap').remove()

        console.log('Шукаю запущені задачі, зупиняю...')
        let task = state.taskManager.find(t => t.status === 'run')
        if(task) task.status = 'default'

        chrome.storage.sync.set({autorun: false})
        chrome.storage.sync.set({runFlag: false})
        console.log('Зупиняю автозапуск...')
    }

    return `
        <div class="SystemPanel" 
                jmousedown="${useHandler((e) => {
                        if(e.button === 0) {
                            state.App.window.move = true
                            state.App.window.cursorY = e.y
                            state.App.window.cursorX = e.x
                        }
                    })}"
                jmouseup="${useHandler(() => state.App.window.move = false)}">
            <div class="settingToolWindow">
                <div><img src="https://j-inn.com/assets/main/magic-lamp.svg"></div>                    
            </div>
            <div class="row">
                <div class="row">
                   
                   <UrlViewer/>
                </div>                    
            </div>
            <div class="remoteToolWindow">
                ${state.App.hidden 
                    ? `<div jclick="${useHandler(openApp)}"><img src="https://unpkg.com/ionicons@5.0.0/dist/svg/caret-up.svg" class="icon" style="fill:#bec7d5"></div>`
                    : `<div jclick="${useHandler(hiddenApp)}"><img src="https://unpkg.com/ionicons@5.0.0/dist/svg/caret-down.svg" class="icon" style="fill:#bec7d5"></div>`
                }
                <div jclick="${useHandler(closeApp)}"><img src="https://unpkg.com/ionicons@5.0.0/dist/svg/close-circle.svg" class="icon" style="fill:palevioletred"></div>
            </div>
        </div>
    `
}


function UrlViewer() {
    state.dependencies = ['state.route']
    return `
        <div style="color: #e0e0e0">${state.route}</div>
    `
}








function moving(el, style){
    Object.assign(el.style, style);

    if( !isNaN(parseInt(style.top)) ){
        if(parseInt(style.top) >= window.innerHeight - state.App.heightPanel) {
            if (!state.App.hidden) state.update('state.App.hidden', true)
        } else if (state.App.hidden) state.update('state.App.hidden', false)
    }
}

function hiddenApp() {
    let windowDiv = document.querySelector("div.window")
    state.App.window.top = windowDiv.getBoundingClientRect().y+"px"
    state.App.window.left = windowDiv.getBoundingClientRect().x+"px"
    Object.assign(document.querySelector('div#fixedWrap').style, {
        width: `0`,
        height: `0`
    });

    moving(windowDiv, {top: `${window.innerHeight - state.App.heightPanel}px`, left: `100px`})
}

function openApp() {
    let windowDiv = document.querySelector("div.window")

    document.querySelector('div#fixedWrap').style = ""
    moving(windowDiv, {top: state.App.window.top, left: state.App.window.left})
}
