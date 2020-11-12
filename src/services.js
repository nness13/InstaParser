const ParseArea = '#react-root div, div[role=presentation] div, div[role=dialog] div';
const buttonLikePost = 'div[role="dialog"] article div section span button[type="button"]';
const buttonLikePostInRecomendation = 'article > div:nth-child(3) > section:nth-child(1) span:nth-child(1) button';
const buttonLoadComments = `span[aria-label="Load more comments"]`;
const buttonUnFollowUser = '#react-root > section > main > div > header > section > div.nZSzR > div:nth-child(3) > div > span > span.vBF20._1OSdk > button';
const buttonUnFollowUserNoAkMe = '#react-root > section > main > div > header > section > div.nZSzR > button';
const buttonUnFollowUserAccess = 'body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.-Cab_';

const mainUserButton = '#react-root > section > nav > div._8MQSO.Cx7Bp > div > div > div.ctQZg > div > div:nth-child(5) > span';
const mainUserLink = '#react-root > section > nav > div._8MQSO.Cx7Bp > div > div > div.ctQZg > div > div:nth-child(5) > div:nth-child(3) > div > div.uo5MA._2ciX.tWgj8.XWrBI > div._01UL2 > a:nth-child(1)';
const mainFollowersButton = '#react-root > section > main > div > header > section > ul > li:nth-child(2) > a';
const mainFollowingButton = '#react-root > section > main > div > header > section > ul > li:nth-child(3) > a';


let DEBUG_FLAG_SERVICE = true

// Всі дії з аккаунтом
let task, couterTasks;


function ServiceGetUserList() {
    if(DEBUG_FLAG_SERVICE) console.log('Додаю слушатели к інстаграм')
    inspectionHTML('addEventListener')
}


function inspectionHTML(action) {
    let inst_root = document.querySelector('body')
    inst_root.querySelectorAll(ParseArea).forEach(el => {
        el[action]('mouseenter', enterInspetionEl)
        el[action]('mouseleave', leaveInspetionEl)
        el[action]('click', clickInspectionEl);
    });
}

function clickInspectionEl(e) {
    e.preventDefault();
    e.stopPropagation();
    openApp()
    let inst_root = document.querySelector('body')
    inst_root.querySelectorAll(ParseArea)
        .forEach(el => leaveInspetionEl({target: el}));
    inspectionHTML('removeEventListener')
    // getLinksFollowers(e.target)
}
function enterInspetionEl(e){
    let border = `dotted 2px red`
    // if(e.target.scrollHeight > e.target.clientHeight) border = `solid 3px green`
    Object.assign(e.target.style, {
        border: border
    });
}
function leaveInspetionEl(e){
    Object.assign(e.target.style, {
        border: `none`
    });
}


