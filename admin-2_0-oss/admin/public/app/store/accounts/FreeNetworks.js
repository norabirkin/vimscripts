Ext.define('OSS.store.accounts.FreeNetworks', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    requires: 'OSS.model.account.FreeNetworks',
    model: 'OSS.model.account.FreeNetworks'
});
