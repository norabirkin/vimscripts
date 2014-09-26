Ext.define('OSS.store.Agreements', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.Agreement',
    model: 'OSS.model.Agreement',
    pageSize: 100
});
