const app = new Vue({
  el: '#app',
  data() {
    return {
      whitelist: '',
      whitelistList: [],
      param: '',
      status: '',
      inputType: 'text',
      inputTypes: ['text', 'list']
    }
  },
  computed: {
  },
  mounted() {
    this.restore();
  },
  methods: {
    setInputType(type) {
      if (type !== this.inputType) {
        this.inputType = type;
        this.syncInput();
      }
    },
    syncInput() {
      switch (this.inputType) {
        case 'list': {
          this.whitelistList = this.whitelist.split('\n');
          break;
        }
        case 'text': {
          this.whitelist = this.whitelistList.join('\n');
          break;
        }
      }
    },
    save() {
      if (this.inputType === 'list') {
        this.whitelist = this.whitelistList.join('\n');
      }
      chrome.storage.sync.set({
        parameter: this.param,
        whitelist: this.whitelist
      }, () => {
        // Update status to let user know options were saved.
        this.status = 'Options saved.';
        setTimeout(() => {
          this.status = '';
        }, 750);
      });
    },
    restore() {
      // Use default value color = 'red' and likesColor = true.
      chrome.storage.sync.get({
        parameter: 'param=true',
        whitelist: '.\ngoogle\\.com'
      }, (items) => {
        this.param = items.parameter;
        this.whitelist = items.whitelist;
        this.whitelistList = items.whitelist.split('\n');
      });
    },
    removeLine(i) {
      this.whitelistList.splice(i, 1);
    },
    addLine() {
      this.whitelistList.push('');
    }
  }
})