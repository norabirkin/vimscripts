/**
 * Хранилище доступных для назначения направлений интернет
 */
Ext.define('OSS.store.tariffs.directions.available.IP', {
    extend: 'Ext.data.Store',
    validity: 'ipzone',
    lazy: true,
    model: 'OSS.model.catalog.zones.IP',
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
