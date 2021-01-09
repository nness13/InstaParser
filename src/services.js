const savedPostPath = "#react-root > section > main > div > div > div.Igw0E.IwRSH.eGOV_._4EzTm > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > a > div"
const postAutorPath = "body > div._2dDPU.CkGkG > div.zZYga > div > article > header > div.o-MQd.z8cbW > div.PQo_0.RqtMr > div.e1e1d > span > a"
const nextPostButtonPath = "body > div._2dDPU.CkGkG > div.EfHg9 > div > div > a.coreSpriteRightPaginationArrow"

const directContainer = "#react-root > section > div > div.Igw0E.IwRSH.eGOV_._4EzTm > div > div > div.oNO81 > div.Igw0E.IwRSH.eGOV_._4EzTm.i0EQd > div > div > div > div"
const directLoader = "#react-root > section > div > div.Igw0E.IwRSH.eGOV_._4EzTm > div > div > div.oNO81 > div.Igw0E.IwRSH.eGOV_._4EzTm.i0EQd > div > div > div > div > div.Igw0E.rBNOH.YBx95._4EzTm.HVWg4"


let DEBUG_FLAG_SERVICE = true

// Всі дії з аккаунтом
let task, couterTasks;

function getUserList(options) {
    if(state.service.collectUserListService.stop) return ;
    let task = state.taskManager.find(t => t.id === parseInt(state.route.split('/')[1]))

    if (window.location.pathname.split("/")[2] === "saved") {
        const postsDiv = document.querySelector(savedPostPath)
        if(postsDiv) {
            console.dir(postsDiv)
            postsDiv.click()
            setTimeout(() => getUserList(options), 100)
        }
    }else if(window.location.pathname.split("/")[1] === "p"){
        const postsAutorDiv = document.querySelector(postAutorPath)
        const nextPostButtonDiv = document.querySelector(nextPostButtonPath)
        if(postsAutorDiv){
            console.dir(postsAutorDiv)
            if(!task.userList.find(n => n.title === postsAutorDiv.text)) {
                state.update('state.taskManager', () => task.userList.push({
                    img: "",
                    title: postsAutorDiv.text
                }));

                nextPost(nextPostButtonDiv, options)
            }else{
                nextPost(nextPostButtonDiv, options)
            }
        }else setTimeout(() => getUserList(options), 100)
    }else if(window.location.pathname.includes("/direct/inbox")){
        const directContainerDiv = document.querySelector(directContainer)
        const directLoaderDiv = document.querySelector(directLoader)

        if(!directLoaderDiv || directLoaderDiv.children.length === 0){
            parseTitle(directContainerDiv, options)
        }else if(directLoaderDiv.children.length > 0){
            console.log('Подгрузка пользователей')
            options.k = 0
            setTimeout(() => getUserList(options), 300)
        }

    }




        // Util
    function parseTitle(directContainerDiv, options) {
        Array.from(directContainerDiv.children).map(node => {
            const title = node.querySelector('a > div > div.Igw0E.IwRSH.YBx95.vwCYk > div:nth-child(1) > div > div > div > div')
            if(title){
                if(!title.textContent.trim().includes(' ') && !task.userList.find(n => n.title === title.textContent)) {
                    state.update('state.taskManager', () => task.userList.push({
                        img: "",
                        title: title.textContent
                    }));
                    console.log('Добавил пользователя')
                }
                node.scrollIntoView({block: "center", behavior: "smooth"});
            }
        })

        if(options.k > 180){
            state.update('state.service', data => data.collectUserListService.stop = true);
        }
        options.k = options.k+1 || 1
        setTimeout(() => getUserList(options), 100)
    }

    function nextPost(nextPostButtonDiv, options) {
        if(nextPostButtonDiv){
            nextPostButtonDiv.click()
            setTimeout(() => getUserList(options), 300)
        }else{
            state.update('state.service', data => data.collectUserListService.stop = true)
        }
    }
}


function Starter() {
    switch (task.action) {
        case 'getUserList':
                console.log('dsa')
            break;
        default:
            RoutineStarterTasks(true)
            console.log('Невідома задача')
    }
}

function RoutineStarterTasks(next) {
    Starter()
}