Ext.define( "OSS.store.tariffs.TariffDailyRent", {
    extend: 'Ext.data.ArrayStore',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' }
    ],
    data: [
        [1, i18n.get('Every day')],
        [0, i18n.get('Every month')]
    ]
});
