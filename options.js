// Saves options to chrome.storage
function save_options() {
    var parameter = document.getElementById('param').value;
    var whitelist = document.getElementById('whitelist').value;
    chrome.storage.sync.set({
      parameter,
      whitelist
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
      parameter: 'param=true',
      whitelist: '.\ngoogle\\\\.com'
    }, function(items) {
      document.getElementById('param').value = items.parameter;
      document.getElementById('whitelist').value = items.whitelist;
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);