/**
 * Удаление списка
 */
Ext.define('OSS.helpers.DeleteList', {
    constructor: function(config) {
        this.initConfig(config);
    },
    config: {
        panel: null,
        empty: function() {
        },
        confirmation: null,
        message: null,
        callback: function() {
        },
        scope: window
    },
    run: function() {
        if (this.selected().length) {
            if (this.confirmation) {
                this.confirm(this.request, this);
            } else {
                this.request();
            }
        } else {
            Ext.bind(this.empty, this.scope)();
        }
    },
    confirm: function(callback, scope) {
        var title = i18n.get('Confirm items remove'),
            message = i18n.get('Do you realy want to remove items?');

        if (this.confirmation === true) {
            this.confirmation = {
                title: title, 
                message: message
            };
        } else {
            this.confirmation.title = this.confirmation.title || title;
            this.confirmation.message = this.confirmation.message || message;
        }

        Ext.Msg.confirm(
            this.confirmation.title,
            this.confirmation.message,
            function(btn) {
                if (btn == 'yes') {
                    Ext.bind(callback, scope)();
                }
            }
        );
    },
    request: function() {
        var me = this;

        Ext.Ajax.request({
            url: this.url()+'/deletelist',
            params: this.params(),
            callback: function() {
                this.store().load({
                    scope: this.panel,
                    force: true,
                    callback: function() {
                        Ext.bind(me.callback, me.scope)();
                        this.fireEvent('itemsremoved', this);
                    }
                });
            },
            msg: this.message,
            scope: this
        });
    },
    list: function() {
        var list = [];
        this.selected().each(function(record) {
            list.push(record.getId());
        });
        return list.join('.');
    },
    params: function() {
        return Ext.apply((this.proxy().extraParams || {}), {
            list: this.list()
        });
    },
    store: function() {
        return this.panel.getStore();
    },
    selected: function() {
        return this.panel.getSelectionModel().selected;
    },
    proxy: function() {
        return this.store().proxy;
    },
    url: function() {
        return this.proxy().url.replace(/[\/\\]+$/, '');
    }
});
