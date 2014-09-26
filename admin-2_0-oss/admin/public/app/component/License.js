/**
 * Содержит логику изменения интерфейса в зависимости от параметров лицензии
 */
Ext.define('OSS.component.License', {
    singleton: true,
    requires: [
        'OSS.component.license.processor.Proxy',
        'OSS.component.license.processor.Store',
        'OSS.component.license.processor.Component',
        'OSS.component.license.processor.Tab'
    ],
    constructor: function() {
        this.processors = {
            proxy: Ext.create('OSS.component.license.processor.Proxy'),
            store: Ext.create('OSS.component.license.processor.Store'),
            component: Ext.create('OSS.component.license.processor.Component'),
            tab: Ext.create('OSS.component.license.processor.Tab')
        };
    },
    getProcessor: function(type) {
        return this.processors[type];
    },
    process: function(id, processor, data) {
        if (id) {
            return this.getProcessor(processor)['process'+Ext.String.capitalize(id)](data);
        }
    }
});
