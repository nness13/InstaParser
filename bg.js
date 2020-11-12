chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        if (chrome.runtime.setUninstallURL)
            chrome.runtime.setUninstallURL("https://www.youtube.com/channel/UCnpdCj51alKWSYC33wEhUIQ");

    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status === "complete") console.log('Перезагрузка даної вкладки...', tab)

    if(tab.url.includes('www.instagram.com') && changeInfo.status === "complete") {
        console.log('Перезагрузка інстарграм...', tab.url)
        chrome.storage.sync.get(null, r => {
            console.log('Дані з storage', r)
            if(r.autorun && !r.runFlag) startImplementedApp(r.tabId, 'background')
        })
    }
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
        if(request.cmd == "alert") alert(request.msg);
		if(request.cmd == "tutorial")
		    chrome.windows.create({url: "https://www.youtube.com/channel/UCnpdCj51alKWSYC33wEhUIQ"}, w => {

            });
});