/*    Basic Component   */
function LeftPanel(props){
    state.dependencies = ['state.Library']

    let newTask = () => {
        let id = random_between(0, 1000)
        state.update('state.taskManager', () => {
            state.taskManager = state.taskManager.filter(t => t.status !== 'create')
            state.taskManager.push({
                id: id,
                name: '_'+id,
                action: '',
                type: 'default',
                option: {
                    timeout:{
                        min: 20,
                        max: 50
                    },
                },
                userList: [],
                step: 'typeTask',
                status: 'create'
            })
        })
        state.update('state.route', routes.task(id))
    }
    let selectTemplates = e => {
        console.log(e)
        state.update('state.Library', () => {
            state.Library.templates[state.Library.thisTempaltes] = state.taskManager
            state.Library.thisTempaltes = e.target.value
        })
        state.update('state.taskManager', () => {
            state.taskManager = state.Library.templates[e.target.value]
        })

    }

    return `
        <div class="LeftPanel column" style="justify-content: space-between">
            <div>
                <div class="btn" style="width: 100%" 
                    jclick="${useHandler(newTask)}">Додати задачу</div>
                    ${Object.keys(state.Library.templates).length !== 0
                        ? `<select class="gradientText" jchange="${useHandler(selectTemplates)}">
                                ${Object.keys(state.Library.templates).map(o => 
                                    `<option ${state.Library.thisTempaltes === o ? `selected` : ``}>${o}</option>`
                                )}
                            </select>`
                        : ``
                    }
                <TaskerList/>
            </div>
            <div>
                <div style="width: 100%;">
                    <div class="row" style="margin-bottom: 5px; justify-content: space-between">
                        <div jclick="${useHandler(e => confirm("Видалити усі задачі") ? state.update('state.taskManager', []) : '')}" title="Видалити всі">
                            <img src="${iconLink}/trash.svg" class="icon" style="fill: var(--ColorNightSolid);stroke: var(--ColorNightSolid)">
                        </div>
                        <div jclick="${useHandler(() => state.update('state.route', routes.libraryExport()))}" title="Створити шаблон">
                            <img src="${iconLink}/push.svg" class="icon" style="fill: var(--ColorNightSolid);stroke: var(--ColorNightSolid)">
                        </div>
                        <div jclick="${useHandler(e => state.update('state.route', 'History'))}" title="Журнал дій">
                            <img src="${iconLink}/stats-chart.svg" class="icon" style="fill: var(--ColorNightSolid);stroke: var(--ColorNightSolid)">
                        </div>
                    </div>
                    <div style="width: 100%" class="btn" 
                            jclick="${useHandler(() => state.update('state.route', 'Library'))}">Завантажити шаблон</div>
                </div>
            </div>
        </div>
    `
}














function TaskerList(props) {
    state.dependencies = ['state.taskManager', "state.route"] //Вказуєм залежності

    let isWorkService = state.taskManager.find(o => o.status === 'run')
    return `
        <div class="TaskerList">
            <div class="TaskerListEl">
                <div style="width: 60%">Назва</div>
                <div class="actionsIcon">Статус</div>
            </div>
            ${state.taskManager.map(el =>
                `<div class="TaskerListEl">
                    <div style="width: 60%; overflow: auto" id="title">${el.name}</div>
                    <div class="actionsIcon">
                        <div jclick="${useHandler(e => state.update('state.taskManager', state.taskManager.filter(o => o.id !== el.id)) )}">
                            <img src="${iconLink}/trash.svg" class="icon">
                        </div>
                        <div jclick="${useHandler(e => state.update('state.route', routes.task(el.id)) )}">
                            <img src="${iconLink}/pencil-sharp.svg" class="icon">
                        </div>
                        ${{
                            create: `<div jclick="${useHandler(e => state.update('state.route', routes.task(el.id)) )}">
                                        <img src="${iconLink}/sync.svg" class="icon ${state.route.includes('task/') ? 'icon_loading' : ''}">
                                    </div>`,
                            default: `<div jclick="${useHandler(e => {
                                                        if(!isWorkService){
                                                            switchStatusTask(state.taskManager.find(o => o.id === el.id))
                                                            RoutineStarterTasks()
                                                        }
                                                    })}">
                                            <img src="${iconLink}/play.svg" class="icon ${isWorkService ? "beColor" : ""}">
                                        </div>`,
                            run:    `<div jclick="${useHandler(e => {
                                                state.update('state.taskManager',
                                                    () => state.taskManager.find(o => o.id === el.id).status = 'default')
                                            })}">
                                        <img src="${iconLink}/pause.svg" class="icon">
                                    </div>`,
                        }[el.status]}
                    </div>
                </div>`
            ).join('')}
        </div>
    `
}















