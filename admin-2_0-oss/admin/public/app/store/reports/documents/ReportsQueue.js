/**
 * Хранилище для очереди очетов
 */
Ext.define('OSS.store.reports.documents.ReportsQueue', {
    extend: 'OSS.store.reports.documents.Queue',    
    constructor: function(config) {
        this.callParent(arguments);
        this.proxy.extraParams = {
            on_fly: '2,7'
        };
    }
});
