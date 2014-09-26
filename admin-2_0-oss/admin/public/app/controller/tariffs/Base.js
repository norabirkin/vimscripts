/**
 * Базовый контроллер для контроллеров раздел [Свойства/Тарифы]
 */
Ext.define('OSS.controller.tariffs.Base', {
    extend: 'Ext.app.Controller',
    requires: [
        'OSS.helpers.OnActivate'
    ],
    stores: [],
    views: [],
    refs: [],
    init: function() {
        this.control({
        });
    },
    readOnly: function(fields, condition) {
        this.form().getFields().each(function(field) {
            field.setReadOnly(
                (
                    Ext.bind(condition, this)() &&
                    Ext.Array.contains(fields, field.getName())
                ) ?
                true :
                false
            );
        }, this);
    },
    form: function() {
        return this.getForm().getForm();
    },
    field: function(name) {
        return this.form().findField(name);
    },
    param: function(name) {
        return this.record.get(name);
    },
    modified: function(name) {
        return this.record.isModified(name);
    },
    onActivateConfig: function() {
        throw 'define "onActivateConfig" method';
    },
    onActivate: function() {
        if (!this.onActivateInstance) {
            this.onActivateInstance = Ext.create('OSS.helpers.OnActivate', Ext.apply(
                this.onActivateConfig(), {
                    controller: this
                }
            ));
        }
        return this.onActivateInstance;
    }
});
