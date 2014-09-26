Ext.define('OSS.model.catalog.zones.IP', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'catalog_id',
            type: 'int'
        },
        {
            name: 'catalog_type',
            type: 'int',
            defaultValue: 1
        },
        {
            name: 'id',
            mapping: 'zone_id',
            type: 'int'
        },
        {
            name: 'zone_ip',
            type: 'string'
        },
        {
            name: 'zone_mask',
            type: 'string'
        },
        {
            name: 'prefix_size',
            type: 'int',
            defaultValue: 32
        },
        {
            name: 'port',
            type: 'int'
        },
        {
            name: 'proto',
            type: 'int'
        },
        {
            name: 'descr',
            type: 'string'
        }
    ]
});
