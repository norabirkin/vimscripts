/**
 * Модель направлений телефонии
 */
Ext.define('OSS.model.tariffs.directions.Tel', {
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
        name: 'class',
        type: 'int'
    }, {
        name: 'class_name',
        type: 'string'
    }, {
        name: 'descr',
        type: 'string'
    }, {
        name: 'direction',
        type: 'int'
    }, {
        name: 'tar_id',
        type: 'int'
    }, {
        name: 'zone_id',
        type: 'int'
    }, {
        name: 'zone_num',
        type: 'string'
    }]
});
