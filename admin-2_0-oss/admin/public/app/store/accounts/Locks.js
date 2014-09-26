Ext.define('OSS.store.accounts.Locks', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    requires: 'OSS.model.account.Lock',
    model: 'OSS.model.account.Lock',
    remoteSort: true
});