function autoDivGetUserLink(param = null) {
    if(DEBUG_FLAG_SERVICE) console.log('----------------------------------------------');
    if(DEBUG_FLAG_SERVICE) console.log('Задача...', 'autoDivGetUserLink');
    if(DEBUG_FLAG_SERVICE) console.log('Параметри...', param);

    if(state.service.collectUserListService.stop) return

    if(location.href.includes('www.instagram.com/p/')){
        if(document.querySelector('body > div.RnEpo.Yx5HN')){
            let root = document.querySelector('body > div.RnEpo.Yx5HN > div > div > div.Igw0E.IwRSH.eGOV_.vwCYk.i0EQd > div')
            handleUserList({links: document.querySelectorAll('body > div.RnEpo.Yx5HN a[title]')})

            setTimeout(function nextCircle() {
                let links = document.querySelectorAll('body > div.RnEpo.Yx5HN a[title]')
                console.log(root.scrollHeight !== root.scrollTop + root.clientHeight)
                if(root.scrollHeight !== root.scrollTop + root.clientHeight){
                    console.log(links[links.length-1].getAttribute('jSelectUser'))
                    if(links[links.length-1].getAttribute('jSelectUser')) setTimeout(nextCircle, 100)
                    else autoDivGetUserLink(param)
                }else{
                    window.dispatchEvent(new CustomEvent('UsersCollectSuccess'))
                }
            }, 200)
        }else{
            let links = document.querySelectorAll('h3 div a')
            if(loadMoreUsers()) next()
            else {
                handleUserList({links: document.querySelectorAll('h3 div a')})
                window.dispatchEvent(new CustomEvent('UsersCollectSuccess'))
            }

            function next() {
                if(document.querySelectorAll('h3 div a').length > links.length) setTimeout(() => autoDivGetUserLink(param), 1000)
                else setTimeout(next, 100)
            }
      /*      let links = document.querySelectorAll('h3 div a')
            console.log(links)
            handleUserList({links: links})
            let load = loadMoreUsers()

            setTimeout(function nextCircle() {
                let links = document.querySelectorAll('h3 div a')
                if(load){
                    console.log('Підгрузка коментарів', load)
                    if(links[links.length-1].getAttribute('jSelectUser')) {
                        console.log('Вибраний останній елемент', links[links.length-1].getAttribute('jSelectUser'))

                        setTimeout(nextCircle, 100)
                    }
                    else autoDivGetUserLink(param)
                }
            }, 200)*/
        }
    }else{
        let linksSelector = 'body > div.RnEpo.Yx5HN a[title]'
        let root = document.querySelector('body > div.RnEpo.Yx5HN > div > div > div.isgrP')
        if(!root) return alert('Відкрийте сторінку з користувачами')
        handleUserList({links: document.querySelectorAll(linksSelector)})

        loadMoreListener()

        function loadMoreListener() {
            let links = document.querySelectorAll(linksSelector)

            let list = document.querySelector('body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div.PZuss')
            let isPreloader = document.querySelector('body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li.wo9IH.QN7kB > div')
            let whiteSpace = document.querySelector('body > div.RnEpo.Yx5HN > div > div > div.isgrP > div.oMwYe')

            let lastItemIsSelect = links[links.length-1].getAttribute('jSelectUser')

            // console.log('Лист з користувачами : ', list)
            // console.log('Прелоадер : ', isPreloader)
            // console.log('Вказує що не кінець : ', whiteSpace)

            if(list) {
                if(!isPreloader){
                    if(!lastItemIsSelect) {
                        if(!whiteSpace) window.dispatchEvent(new CustomEvent('UsersCollectSuccess'))
                        autoDivGetUserLink(param)
                    }
                    else setTimeout(loadMoreListener, 200)
                }
            }else if(isPreloader) setTimeout(loadMoreListener, 200)
        }
    }
}

function startGetUserList() {
    state.update('state.service', data => data.collectUserListService.stop = false)
    window.addEventListener('UsersCollectSuccess', () => {
        state.update('state.service', data => data.collectUserListService.stop = true)
    }, {once: true})
}

function handleUserList(param = null){
    if(DEBUG_FLAG_SERVICE) console.log('----------------------------------------------');
    if(DEBUG_FLAG_SERVICE) console.log('Задача...', 'handleUserList');
    if(DEBUG_FLAG_SERVICE) console.log('Параметри...', param);

    param.links.forEach(item => {
        if(!item.getAttribute('jselectuser')) {
            console.log(item.getAttribute('href'))
            saveUserItem({domLinkEl: item})
            item.scrollIntoView({block: "center", behavior: "smooth"});
            item.setAttribute('jselectuser', 'true')
        }
    })
    saveUserListFunction()
}

function loadMoreUsers(param = null) {
    let btn = document.querySelector(buttonLoadComments)
    if(btn !== null) {
        btn.scrollIntoView({block: "center", behavior: "smooth"});
        btn.click()
        return true
    }else return false
}

function saveUserItem(param) {
    let {domLinkEl} = param
    let itemParent = getUserItemDomParent({item: domLinkEl})

    let userItem = {
        title: domLinkEl.getAttribute('href').split('/')[1],
        img: itemParent.querySelector('img').getAttribute('src'),
        pathname: domLinkEl.getAttribute('href')
    }

    // console.log('Зберігаю в...', saveUserList)
    if(!saveUserList.find(el => el.title === userItem.title) && !state.App.initialAccount.frozenList.includes(userItem.title)) {
        // console.log( 'Додаю...', userItem )
        saveUserList.push(userItem)
    }
}

function getUserItemDomParent(param) {
    let {item} = param
    let autoParentDiv = 0;
    if(autoParentDiv === 0) {
        for (let t = 0; autoParentDiv === 0; t++){
            item = item.parentElement
            if(item.querySelector('img')) autoParentDiv = t+1
        }
    }else for(let t = 0; t < autoParentDiv; t++) item = item.parentElement

    return item
}




