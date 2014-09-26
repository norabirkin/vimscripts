Ext.define('OSS.store.users.UserDocuments', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.users.UserDocuments',
    model: 'OSS.model.users.UserDocuments',
    remoteSort: true
});