function Container() {
    state.dependencies = ['state.route']
    function router() {
        if(state.route === routes.default()) return `<Home/>`
        if(state.route === routes.auth()) return `<Initial/>`
        if(state.route === routes.settings()) return `<Settings/>`
        if(state.route === routes.history()) return `<ActionHistory/>`
        if(state.route === routes.library()) return `<Library/>`
        if(state.route === routes.libraryExport()) return `<LibraryExport/>`

        if(state.route.includes(`task/`)) return `<Task/>`
        if(state.route.includes('ImportUserList/')) return `<ImportUserList/>`
    }
    return `
        <div>
            ${router()}
        </div>
    `
}





function Library() {
    state.dependencies = ['state.Library']
    onCreate(() => {
        console.log('OnCreate status', state.Library.status)
        fetch("https://substudio.tk/api/bot/library/template/all").then(response => {
            response.json().then(res => {
                console.log(res)
                if(res.status === 200) {
                    state.update('state.Library', () => {
                        state.Library.shopTemplates = [...res.data]
                        state.Library.status = 'success'
                    })
                }
            })
        }).catch(() => {
            console.log('error')
        });
    })

    let saveTemplates = (el) => {
        if(el.name !== 'default')
            state.update('state.Library', () => {
                state.Library.templates[el.name] = JSON.parse(el.package)
                state.Library.templates.Default = state.taskManager
                state.Library.thisTempaltes = el.name
            })
    }

    return `
        <div class="Container">
            ${{
                start: `
                    <div class="preloader">
                        <div class="cssload_container">
                            <div class="cssload_whirlpool"></div>
                        </div>
                    </div>
                `,
                success: `
                    ${state.Library.shopTemplates.map(el => `
                        <div class="lic">
                            <div class="column liw">
                                <div class="lin gradientText">${el.name}</div>
                                <div class="lid">${el.description}</div>
                                <div class="row" style="justify-content: center">
                                    <div class="btn" style="width: 100%;" jclick="${useHandler(() => saveTemplates(el))}">Завантажити</div>
                                </div>
                            </div>
                        </div>
                    `)}               
                `
            }[state.Library.status] || ''}
        </div>
    `
}




function LibraryExport() {
    state.dependencies = []
    let {template, setTemplate} = useState({
        template: {
            name: generateRandomString(),
            description: '',
            account: state.App.initialAccount.login.value,
            package: '',
            config: {
                emptyList: false,
            },
            status: 'ok'
        }
    });
    let exportLibrary = () => {
        template.package = JSON.parse(JSON.stringify(state.taskManager))
        if(template.config.emptyList) template.package.map(el => { el.userList = [] })
        fetch("https://substudio.tk/api/bot/library/template/all", {
            "headers": {
                "content-type": "application/json",
            },
            "body": JSON.stringify(template),
            "method": "POST"
        }).then(response => {
            response.json().then(res => {
                console.log(res)
            })
        }).catch(() => {
            console.log('error')
        });
    }

    return `
        <div class="Container" style="padding: 5px 10px 5px 10px; display: flex; flex-direction: column; justify-content: space-between">
            <div>
                <div class="row" style="justify-content: space-between; align-items: center">
                    <div>Назва пакета: </div>
                    <input type="text" value="${template.name}" style="width: 220px" jfocus="taskNameInput"
                        jinput="${useHandler(e => {
                        template.name = e.currentTarget.value
                        setTemplate()
                    } )}">
                </div>
                <div class="row" style="justify-content: space-between; align-items: center">
                    <div>Опис: </div>
                    <textarea style="width: 220px"
                        jfocus="description" 
                        jinput="${useHandler(e => {
                            console.log(e.currentTarget.value)
                            template.description = e.currentTarget.value
                            setTemplate()
                        } )}">${template.description}</textarea>
                </div>
                <div class="gradientText" style="text-align: center">Параметри упаковки</div>
                <Switcher ${toProps({
                    text: 'Включати UserList',
                    initValue: template.config.emptyList,
                    handler: (e, id) => {
                        template.config.emptyList = !template.config.emptyList
                        setTemplate()
                    }
                })}/>
            </div>
            <div style="display: flex; flex-direction: row; justify-content: flex-end; align-items: center" jclick="${useHandler(exportLibrary)}">
                <div style="cursor: pointer">Готово</div>
                        <img style="margin: 3px 5px 3px 10px" src="${iconLink}/arrow-forward.svg" class="icon">
            </div>
        </div>
    `
}













