let config = {
    parameter: 'param=true',
    whitelist: '.\ngoogle\\.com'
};

chrome.storage.sync.get(config, items => {
    config = items;
});

chrome.storage.sync.onChanged.addListener(changes => {
    for (const key in changes)
        config[key] = changes[key].newValue;
});

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.url) {
            console.log(details, config);
            if (details.url.indexOf(config.parameter) === -1 && /^https?/.test(details.url)
                && config.whitelist.trim().split('\n').map(wl => new RegExp(wl, 'i').test(details.url)).reduce((acu, cur) => acu || cur, false)) {
                let url = details.url;
                if (url.indexOf('?') > -1) url += '&';
                else url += '?';
                url += config.parameter;
                console.log('redirecting to', url);
                return { redirectUrl: url };
            }
        }
    },
    // filters
    {
        urls: [
            "<all_urls>"
        ],
        types: ["main_frame"]
    },
    // extraInfoSpec
    ["blocking"]
);
