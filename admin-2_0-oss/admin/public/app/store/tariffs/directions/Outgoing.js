/**
 * Модель исходящих направлений
 */
Ext.define('OSS.store.tariffs.directions.Outgoing', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.tariffs.directions.Tel',
    validity: 'telzone',
    model: 'OSS.model.tariffs.directions.Tel',
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
