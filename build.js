function StartUserInterface() {
    chrome.windows.getCurrent({}, function (w) {
        console.log('Отримую поточне вікно...', w)
        chrome.tabs.query({active: true}, function (tabs) {
            console.log('Отримую активні вкладки...', tabs)
            tabs.map(t => {
                console.log('Вибираю поточну вкладку...', t)
                if (t.windowId === w.id) {
                    window.thistab = t;
                    console.log('Перевіряю наявність відкритого інстаграма...')
                    if (!thistab.url.includes("www.instagram.com"))
                        chrome.extension.sendMessage({cmd: "alert", msg: 'Неверний url перейдите в Инстаграм.'});

                    else {
                        chrome.storage.sync.set({autorun: true, tabId: thistab.id})
                        startImplementedApp(thistab.id, 'app')
                    }
                }
            })
        });
    })
}



function startImplementedApp(idTab = null, version){
    chrome.tabs.insertCSS(idTab, {file:  'src/style.css'});

    chrome.tabs.executeScript(idTab, {file:  'node_modules/ReactiveJinn/module/SVGinjector.js'});
    chrome.tabs.executeScript(idTab, {file:  'node_modules/ReactiveJinn/JinnFramework.js'});

    chrome.tabs.executeScript(idTab, {file:  'src/Components.js'});
    chrome.tabs.executeScript(idTab, {file:  'src/services.js'});
    chrome.tabs.executeScript(idTab, {file:  'src/indexWidget.js'});
    if(version === 'app') window.close()
}