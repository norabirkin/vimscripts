Ext.define('OSS.model.catalog.Tree', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'clickable',
            type: 'boolean'
        },
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'operator_id',
            type: 'int'
        },
        {
            name: 'text',
            type: 'string'
        },
        {
            name: 'type',
            type: 'int'
        },
        {
            name: 'used',
            type: 'boolean'
        }
    ]
});
