Ext.define( "OSS.store.tariffs.ActBlocks", {
    extend: 'Ext.data.ArrayStore',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' }
    ],
    data: [
        [0, i18n.get('None (prepaid)')],
        [1, i18n.get('Automatically lock')],
        [2, i18n.get('Active lock')]
    ]
});
