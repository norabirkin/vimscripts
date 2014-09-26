Ext.define('OSS.model.catalog.zones.Class', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            mapping: 'class_id',
            type: 'int'
        },
        {
            name: "color",
            type: 'int'
        },
        {
            name: "extern_code",
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'descr',
            type: 'string'
        }
    ]
});
