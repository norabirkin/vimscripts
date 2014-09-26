/**
 * Хранилище шаблонов документов для очереди отчетов
 */
Ext.define('OSS.store.reports.ReportsDocuments', {
    extend: 'OSS.store.reports.Documents',
    constructor: function(config) {
        this.callParent(arguments);
        this.proxy.extraParams = {
            on_fly: '2,7'
        };
    }
});
