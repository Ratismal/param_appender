let phistory = [];

function renderHistory() {
  const historyWrapper = document.getElementById('history-wrapper');
  const historyEntries = document.getElementById('history-entries');
  if (phistory.length > 0) {
    historyWrapper.classList.add('enabled');
    historyEntries.innerHTML = '';

    let inProgress = document.getElementById('param').value;
    for (const entry of phistory) {
      let wrapper = document.createElement('div');
      wrapper.className = 'history-entry';
      let button = document.createElement('button');
      button.className = 'button mini options';
      button.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('param').value = entry;
        append_param();
      });
      button.innerText = entry;

      let remove = document.createElement('button');
      remove.className = 'button mini danger';
      remove.addEventListener('click', (e) => {
        e.preventDefault();
        phistory.splice(phistory.indexOf(entry), 1);
        renderHistory();
        saveSettings();
      });
      remove.innerText = 'X';

      wrapper.appendChild(button);
      wrapper.appendChild(remove);
      historyEntries.appendChild(wrapper);

    }
  }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    inProgress: 'param=true',
    history: []
  }, function (items) {
    document.getElementById('param').value = items.inProgress;
    phistory = items.history;
    // document.getElementById('whitelist').value = items.whitelist;
    renderHistory();
  });
}

function append(param) {
  let url = window.location.href;
  if (url.indexOf('?') > -1) url += '&';
  else url += '?';
  url += param;
  window.location.href = url;
}

function updateStatus(text) {
  let status = document.getElementById('status');
  status.textContent = text;
  setTimeout(function () {
    status.textContent = '';
  }, 750);
}

function saveSettings(cb) {
  let inProgress = document.getElementById('param').value;
  if (phistory.includes(inProgress)) {
    phistory.splice(phistory.indexOf(inProgress), 1);
  };
  phistory.unshift(inProgress);
  while (phistory.length > 10) phistory.pop();
  chrome.storage.sync.set({
    inProgress,
    history: phistory
  }, cb);
}

function append_param() {
  let inProgress = document.getElementById('param').value;
  if (phistory.includes(inProgress)) {
    phistory.splice(phistory.indexOf(inProgress), 1);
  };
  phistory.unshift(inProgress);
  while (phistory.length > 10) phistory.pop();
  saveSettings(function () {
    chrome.tabs.executeScript({
      code: `${append.toString()}\nappend(${JSON.stringify(inProgress)});`
    });

    restore_options();
    // Update status to let user know options were saved.
    updateStatus('Appended!');
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('append').addEventListener('click',
  append_param);
document.getElementById('options').addEventListener('click', function () {
  chrome.tabs.create({ url: 'views/options.html' });
})