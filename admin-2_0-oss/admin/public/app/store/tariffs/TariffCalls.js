Ext.define( "OSS.store.tariffs.TariffCalls", {
    extend: 'Ext.data.ArrayStore',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' }
    ],
    data: [
        [0, i18n.get('Do not rate')],
        [1, i18n.get('Calling station number')],
        [2, i18n.get('Dialed number')]
    ]
});
