/**
 * Хранилище кодов услуги
 */
Ext.define('OSS.store.tariffs.ServiceCodes', {
    extend: 'Ext.data.Store',
    lazy: true,
    requires: 'OSS.model.tariffs.ServiceCode',
    model: 'OSS.model.tariffs.ServiceCode',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/salesDictionary'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
