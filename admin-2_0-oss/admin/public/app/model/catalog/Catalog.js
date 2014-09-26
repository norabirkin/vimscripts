Ext.define('OSS.model.catalog.Catalog', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'operator_id',
            type: 'int'
        },
        {
            name: 'operator_name',
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
    ],
    proxy: {                        
        type: 'rest',   
        url: 'index.php/api/catalogs',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
