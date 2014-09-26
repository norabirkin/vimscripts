/**
 * Хранилище доступных для назначнеия исходящих направлений
 */
Ext.define('OSS.store.tariffs.directions.available.Outgoing', {
    extend: 'Ext.data.Store',
    lazy: true,
    validity: 'telzone',
    model: 'OSS.model.catalog.zones.Tel',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl( 'api/catalogzones' ),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
