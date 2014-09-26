/**
 * Модель направления категории тарифа интернет
 */
Ext.define('OSS.model.tariffs.directions.IP', {
    extend: 'Ext.data.Model',
    idProperty: 'zone_id',
    fields: [{
        name: 'cat_idx',
        type: 'int'
    }, {
        name: 'cat_idx_descr',
        type: 'string'
    }, {
        name: 'catalog_id',
        type: 'int'
    }, {
        name: 'descr',
        type: 'string'
    }, {
        name: 'port',
        type: 'int'
    }, {
        name: 'proto',
        type: 'int'
    }, {
        name: 'tar_id',
        type: 'int'
    }, {
        name: 'zone_id',
        type: 'int'
    }, {
        name: 'zone_ip',
        type: 'string'
    }, {
        name: 'zone_mask',
        type: 'string'
    }, {
        name: 'prefix_size',
        type: 'int'
    }],
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
