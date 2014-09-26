Ext.define('OSS.store.users.Combogrid', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.User',
    model: 'OSS.model.User',
    pageSize: 100
});