function getMainAccountLink(e){
    document.querySelector(mainUserButton).click()
    let link = document.querySelector(mainUserLink).getAttribute('href')
    document.querySelector('#react-root > section > nav > div._8MQSO.Cx7Bp > div > div > div.ctQZg > div > div:nth-child(5) > div:nth-child(3) > div > div.wgVJm').click()
    return link
}
function getMainData(me){
    fetch(`https://www.instagram.com/${me}/?__a=1`).then(response => {
        response.json().then(res => {console.log(res.qraphql.user)})
    })
}
function getFollowers(me){
    if(window.location.pathname === `/${me}/`) {
        state.update('state.App.initialAccount', data => {
            data.followers.status = 'loading'
            data.followers.list = []
        })

        document.querySelector(mainFollowersButton).click()
        setTimeout(() => {
            window.saveUserList = state.App.initialAccount.followers.list
            window.saveUserListFunction = () => state.update('state.App.initialAccount')
            window.addEventListener('UsersCollectSuccess', () => {
                console.log('Кінець...')
                state.update('state.App.initialAccount', data => data.followers.status = 'ok')
            });
            startGetUserList()
            autoDivGetUserLink()
        }, 1000)

    } else window.location.pathname = `/${me}/`
}
function getFollowing(me){
    if(window.location.pathname === `/${me}/`) {
        state.update('state.App.initialAccount', data => {
            data.following.status = 'loading'
            data.following.list = []
        })

        document.querySelector(mainFollowingButton).click()
        setTimeout(() => {
            window.saveUserList = state.App.initialAccount.following.list
            window.saveUserListFunction = () => state.update('state.App.initialAccount')
            window.addEventListener('UsersCollectSuccess', () => {
                console.log('Кінець...')
                state.update('state.App.initialAccount', data => data.following.status = 'ok')
            });
            startGetUserList()
            autoDivGetUserLink()
        }, 1000)



    } else window.location.pathname = `/${me}/`
}






// Компонування задач
function openPage(param) {
    if(DEBUG_FLAG_SERVICE) console.log('----------------------------------------------------------------');
    if(DEBUG_FLAG_SERVICE) console.log('Задача... ', 'openPage');
    if(DEBUG_FLAG_SERVICE) console.log('Параметри...', param);

    if(DEBUG_FLAG_SERVICE) console.log('Запускаю поточну дію...', task)

    if(task && task.userList.length === 0) {
        if(DEBUG_FLAG_SERVICE) console.log('UserList пустий - видаляю задачу...')
        state.update('state.taskManager', state.taskManager.filter(el => el.status !== 'run'))
        if(DEBUG_FLAG_SERVICE) console.log('Завершення... Запускаю наступну задачу...')
        return RoutineStarterTasks(true)
    }

    if(DEBUG_FLAG_SERVICE) console.log('Перевіряю url...', window.location.pathname, task.userList[0].pathname, window.location.pathname === task.userList[0].pathname)
    if(window.location.pathname === task.userList[0].pathname) setTimeout(param.next, 1000)
    else window.location.pathname = task.userList[0].pathname

    // openPage(task.userList[0].title, follow)
}

function follow(param){
    if(DEBUG_FLAG_SERVICE) console.log('----------------------------------------------------------------');
    if(DEBUG_FLAG_SERVICE) console.log('Задача... ', 'follow');
    if(DEBUG_FLAG_SERVICE) console.log('Параметри...', param);

    if(document.querySelector('#react-root > section > main > div > p')){
        cleanToAddUnFollowList(); param.next()
        return
    }
    let button = document.querySelector('header section button')
    if(button){
        if(window.getComputedStyle(button).color === "rgb(255, 255, 255)"){
            if(DEBUG_FLAG_SERVICE) console.log('Ok, Підписуюсь...')
            button.click()

            logSuccessedAction(JSON.parse(JSON.stringify({
                action: task.action,
                type: task.type,
                params: {
                    user: task.userList[0]
                },
                time: Date.now()
            })))

        }else if(DEBUG_FLAG_SERVICE) console.log('Ви вже стежите за цим користувачем...')

        cleanToAddUnFollowList()
        return param.next()
    }else return setTimeout(() => follow(param), 1000)

    function cleanToAddUnFollowList() {
        if(task.type !== 'vip'){
            state.service.unfollow_list.push(task.userList[0])
            state.update('state.service')
            if (DEBUG_FLAG_SERVICE) console.log('Додаю в UnFollowing лист ...', state.service.unfollow_list)

            task.userList.splice(0, 1)
            if (DEBUG_FLAG_SERVICE) console.log('Видаляю користувача з задачі...', task)
            state.update('state.taskManager')
        }
    }
}

