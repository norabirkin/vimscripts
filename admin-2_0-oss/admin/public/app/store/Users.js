Ext.define('OSS.store.Users', {
    extend: 'Ext.data.Store',
    lazy: true,
    requires: 'OSS.model.User',
    model: 'OSS.model.User',
    remoteSort: true
});
