Ext.define( "OSS.store.tariffs.TrafficTypes", {
    extend: 'Ext.data.ArrayStore',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' }
    ],
    data: [
        [1, i18n.get('Incomming')],
        [2, i18n.get('Outcomming')],
        [3, i18n.get('Sum')],
        [4, i18n.get('Prevailing')]
    ]
});