function Initial() {
    state.dependencies = ['state.App.initialAccount']
    let {login, followers, following, status} = state.App.initialAccount

/*    useEffect(() => {
        if(status === 'noverify'){
            console.log('Get Username')
            state.update('state.App.initialAccount', data => {
                data.status = 'loading'
                data.followers.status = 'no'
                data.following.status = 'no'
                data.login.value = getMainAccountLink().split('/')[1]
                data.login.status = 'ok'
            })
        }

        if(login.status === 'ok' && status === 'loading') {
            if(followers.status === 'no') getFollowers(login.value)
            if(followers.status === 'ok' && following.status === 'no') getFollowing(login.value)
            if(following.status === 'ok') successGetAccountData()
        }
        // getMainData(login.value)
    })*/

   /* function successGetAccountData() {
        state.update('state.App.initialAccount', (data) => {
            switch (data.callback.type) {
                case "notMutual":
                    let task = state.taskManager.find(t => t.id === parseInt(data.callback.param))

                    state.service.noMutualFollowList = data.following.list.filter(u =>
                        ( !data.frozenList.includes(u.title) && !data.followers.list.find(i => i.title === u.title) ) )

                    task.userList = [...task.userList, ...state.service.noMutualFollowList]

                    state.update('state.route', `task/${data.callback.param}`)
                default:
                    state.update('state.route', '/')
            }

            data.status = 'verify'
            data.callback.type = ''
            data.callback.param = ''
        })

    }*/
    return `
        <div class="Container">
            <div class="row" style="margin: 10px 10px 0 10px">
                ${{
                    no: `<img src="${iconLink}/warning-outline.svg" class="icon" style="margin-right: 10px; stroke:red">`,
                    loading: `<img src="${iconLink}/sync.svg" class="icon icon_loading beColor" style="margin-right: 10px">`,
                    ok: `<img src="${iconLink}/checkbox.svg" class="icon beColor" style="margin-right: 10px">`,
                }[login.status]}
                <img src="${iconLink}/information.svg" class="icon beColor" style="margin-right: 5px;">
                
                <div>Аккаунт: ${login.value}</div>
            </div>
            <div class="row" style="margin: 10px 10px 0 10px">
                ${{
                    no: `<img src="${iconLink}/warning-outline.svg" class="icon" style="margin-right: 10px; stroke:red">`,
                    loading: `<img src="${iconLink}/sync.svg" class="icon icon_loading beColor" style="margin-right: 10px">`,
                    ok: `<img src="${iconLink}/checkbox.svg" class="icon beColor" style="margin-right: 10px">`,
                }[followers.status]}
                <img src="${iconLink}/information.svg" class="icon beColor" style="margin-right: 5px;">
                
                <div>Followers: ${followers.list.length}</div>
            </div>   
            <div class="row" style="margin: 10px 10px 0 10px">
                ${{
                    no: `<img src="${iconLink}/warning-outline.svg" class="icon" style="margin-right: 10px; stroke:red">`,
                    loading: `<img src="${iconLink}/sync.svg" class="icon icon_loading beColor" style="margin-right: 10px">`,
                    ok: `<img src="${iconLink}/checkbox.svg" class="icon beColor" style="margin-right: 10px">`,
                }[following.status]}
                <img src="${iconLink}/information.svg" class="icon beColor" style="margin-right: 5px;">
                
                <div>Following: ${following.list.length}</div>
            </div>      
            <img style="height: 100%" src="https://j-inn.com/assets/main/Jinn2.svg">
        </div>
    `
}


