function unFollow(param){
    if(DEBUG_FLAG_SERVICE) console.log('----------------------------------------------------------------');
    if(DEBUG_FLAG_SERVICE) console.log('Задача... ', 'unFollow');
    if(DEBUG_FLAG_SERVICE) console.log('Параметри...', param);

    if(document.querySelector('#react-root > section > main > div > p')){
        cleanToAddUnFollowList(); param.next()
        return
    }

    if(document.querySelector(buttonUnFollowUser)){
        param.button = document.querySelector(buttonUnFollowUser)
        if(DEBUG_FLAG_SERVICE) console.log('Перевіряю кнопку відписки...', window.getComputedStyle(param.button).color === "rgb(38, 38, 38)", param.button.firstElementChild.tagName, param.button.firstElementChild.firstElementChild.tagName)

        if(window.getComputedStyle(param.button).color === "rgb(38, 38, 38)" &&
                param.button.firstElementChild.tagName === 'DIV' &&
                param.button.firstElementChild.firstElementChild.tagName === 'SPAN'){
            unFollowAction(param)
        }else{
            if(DEBUG_FLAG_SERVICE) console.log('Ви не стежите за цим користувачем...')
            cleanToAddUnFollowList()
            return RoutineStarterTasks(false)
        }
    }else if(document.querySelector(buttonUnFollowUserNoAkMe)) {
        param.button = document.querySelector(buttonUnFollowUserNoAkMe)
        unFollowAction(param)
    }
    else return setTimeout(() => unFollow(param), 1000)


}

function cleanToAddUnFollowList() {
    if(DEBUG_FLAG_SERVICE) console.log('Перевіряю на наявність в unFollowList та видаляю...', state.service.unfollow_list.filter(el => el.title !== task.userList[0].title))
    state.service.unfollow_list = state.service.unfollow_list.filter(el => el.title !== task.userList[0].title)
    state.update('state.service')

    task.userList.splice(0, 1)
    if(DEBUG_FLAG_SERVICE) console.log('Видаляю користувача з задачі...', task)
    state.update('state.taskManager')
}

function unFollowAction(param) {
    let {button} = param

    if(DEBUG_FLAG_SERVICE) console.log('Ok, Відписуюсь...', button)
    button.click()

    function accessAction() {
        let access = document.querySelector(buttonUnFollowUserAccess)
        console.log(access)
        if(!access) return setTimeout(accessAction, 1000)

        if(DEBUG_FLAG_SERVICE) console.log('Ok, Відписуюсь...', access)
        access.click()

        logSuccessedAction(JSON.parse(JSON.stringify({
            action: task.action,
            type: task.type,
            params: {
                user: task.userList[0]
            },
            time: Date.now()
        })))

        cleanToAddUnFollowList()
        param.next() //   Виконана дія
    }
    setTimeout(accessAction, 1500)
}


function openUserPost(param) {
    if(DEBUG_FLAG_SERVICE) console.log('----------------------------------------------------------------');
    if(DEBUG_FLAG_SERVICE) console.log('Задача... ', arguments.callee.name);
    if(DEBUG_FLAG_SERVICE) console.log('Параметри...', param);

    let posts = document.querySelectorAll('article div.weEfm a')
    if(DEBUG_FLAG_SERVICE) console.log('Перевіряю пост...', posts)
    if(DEBUG_FLAG_SERVICE) console.log('Перевіряю пост з вказаним в параматрах чиcлом по рахунку...', posts[param.post])

    if (!document.querySelector('#react-root > section > main > div')) return setTimeout(() => openUserPost(param), 1000)
    // if(!document.querySelector('#react-root > section > main > div > div.fx7hk')) return RoutineStarterTasks(false)

    if (posts[param.post]) {
            posts[param.post].scrollIntoView({block: "center", behavior: "smooth"});
            setTimeout(() => {
                posts[param.post].click()
                setTimeout(param.next, 1000)
            }, 500)
        } else param.next()
}


