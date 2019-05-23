chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (changeInfo.url) {
        chrome.storage.sync.get({
            parameter: 'param=true',
            whitelist: '.\ngoogle\\.com'
        }, items => {
            if(changeInfo.url.indexOf(items.parameter) === -1 && /^https?/.test(changeInfo.url) 
                && items.whitelist.trim().split('\n').map(wl => new RegExp(wl, 'i').test(changeInfo.url)).reduce((acu, cur) => acu || cur, false)) {
                let url = changeInfo.url;
                if (url.indexOf('?') > -1) url += '&';
                else url += '?';
                url += items.parameter;
                chrome.tabs.executeScript(tab.id, {
                    code: `window.history.pushState('param appender', 'param appended', '${url}')`
                });
            }
        });
    }
});