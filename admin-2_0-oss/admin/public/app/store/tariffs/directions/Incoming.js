/**
 * Хранилище входящих направлений
 */
Ext.define('OSS.store.tariffs.directions.Incoming', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.tariffs.directions.Tel',
    model: 'OSS.model.tariffs.directions.Tel',
    validity: 'telzone',
    lazy: true,
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/tarCategoryCatalogZones'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