function like(param) {
    if(DEBUG_FLAG_SERVICE) console.log('----------------------------------------------------------------');
    if(DEBUG_FLAG_SERVICE) console.log('Задача... ', arguments.callee.name);
    if(DEBUG_FLAG_SERVICE) console.log('Параметри...', param);

    let button = document.querySelector(param.button)

    if(DEBUG_FLAG_SERVICE) console.log('button', button)
    if(button) {
        if(DEBUG_FLAG_SERVICE) console.log('Like post', button.querySelector("svg").getAttribute('fill'), button.querySelector("svg").getAttribute('fill') === '#262626')
        if (button.querySelector("svg").getAttribute('fill') === '#262626') {
            if(DEBUG_FLAG_SERVICE) console.log('Like post...', button)

            button.scrollIntoView({block: "center", behavior: "smooth"});
            button.click()

            setTimeout(() => {
                checkLike(param)
            },500)
        }
    }
    param.next()
}

function likePost(param) {
    if(DEBUG_FLAG_SERVICE) console.log('----------------------------------------------------------------');
    if(DEBUG_FLAG_SERVICE) console.log('Задача... ', arguments.callee.name);
    if(DEBUG_FLAG_SERVICE) console.log('Параметри...', param);

    like({
        button: buttonLikePost,
        next: () => {
            if(param.back) window.history.back()
            param.next()
        }
    } )
}


function like_posts(param){
    if(DEBUG_FLAG_SERVICE) console.log('----------------------------------------------------------------');
    if(DEBUG_FLAG_SERVICE) console.log('Задача... ', arguments.callee.name);
    if(DEBUG_FLAG_SERVICE) console.log('Параметри...', param);

    let links = document.querySelectorAll(buttonLikePostInRecomendation);
    for (let i = 0; i < links.length; i++) like({...param, button: buttonLikePostInRecomendation})
}

function checkLike(param) {
    if(DEBUG_FLAG_SERVICE) console.log('----------------------------------------------------------------');
    if(DEBUG_FLAG_SERVICE) console.log('Задача... ', arguments.callee.name);
    if(DEBUG_FLAG_SERVICE) console.log('Параметри...', param);

    if(document.querySelector('#react-root > section > main > div > p'))
        return  removeLikeAction(param)

    let button = document.querySelector(param.button)

    if(DEBUG_FLAG_SERVICE) console.log('проверяю лайк', button.querySelector("svg").getAttribute('fill'))
    if(button.querySelector("svg").getAttribute('fill') === "#ed4956")
        removeLikeAction(param)
    else setTimeout(() => checkLike(param),500)
}

function removeLikeAction(param) {
    if(DEBUG_FLAG_SERVICE) console.log('----------------------------------------------------------------');
    if(DEBUG_FLAG_SERVICE) console.log('Задача... ', arguments.callee.name);
    if(DEBUG_FLAG_SERVICE) console.log('Параметри...', param);

    logSuccessedAction(JSON.parse(JSON.stringify({
        action: task.action,
        type: task.type,
        params: {
            path: location.pathname
        },
        time: Date.now()
    })))
    param.next()
}


function vipTasker() {
    couterTasks = state.service.log_Task_action.length
    console.log(state.service.log_Task_action.length)
    console.log(couterTasks % 2)
    if (!(couterTasks % 2)) {
        console.log('Vip Task Run', )
        let vip_t = state.service.vip_task
        vip_t.list[vip_t.step].userList.map(nw => {
            state.service.log_Task_action.map(ol => {
                if(ol.params.hasOwnProperty('user') && nw.title === ol.params.user.title) {
                    vip_t.successAction.push(nw)
                }
            })
        })

        vip_t.list[vip_t.step].userList = vip_t.list[vip_t.step].userList.filter(e =>
            !vip_t.successAction.find(s => s.title === e.title) &&
            !state.App.initialAccount.following.list.find(s => s.title === e.title)
        )
        console.log(vip_t.list[vip_t.step].userList)

        if(vip_t.list[vip_t.step].userList.length !== 0) task = vip_t.list[vip_t.step]
    }
}


