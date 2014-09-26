/**
 * Класс содержащий базовые настройки
 */
Ext.define('OSS.component.Profile', {
    singleton: true,
    mixins: {
        observable: 'Ext.util.Observable'
    },
    constructor: function (config) {
        this.mixins.observable.constructor.call(this, config);
    },
    params: {},
    onChanged: function(param, handler, __scope) {
        var scope = __scope || window;
        if (!param || !handler) {
            return;
        }
        this.on('changed_'+param, handler, scope);
    },
    unChanged: function(param, handler, __scope) {
        var scope = __scope || window;
        if (!param || !handler) {
            return;
        }
        this.un('changed_'+param, handler, scope);
    },
    updateCurrency: function(store) {
        store.each(function(item) {
            if (item.get('is_def')) {
                this.set('default_currency', item.get('id'));
                return false;
            }
        }, this);
    },
    updateOptions: function(store) {
        store.each(function(item) {
            var name = item.get('name'),
                value = item.get('value');
            if (
                name == 'zkh_configuration' ||
                name == 'default_operator' ||
                name == 'change_usertype' ||
                name == 'default_transfer_classid' ||
                name == 'user_pass_symb' ||
                name == 'acc_pass_symb'
            ) {
                this.set(name, value);
            }
        }, this);
    },
    updatePaymentOptions: function(form) {
        var payment_format = form.getForm().findField('payment_format').getValue();
        Ext.Ajax.request({
            url: 'index.php/api/payments/format',
            params: {
                payment_format: payment_format
            },
            success: function(response) {
                this.set('payment_format_regexp', response.JSONResults);
                this.set('payment_format', payment_format);
            },
            scope: this
        });
    },
    updateManager: function(person_id) {
        if (person_id == Ext.app.Application.instance.getController('Viewport').getManager().person_id) {
            OSS.model.managers.Managers.load(person_id, {
                success: function(record) {
                    this.set('pay_class_id', record.get('pay_class_id'));
                    this.set('open_pass', record.get('open_pass'));
                },
                scope: this
            });
        }
    },
    load: function(params) {
        var param;
        this.params = params;
        for (param in params) {
            this.addEvents('changed_'+param);
        }
    },
    set: function(name, value) {
        if (value != this.params[name]) {
            this.params[name] = value;
            this.fireEvent('changed_'+name, value);
        }
    },
    get: function(name) {
        return this.params[name];
    }
});