function ImportUserList(){
    state.dependencies = ['state.taskManager']
    let param = state.route.split('/')
    let task = state.taskManager.find(t => t.id === parseInt(state.route.split('/')[1]))

    let search = () => { // Обробник для SearchPanel
        let result = [{title: 'Недавні підписки', action: ''},{title: 'Невзаимние подписки', action: ''}]
        state.taskManager.map(el => {
            if ( (el.action.toLowerCase()+el.name.toLowerCase()).includes(state.Search.value.toLowerCase()) )
                result.push({title: el.name, action: el.id})
        })
        state.update('state.Search.resultList', result)
    }
    let itemSearchList = el => {
        return `
            <div class="SRItem gradientText" jclick="${useHandler(e => {
                        state.update('state.route', `task/${param[1]}`)
                        if(el.title === 'Недавні підписки') {
                            state.update('state.taskManager', () => {
                                task.userList = [...task.userList, ...state.service.unfollow_list]
                            })
                        } else if(el.title === 'Невзаимние подписки') {
                            state.update('state.App.initialAccount', data => {
                                data.status = 'noverify'
                                data.callback.type = 'notMutual'
                                data.callback.param = param[1]
                            })
                            state.update('state.route', routes.auth())
                        } else {
                            state.update('state.taskManager', () => {
                                task.userList = [...task.userList, ...state.taskManager.find(t => t.id === el.action).userList]
                            })
                        }
                
                        state.update('state.Search.viewResultList', false)
                        state.update('state.Search.resultList', [{title: 'пусто', action: 'пусто'}])
                    })}">
                ${el.title}
            </div>`
    }
    search()
    return `
        <div class="Container">
           <div class="flexContainer">
                <div class="linePanel">
                    <SearchPanel ${toProps({ handler: search, itemSearchList: itemSearchList})}/>
                </div>
                <img style="height: 100%" src="https://j-inn.com/assets/main/Jinn2.svg">
            </div>
        </div>
    `
}
























function BottomPanel(props){
    return `
        <div class="BottomPanel">
            <div class="leftDiv">
                <div class="item row">
                    <img style="margin: 0 2px;width: 15px!important; height: 15px!important;" src="https://j-inn.com/assets/main/list.svg">
                    <div class="itemText">Меню</div>
                </div>
            </div>
            
            <div class="lampDiv" jclick="${useHandler(() => state.update('state.route', '/') )}">
                <img src="https://j-inn.com/assets/main/magic-lamp.svg"/>
            </div>
            
            <div class="rightDiv">
                <div class="item row" jclick="${useHandler(() => {})}">
                    <img style="margin: 0 2px;color: " src="https://unpkg.com/ionicons@5.1.0/dist/svg/notifications.svg" class="icon">
                </div>
                <div class="item row" jclick="${useHandler(() => state.update('state.route', routes.settings()) )}">
                    <img style="margin: 0 2px;color: " src="https://unpkg.com/ionicons@5.1.0/dist/svg/settings-sharp.svg" class="icon">
                </div>
            </div>
        </div>
    `
}
















/*   Container Component   */
function Home(props){
    return `
        <div class="Container">
            <img style="height: 100%" src="https://j-inn.com/assets/main/Jinn2.svg">
        </div>
    `
}



















function ActionHistory(props){
    state.dependencies = ['state.service']
    return `
        <div class="Container">
            <div class="column" style="margin: 5px 10px">
                <div class="row" style="justify-content: space-between; margin-bottom: 5px">
                    <div class="centerText gradientText">Задача</div>
                    <div class="centerText gradientText">Дія</div>
                    <div class="centerText gradientText">Час</div>
                </div>
                ${state.service.log_Task_action.filter(i => i.account === state.App.initialAccount.login.value).map(el => {
                    let date = new Date(el.time)
                    return `
                        <div class="row" style="justify-content: space-between; margin-bottom: 5px">
                            <div class="centerText">${el.action}</div>
                            <a href="/${el.params.user ? el.params.user.title : '/'}" target="_blank" class="centerText">${el.params.user ? el.params.user.title : el.params}</a>
                            <div class="centerText beColor">${date.getHours()}:${date.getMinutes()}</div>
                        </div>
                    `
                }).join('')}
            </div>
        </div>
    `
}


