function Starter() {
    task = state.taskManager.find(el => el.status === 'run')
    if(DEBUG_FLAG_SERVICE) console.log('Читаю задачу... ', task);

    if(!task) return ;

    if(DEBUG_FLAG_SERVICE) console.log('Перевіряю ліміти...')
    let lastFollowActionsInDay = [], lastFollowActionsInHour = []
    let lastLikeActionsInDay = [], lastLikeActionsInHour = []
    state.service.log_Task_action.map(el => {
        if(el.account === state.App.initialAccount.login.value){
            if (el.action === 'autoFollow' || el.action === 'autoUnFollow') {
                if (el.time > (Date.now() - (24 * 60 * 60 * 1000))) {
                    lastFollowActionsInDay.push(el)
                }
                if (el.time > (Date.now() - (60 * 60 * 1000))) {
                    lastFollowActionsInHour.push(el)
                }
            }
            if (el.action === 'autoLikeFeed' || el.action === 'autoLikeFirstPostUserList' || el.action === 'autoLikeAllPost') {
                if (el.time > (Date.now() - (24 * 60 * 60 * 1000))) {
                    lastLikeActionsInDay.push(el)
                }
                if (el.time > (Date.now() - (60 * 60 * 1000))) {
                    lastLikeActionsInHour.push(el)
                }
            }
        }
    })
    if(DEBUG_FLAG_SERVICE) console.log('Читаю задачі з таким типом за останній час... ', state.service.log_Task_action);
    if(DEBUG_FLAG_SERVICE) console.log('Limit Follow Hour...', lastFollowActionsInHour.length, '/', state.service.config.limits.followToHour.value)
    if(DEBUG_FLAG_SERVICE) console.log('Limit Follow Day...', lastFollowActionsInDay.length, '/', state.service.config.limits.followToDay.value)
    if(DEBUG_FLAG_SERVICE) console.log('Limit Like Hour...', lastLikeActionsInHour.length, '/', state.service.config.limits.likeToHour.value)
    if(DEBUG_FLAG_SERVICE) console.log('Limit Like Day...', lastLikeActionsInDay.length, '/', state.service.config.limits.likeToDay.value)



    if( lastFollowActionsInDay.length > state.service.config.limits.followToDay.value && lastFollowActionsInHour.length > state.service.config.limits.followToHour.value &&
        lastLikeActionsInDay.length > state.service.config.limits.likeToDay.value && lastLikeActionsInHour.length > state.service.config.limits.likeToHour.value ) {
        if(DEBUG_FLAG_SERVICE) console.log('Досягнуто ліміту... Запускаю наступну задачу...')
        return RoutineStarterTasks(true)
    }

    if(state.App.version !== "pro") vipTasker()

    let timeoutTime
    switch (task.action) {
        case 'getUserList':

            break;

        case 'autoFollow':
            timeoutTime = random_between(task.option.timeout.min, task.option.timeout.max, 1000)/2 // :2 - повторюється, відкриває сторінку -> підписується
            if(DEBUG_FLAG_SERVICE) console.log('Час до запуску дії... ', timeoutTime)
            setTimeout(
                () => openPage({
                    next: () => follow({
                        next: () => RoutineStarterTasks(false)
                    })
                }), timeoutTime)
            break;

        case 'autoUnFollow':
            timeoutTime = random_between(task.option.timeout.min, task.option.timeout.max, 1000)/2 // :2 - повторюється, відкриває сторінку -> підписується
            if(DEBUG_FLAG_SERVICE) console.log('Час до запуску дії... ', timeoutTime)
            setTimeout(
                () => openPage({
                    next: () => unFollow({
                        next: () => RoutineStarterTasks(false)
                    })
                }), timeoutTime)
            break;

        case 'autoLikeFeed':
            timeoutTime = random_between(task.option.timeout.min, task.option.timeout.max, 1000)/2 // :2 - повторюється, відкриває сторінку -> підписується
            if(DEBUG_FLAG_SERVICE) console.log('Час до запуску дії... ', timeoutTime)
            setTimeout(
                () => like_posts({next: () => RoutineStarterTasks(false)}),
                timeoutTime)
            break;

        case 'autoLikeFirstPostUserList':
            timeoutTime = random_between(task.option.timeout.min, task.option.timeout.max, 1000)/2 // :2 - повторюється, відкриває сторінку -> підписується
            if(DEBUG_FLAG_SERVICE) console.log('Час до запуску дії... ', timeoutTime)
            setTimeout(
                () => openPage({
                    next: () => openUserPost({
                        post: 1,
                        next: () => likePost({
                            back: false,
                            next: () => {
                                task.userList.splice(0, 1)
                                if(DEBUG_FLAG_SERVICE) console.log('Видаляю користувача з задачі...', task)
                                state.update('state.taskManager')

                                RoutineStarterTasks(false)
                            }
                        })
                    })
                }), timeoutTime)
            break;

        default:
            RoutineStarterTasks(true)
            console.log('Невідома задача')
    }
}

