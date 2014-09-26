Ext.define( 'OSS.store.users.UserTypes', {
    extend: 'Ext.data.Store',
    fields: [{ type: 'int', name: 'id' }, { type: 'string', name: 'name' }],
    data: [
        { id: 1, name: i18n.get('Legal person') },
        { id: 2, name: i18n.get('Physical person') }
        
    ]
});
