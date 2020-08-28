function storageGet(opts) {
  return new Promise(res => {
    chrome.storage.sync.get(opts, res);
  })
}
function storageSet(opts) {
  return new Promise(res => {
    chrome.storage.sync.set(opts, res);
  })
}
function sleep(time = 1000) {
  return new Promise(res => setTimeout(res, time));
}
function defaultParam() {
  return {
    parameter: 'param=true',
    whitelist: '.\ngoogle\\.com'
  };
}

const app = new Vue({
  el: '#app',
  data() {
    return {
      items: [],
      status: '',
      inputType: 'text',
      inputTypes: ['text', 'list'],
      selected: 0
    }
  },
  computed: {
    selectedParam() {
      return this.items[this.selected];
    },
    warnings() {
      let param = this.selectedParam;
      let warnings = [];
      if (param && param.whitelist) {
        let whitelist = param.whitelist.replace(/\r/g, '').split('\n');
        if (whitelist.includes('')) {
          warnings.push('- Whitelist includes empty lines. This means it\'ll match anything.');
        }
      }
      return warnings;
    }
  },
  mounted() {
    this.restore();
  },
  methods: {
    setParam(i) {
      this.selected = i;
    },
    newParam() {
      this.items.push(defaultParam());
      this.selected = this.items.length - 1;
    },
    deleteParam(i) {
      this.items.splice(i, 1);
      this.selected--;
      if (this.selected < 0) this.selected = 0;
    },
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
    async save() {
      if (this.inputType === 'list') {
        this.whitelist = this.whitelistList.join('\n');
      }
      // const items = [...this.items].map(item => ({
      //   parameter: item.parameter,
      //   whitelist: item.whitelist.join('\n'),
      // }));

      await storageSet({
        items: this.items.map(item => ({
          parameter: item.parameter,
          whitelist: item.whitelist.replace(/\r/g, '')
        }))
      });

      this.status = 'Options saved.';
      await sleep(750);
      this.status = '';
    },
    async restore() {
      // Use default value color = 'red' and likesColor = true.
      const config = await storageGet({
        parameter: 'param=true',
        whitelist: '.\ngoogle\\.com',
        items: [defaultParam()]
      });
      if (config.parameter && config.whitelist) {
        config.items[0].parameter = config.parameter;
        config.items[0].whitelist = config.whitelist;
        await storageSet({
          parameter: null,
          whitelist: null,
          items: config.items
        });
      }
      this.items = config.items;
      // for (const item of this.items) {
      //   item.whitelist = item.whitelist.split('\n');
      // }
    },
    removeLine(i) {
      this.whitelistList.splice(i, 1);
    },
    addLine() {
      this.whitelistList.push('');
    }
  }
})