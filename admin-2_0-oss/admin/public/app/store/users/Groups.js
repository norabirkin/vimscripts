Ext.define( 'OSS.store.users.Groups', {
    extend: 'Ext.data.Store',
    requires:'OSS.model.users.Group',
    model:'OSS.model.users.Group',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/usergroups'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