function Settings(props){
    state.dependencies = ['state.service.config.*']
    let limits = state.service.config.limits
    return `
        <div class="Container">
            <div class="gradientText" style="margin: 5px 10px 0 10px;text-align: center">Про Аккаунт</div>
            <div style="margin: 5px 10px 0 10px">Username: ${state.App.initialAccount.login.value}</div>
            <div class="row" style="align-items: center">
                <div style="margin: 5px 10px 0 10px">Followers: ${state.App.initialAccount.followers.list.length}</div>
                <div style="margin: 5px 10px 0 10px">Following: ${state.App.initialAccount.following.list.length}</div>
                <div style="margin: 0 2px;" jclick="${useHandler(() => {
                            state.update('state.App.initialAccount', data => data.status = 'noverify')
                            state.update('state.route', routes.auth())
                        })}">
                    <img src="https://unpkg.com/ionicons@5.1.0/dist/svg/reload-circle.svg" class="icon beColor">
                </div>
            </div>
            
            <div class="gradientText" style="margin: 5px 10px 0 10px;text-align: center">Загальні налаштування</div>
            <div style="margin: 5px 10px 0 10px">
                <Switcher ${toProps({
                    text: 'По закінченні задачі запускати наступну',
                    initValue: state.service.config.limits.autoNextTask.switch,
                    handler: (e, id) => {
                        state.service.config.limits.autoNextTask.switch = !state.service.config.limits.autoNextTask.switch
                        state.update('state.service')
                    }
                })}/>
                <div class="row" style="justify-content: space-between; align-items: center">
                    <div class="row">
                        Кількість дій для запуску наступної задачі  
                        <div>
                            <img src="https://unpkg.com/ionicons@5.1.0/dist/svg/information.svg" class="icon beColor">
                        </div>
                    </div>
                    <input type="number" value="${limits.autoNextTask.value}" style="width: 50px" jfocus="autoNextTaskVal"
                            jinput="${useHandler(e => state.update('state.service', () => limits.autoNextTask.value = e.currentTarget.value))}">
                </div>
                                
                <div class="gradientText" style="margin: 5px 10px 0 10px;text-align: center">Ліміти по підпискам</div>
                
                <div class="row" style="justify-content: space-between; align-items: center">
                    <div class="row">
                        За 24 години
                        <div>
                            <img src="https://unpkg.com/ionicons@5.1.0/dist/svg/information.svg" class="icon beColor">
                        </div>
                    </div>
                    <input type="number" value="${limits.followToDay.value}" max="${limits.followToDay.max}" jfocus="followToDayVal" style="width: 50px"
                        jinput="${useHandler(e => state.update('state.service', () => limits.followToDay.value = e.currentTarget.value))}">
                </div>
                <div class="row" style="justify-content: space-between; align-items: center">
                    <div class="row">
                        За 1 годину
                        <div>
                            <img src="https://unpkg.com/ionicons@5.1.0/dist/svg/information.svg" class="icon beColor">
                        </div>
                    </div>
                    <input type="number" value="${limits.followToHour.value}" max="${limits.followToHour.max}" jfocus="followToHourVal" style="width: 50px"
                        jinput="${useHandler(e => state.update('state.service', () => limits.followToHour.value = e.currentTarget.value))}">
                </div>
                
               <div class="gradientText" style="margin: 5px 10px 0 10px;text-align: center">Ліміти по лайкам</div>
                <div class="row" style="justify-content: space-between; align-items: center">
                    <div class="row">
                        За 24 години
                        <div>
                            <img src="https://unpkg.com/ionicons@5.1.0/dist/svg/information.svg" class="icon beColor">
                        </div>
                    </div>
                    <input type="number" value="${limits.likeToDay.value}" max="${limits.likeToDay.max}" jfocus="followToDayVal" style="width: 50px"
                        jinput="${useHandler(e => state.update('state.service', () => limits.likeToDay.value = e.currentTarget.value))}">
                </div>
                 <div class="row" style="justify-content: space-between; align-items: center">
                    <div class="row">
                        За 1 години
                        <div>
                            <img src="https://unpkg.com/ionicons@5.1.0/dist/svg/information.svg" class="icon beColor">
                        </div>
                    </div>
                    <input type="number" value="${limits.likeToHour.value}" max="${limits.likeToHour.max}" jfocus="followToDayVal" style="width: 50px"
                        jinput="${useHandler(e => state.update('state.service', () => limits.likeToHour.value = e.currentTarget.value))}">
                </div>
                
            </div>
        </div>
    `
}




















