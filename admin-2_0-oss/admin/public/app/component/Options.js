Ext.define('OSS.component.Options', {
    singleton: true,
    data: {},
    load: function(params) {
        var option = params.option,
            callback = params.callback,
            scope = params.scope;
        if (!option) {
            throw 'no option';
        }
        if (!callback) {
            callback = function() {};
        }
        if (!scope) {
            scope = {};
        }
        if (this.data[option] !== undefined) {
            Ext.bind(callback, scope)(this.get(option));
            return;
        }
        ajax.request({
            url: 'settings/get',
            noAlert: true,
            params: {
                name: option
            },
            method: 'GET',
            success: function(results) {
                this.data[option] = results;
                Ext.bind(callback, scope)(this.get(option));
            },
            scope: this
        });
    },
    get: function(option) {
        if (this.data[option] === undefined) {
            throw 'no data';
        }
        return this.data[option];
    }
});
