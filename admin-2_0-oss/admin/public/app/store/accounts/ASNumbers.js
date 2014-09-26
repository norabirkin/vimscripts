Ext.define('OSS.store.accounts.ASNumbers', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    requires: 'OSS.model.account.ASNumbers',
    model: 'OSS.model.account.ASNumbers'
});