function Task(props) {
    state.dependencies = ['state.taskManager']
    let task = state.taskManager.find(t => t.id === parseInt(state.route.split('/')[1]))
    console.log(task)
    if(!task) state.update('state.route', '/')

    function router() {
        if(task.step === 'typeTask') return `<TaskStepAction ${toProps({task})}/>`
        if(task.step === 'userList') return `<TaskUserList ${toProps({task})}/>`
        if(task.step === 'taskParams') return `<TaskParams ${toProps({task})}/>`
    }
    return `
        <div class="Container">
            ${router()}
        </div>
    `
}

















function TaskStepAction(props){
    state.dependencies = ['state.taskManager']
    let search = () => { // Обробник для SearchPanel
        let result = []
        createTaskMap.map(el => {
            if ( (el.title.toLowerCase() +"|"+ el.action.toLowerCase()).includes(state.Search.value.toLowerCase()) )
                result.push({title: el.title, action: el.action})
        })
        state.update('state.Search.resultList', result)
    }
    let itemSearchList = el => {
        return `<div class="SRItem gradientText" jclick="${useHandler(e => {
                    props.task.action = el.action
                    props.task.name = el.action+'_'+props.task.id
                    props.task.step = 'userList'
                    state.update('state.taskManager')
            
                    state.update('state.Search.viewResultList', false)
                    state.update('state.Search.resultList', [{title: 'пусто', action: 'пусто'}])
                })}">
            ${el.title}
        </div>`
    }
    return `
        <div class="flexContainer">
            <div class="linePanel">
                <SearchPanel ${toProps({ handler: search, itemSearchList: itemSearchList })}/>
            </div>
            <img style="height: 100%" src="https://j-inn.com/assets/main/Jinn2.svg">
        </div>
    `
}













function TaskUserList() {
    state.dependencies = ['state.taskManager', 'state.service']
    let task = state.taskManager.find(t => t.id === parseInt(state.route.split('/')[1]))
    let clearList = () => state.update('state.taskManager', () => task.userList = [])
    let inspectionRun = () => {
        hiddenApp();
        window.saveUserList = task.userList
        window.saveUserListFunction = () => state.update('state.taskManager')
        ServiceGetUserList()
    }
    let autoSearchDivList = () => {
        startGetUserList()
        window.saveUserList = task.userList
        window.saveUserListFunction = () => state.update('state.taskManager')
        autoDivGetUserLink({})
    }

    return `
        <div class="wrapCreateList column">
            <div class="row" style="height: calc(100% - 40px)">
                <div class="ListUser column">
                    <div class="itemList" style="justify-content: space-between">
                        <div>Кол: ${task.userList.length} </div>
                        <div class="row">
                            <div jclick="${useHandler(() => state.update('state.route', `ImportUserList/${state.route.split('/')[1]}`) )}">
                                <img style="margin: 0 3px" src="${iconLink}/attach.svg" class="icon beColor">
                            </div>
                            <div jclick="${useHandler(clearList)}">
                                <img style="margin: 0 2px" src="${iconLink}/person-remove.svg" class="icon beColor">
                            </div>
                            ${state.service.collectUserListService.stop
                                ? `<div jclick="${useHandler(autoSearchDivList)}">
                                        <img style="margin: 0 2px" src="${iconLink}/person-add.svg" class="icon beColor">
                                    </div>`
                                : `<div jclick="${useHandler( () => state.update('state.service', data => data.collectUserListService.stop = true) )}">
                                        <img style="margin: 0 2px" src="${iconLink}/pause.svg" class="icon beColor">
                                    </div>`
                            }
                            <div jclick="${useHandler(inspectionRun)}">
                                <img style="margin: 0 2px" src="${iconLink}/open.svg" class="icon beColor">
                            </div>
                        </div>
                    </div>
                    ${task.userList.map(el =>
                        `<div class="itemList">
                            <img src="${el.img}" style="width: 30px; height: 30px"/>
                            <a href="${el.pathname}" target="_blank" style="width: 100%;">${el.title}</a>
                            <div jclick="${useHandler(() => 
                                    state.update('state.taskManager', () => task.userList = task.userList.filter(o => o.title !== el.title))
                                )}">
                                <img src="${iconLink}/close.svg" class="icon beColor">
                            </div>
                        </div>`
                    ).join('')}
                </div>
            </div>
            <PrevNextPanel ${toProps({task})} />
        </div>
    `
}










