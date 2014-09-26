Ext.define('OSS.model.catalog.zones.AS', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'catalog_id',
            type: 'int'
        },
        {
            name: 'catalog_type',
            type: 'int',
            defaultValue: 2
        },
        {
            name: 'id',
            mapping: 'zone_id',
            type: 'int'
        },
        {
            name: 'zone_as',
            type: 'string'
        },
        {
            name: 'descr',
            type: 'string'
        }
    ]
});
