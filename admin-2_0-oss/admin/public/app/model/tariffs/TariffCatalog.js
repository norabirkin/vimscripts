Ext.define('OSS.model.tariffs.TariffCatalog', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'catalog_id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'operator_name',
        type: 'string'
    }, {
        name: 'type',
        type: 'int'
    }]
});