function TaskParams() {
    let task = state.taskManager.find(t => t.id === parseInt(state.route.split('/')[1]))
    let {followTimeoutMin} = state.service.config.limits
    console.log(task)
    let {str, setStr} = useState({str: generateRandomString()})
    console.log(str)

    return `
        <div class="wrapCreateList column">
            <div style="margin: 5px 10px 0 10px">
                <div class="row" style="justify-content: space-between; align-items: center">
                    <div>Назва: </div>
                    <input type="text" value="${task.name}" style="width: 220px" jfocus="taskNameInput"
                            jinput="${useHandler(e => state.update('state.taskManager', () => task.name = e.currentTarget.value ) )}">
                </div>
                
                <div class="gradientText" style="margin: 5px 10px 0 10px;text-align: center">Таймаути</div>
                <div class="row" style="justify-content: space-between; align-items: center">
                    <div class="row">
                        Таймаут між діями
                        <div>
                            <img src="https://unpkg.com/ionicons@5.1.0/dist/svg/information.svg" class="icon beColor">
                        </div>
                    </div>
                    <div class="row" style="align-items: center">
                        <input type="number" value="${parseInt(task.option.timeout.min)}" min="${followTimeoutMin.min}" style="width: 50px" jfocus="minTimeoutFollow"
                            jinput="${useHandler(e => state.update('state.taskManager', () => task.option.timeout.min = e.currentTarget.value ) )}">
                        <img src="https://unpkg.com/ionicons@5.1.0/dist/svg/git-commit.svg" class="icon beColor">
                        <input type="number" value="${parseInt(task.option.timeout.max)}" min="${followTimeoutMin.min + 20}" style="width: 50px" jfocus="maxTimeoutFollow"
                            jinput="${useHandler(e => state.update('state.taskManager', () => task.option.timeout.max = e.currentTarget.value) )}">
                    </div>
                </div>
            </div>
            <PrevNextPanel ${toProps({task})}/>
        </div>
    `
}







function PrevNextPanel(props) {
    let map = createTaskMap.find(t => t.action === props.task.action)
    let prev = isPrevStep(props.task.step, map.next)
    let next = isNextStep(props.task.step, map.next)
    let prevStepHandler = e => {props.task.step = prev.action;state.update('state.taskManager')}
    let nextStepHandler = e => {props.task.step = next.action;state.update('state.taskManager')}
    let successHadler = () => {
        props.task.status = 'default'
        state.update('state.taskManager')
        state.update('state.route', '/')
    }

    return `
        <div class="row" style="justify-content: space-between">
            ${prev
                ?   `<div jclick="${useHandler(prevStepHandler)}">
                        <img style="margin: 10px" src="${iconLink}/arrow-back.svg" class="icon">
                    </div>`
                :   `<div></div>`
            }
            
            <div class="row" style="align-items: center">
                <img style="margin: 10px" src="${iconLink}/compass.svg" class="icon beColor">
                ${props.task.step}
            </div>
            
            ${next
                ?   `<div class="row" style="align-items: center"
                            jclick="${useHandler(nextStepHandler)}">
                        <div style="cursor: pointer">Далі</div>
                        <img style="margin: 10px" src="${iconLink}/arrow-forward.svg" class="icon">
                    </div>`
                :   `<div class="row" style="align-items: center"
                            jclick="${useHandler(successHadler)}">
                        <div style="cursor: pointer">Готово</div>
                        <img style="margin: 10px" src="${iconLink}/arrow-forward.svg" class="icon">
                    </div>`
            }
        </div>
    `
}



















