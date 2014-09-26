Ext.define( "OSS.store.tariffs.TariffCatalog", {
    extend: 'Ext.data.ArrayStore',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' }
    ],
    data: [
        [0, i18n.get('Cat 1')],
        [1, i18n.get('Cat 2')],
        [2, i18n.get('Cat 3')]
    ]
});
