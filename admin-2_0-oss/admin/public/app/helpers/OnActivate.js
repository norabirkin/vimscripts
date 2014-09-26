/**
 * Выполняет некие действия при активации вкладки
 */
Ext.define('OSS.helpers.OnActivate', {
    constructor: function(config) {
        this.initConfig(config);
        this.controller.on('programactivated', this.load, this);
        this.panel.on('tabchange', this.load, this);
    },
    config: {
        controller: null,
        panel: null,
        items: null
    },
    load: function() {
        var tab = this.panel.getActiveTab(),
            id = tab.getItemId(),
            func = this.items[id];
        if (!tab.tab.isVisible()) {
            this.panel.setActiveTab(0);
        } else {
            if (func) {
                func(id);
            }
        }
    }
});