/*    Common Component    */
function SearchPanel(props){
    state.dependencies = ['state.Search', 'state.Search.value']

    return `
        <div class="SearchPanel">
             <div class="SearchD">
                <div style="padding: 5px">
                    <img src="${iconLink}/search.svg" class="icon" style="cursor: default; fill:#bec7d5">
                </div>
                
                <div class="inputD">
                    <input value="${state.Search.value}" jfocus="SearchInput"
                        jclick="${useHandler(() => {state.update('state.Search.viewResultList', true); props.handler()})}"
                        jinput="${useHandler(e => {state.update('state.Search.value', e.currentTarget.value); state.update('state.Search.viewResultList', true); props.handler()})}"
                        jkeydown="${useHandler(e => {if(e.code === "Enter") console.log(e.code)})}"/>
                </div>
                
                <div class="SearchTool">
                    ${state.Search.value.length !== 0
                        ?   `<div class="clearSearch" 
                                    jclick="${useHandler(() => state.update('state.Search.value', "") )}">
                                <img src="${iconLink}/close.svg" class="icon" style="fill:#bec7d5">
                            </div>`
                        :   ``
                    }
                   <img src="${iconLink}/options.svg" class="icon">
                </div>
            </div>
            <SearchResult ${toProps({ itemSearchList: props.itemSearchList })}/>
        </div>
    `
}


















function SearchResult(props){
    state.dependencies = ['state.Search.resultList', 'state.Search.viewResultList']
    let closeSResult = () => {
        state.update('state.Search.viewResultList', false)
        state.update('state.Search.resultList', [{title: 'пусто', action: 'пусто'}])
    }
    // console.log(props)
    return `
        <div class="SearchResult" style="visibility: ${state.Search.viewResultList ? 'visible' : 'hidden'}"
                jmouseleave="${useHandler(closeSResult)}">
            <div id="w">
                ${state.Search.resultList.map(props.itemSearchList).join('')}
            </div>
        </div>
    `
}










function Switcher(props){
    let id = 'switch_'+generateRandomString()
    return `
        <div class="row" style="justify-content: space-between;">
            <div>${props.text}</div>
            <input type="checkbox" id="${id}" class="checkbox" ${props.initValue ? 'checked' : ''}
                jchange="${useHandler(e => props.handler(e) )}">
            <label for="${id}" class="switch"></label>
        </div>
    `
}




















let createTaskMap = [
    {
        title: "Збор списка пользователей",
        action: 'getUserList',
        next: {
            action: 'userList',
            next: {
                action: 'taskParams',
            }
        }
    },
    {
        title: "Подписка по спыску пользователей",
        action: 'autoFollow',
        next: {
            action: 'userList',
            next: {
                action: 'taskParams',
            }
        }
    },
    {
        title: "Отписка по спыску пользователей",
        action: 'autoUnFollow',
        next: {
            action: 'userList',
            next: {
                action: 'taskParams',
            }
        }
    },
    {
        title: "Лайкинг ленти новостей",
        action: 'autoLikeFeed',
        next: {
            action: 'taskParams',
        }
    },
    {
        title: "Лайк постов по спыску пользователей",
        action: 'autoLikeFirstPostUserList',
        next: {
            action: 'userList',
            next: {
                action: 'taskParams',
            }
        }
    },
]

let routes = {
    default: () => '/',
    home: () => 'Home',
    auth: () => 'Auth',
    settings: () => 'Settings',
    history: () => 'History',
    library: () => 'Library',
    libraryExport: () => 'Library/export',

    task: (id) => `task/${id}`,
}

















function isPrevStep(thisStep, map) {
    // let start = performance.now()

    let o = map, prev = false;
    // Знаходимо обєкт в якого: action === thisStep
    if(o && o.action){
        for(let i = 0; i < 10; i++ ) {
            if(o.action === thisStep) {
                if (i >= 0) break;
                else {
                    prev = false
                    break;
                }
            } else {
                prev = o
                if (o.hasOwnProperty('next')) o = o.next
                else break;
            }
        }
    }
    // console.log('end', performance.now() - start)

    return prev
}
function isNextStep(thisStep, map) {
    let o = map, result = false;
    // Знаходимо обєкт в якого: action === thisStep
    if(o && o.action){
        for(let i = 0; i < 10; i++ ) {
            if(o.action === thisStep) {
                if (o.hasOwnProperty('next')) result = o.next
                else result = false
                break ;
            } else {
                if (o.hasOwnProperty('next')) o = o.next
                else break ;
            }
        }
    }

    return result
}

let iconLink = `https://unpkg.com/ionicons@5.0.0/dist/svg`


// Акшени для State
let initialAccountAC = (changes) => {
    let k = 'state.App.initialAccount'
    changes(state.getStateFromKey(k))

}
