Ext.define( 'OSS.store.payments.Classes', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'class_id', type: 'int' },
        { name: 'name', type: 'string' },
        { name: 'descr', type: 'string'},
        { name: 'default', type: 'boolean'},
        { name: 'default_transfer', type: 'boolean'}
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/payclasses'),
        extraParams: { selectdefault: true },
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
