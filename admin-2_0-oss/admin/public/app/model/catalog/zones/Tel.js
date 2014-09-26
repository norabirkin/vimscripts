Ext.define('OSS.model.catalog.zones.Tel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'catalog_id',
            type: 'int'
        },
        {
            name: 'catalog_type',
            type: 'int',
            defaultValue: 3
        },
        {
            name: 'id',
            mapping: 'zone_id',
            type: 'int'
        },
        {
            name: 'zone_num',
            type: 'string'
        },
        {
            name: 'class',
            type: 'int'
        },
        {
            name: 'class_name',
            type: 'string'
        },
        {
            name: 'descr',
            type: 'string'
        }
    ]
});
