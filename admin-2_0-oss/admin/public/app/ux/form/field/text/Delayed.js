Ext.define('OSS.ux.form.field.text.Delayed', {
    requires: ['OSS.helpers.Timeout'],
    enableKeyEvents: true,
    queryDelay: 500,
    getQueryParam: function() {
        return this.getValue();
    },
    getParamName: function() {
        return 'query';
    },
    getQueryObject: function() {
        var obj = {};
        obj[this.getParamName()] = this.getQueryParam();
        return obj;
    },
    query: function() {
        if (this.store.lazy) {
            this.store.addExtraParams(this.getQueryObject());
        } else {
            Ext.apply(this.store.proxy.extraParams, this.getQueryObject());
        }
        this.beforeQuery();
        this.getStore().load();
    },
    beforeQuery: function() {
    },
    getStore: function() {
        return this.store;
    },
    setQueryDelay: function(delay) {
        this.queryTimer.delay = delay;
        this.queryDelay = delay;
    },
    init: function() {
        this.queryTimer = Ext.create('OSS.helpers.Timeout', {
            delay: this.queryDelay,
            scope: this,
            onDelayTimeExeeded: this.query 
        });
        this.on('keydown', function() { 
            this.queryTimer.run();
        }, this); 
    }
});
