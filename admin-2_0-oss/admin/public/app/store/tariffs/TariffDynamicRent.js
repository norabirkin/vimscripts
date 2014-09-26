Ext.define( "OSS.store.tariffs.TariffDynamicRent", {
    extend: 'Ext.data.ArrayStore',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' }
    ],
    data: [
        [0, i18n.get('Fixed')],
        [1, i18n.get('Dynamically')],
        [2, i18n.get('Combined')]
    ]
});
