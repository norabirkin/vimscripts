Ext.define('OSS.store.accounts.MacAddresses', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    requires: 'OSS.model.account.MacAddress',
    model: 'OSS.model.account.MacAddress'
});