function RoutineStarterTasks(next) {
    // if(state.App.key)
    if(state.service.config.limits.autoNextTask.switch && !next) next = lastOneType()

    function lastOneType() {
        let fromLast = (n) => state.service.log_Task_action[state.service.log_Task_action.length - ( n + 1 )]

        for (let i = 0; i < parseInt(state.service.config.limits.autoNextTask.value); i++) {
        /*      console.log('allItems', state.service.log_Task_action)
                console.log('lastItem', fromLast(i),
                'Не VIP: ', fromLast(i).type !== 'vip',
                'Action: ', fromLast(i).action === state.taskManager.find(el => el.status === 'run').action,
                'Підходить: ', fromLast(i).type !== 'vip' && fromLast(i).action === state.taskManager.find(el => el.status === 'run').action)
*/
            let last = fromLast(i)
            if (!(last && last.type !== 'vip' && last.action === state.taskManager.find(el => el.status === 'run').action))
                return false
        }
        // state.update('state.taskManager', () => state.taskManager.find(el => el.status = 'default'))
        return true
    }
    if(DEBUG_FLAG_SERVICE) console.log('RoutineStarterTasks, з параметром запуску наступної задачі в ', next)

    if(next) {
        let nowTask;
        state.taskManager.find((el, k) => { nowTask = k; return el.status === 'run' })
        console.log(nowTask)
        if(typeof nowTask === 'undefined') switchStatusTask(state.taskManager[0])
        else {
            if(state.taskManager[nowTask + 1]) switchStatusTask(state.taskManager[nowTask + 1])
            else switchStatusTask(state.taskManager[0])
        }
        Starter()
    } else {
        Starter()
    }
}



// Utils 
function logSuccessedAction(note) {
    note = {...note, account: state.App.initialAccount.login.value}
    if(note.params.hasOwnProperty('user'))
        state.App.initialAccount.frozenList.push(note.params.user.title)
    // Логуємо нову дію
    if(DEBUG_FLAG_SERVICE) console.log('Додаємо в лог поточну дію... ', note)
    state.service.log_Task_action.push(note)

    if(DEBUG_FLAG_SERVICE) console.log('Оновлення интерфейсу...')
    state.update('state.service')
}


function switchStatusTask(next) {
    let prev = state.taskManager.find(el => el.status === 'run')
    console.log('Зупиняю', prev)
    console.log('Запускаю', next)

    if(prev) prev.status = 'default';
    if(next) next.status = 'run'
    state.update('state.taskManager')
}


// function openPage(username) {
//     let inputSearch = document.querySelector('nav input')
//     let inputButtonClick = inputSearch.parentElement.querySelector('div[role=button]')
//
//     inputButtonClick.click()
//     if(DEBUG_FLAG_SERVICE) console.log('Шукаю користувача в пошуку...')
//     setTimeout(searchUser, 1000)
//
//     function searchUser() {
//         inputSearch.value = username
//         let event = new Event('input', {
//             'bubbles': true,
//             'cancelable': true
//         });
//         inputSearch.dispatchEvent(event);
//         setTimeout(() => {
//             let linkUser = inputSearch.parentElement.querySelector(`a[href="/${username}/"]`)
//             if(linkUser === null) {
//                 inputSearch.value = ''
//                 if(DEBUG_FLAG_SERVICE) console.log('Не знайшов... Повертаюсь до пошуку...')
//                 searchUser()
//             } else {
//                 if(DEBUG_FLAG_SERVICE) console.log('Знайшов... Відкриваю...')
//                 linkUser.click()
//                 setTimeout(isUserPage, 1000)
//                 function isUserPage() {
//                     if(window.location.pathname === `/${username}/`) param.next()
//                     else {
//                         if(DEBUG_FLAG_SERVICE) console.log('Очікую загрузки сторінки...')
//                         setTimeout(isUserPage, 1000)
//                     }
//                 }
//             }
//         },1000)
//     }
// }