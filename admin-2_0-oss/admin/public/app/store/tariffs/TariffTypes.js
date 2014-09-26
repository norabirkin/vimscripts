Ext.define('OSS.store.tariffs.TariffTypes', {
    extend: 'Ext.data.ArrayStore',
    licid: 'tariffTypes',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' }
    ],
    data: [
        [0, i18n.get('Leased line')],
        [1, 'Dialup (' + i18n.get('by size') + ')'],
        [2, 'Dialup (' + i18n.get('by time') + ')'],
        [3, i18n.get('Telephony')],
        [4, 'IP ' + i18n.get('Telephony')],
        [5, i18n.get('Services')]
    ]
});
