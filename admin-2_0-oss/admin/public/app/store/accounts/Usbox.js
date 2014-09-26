Ext.define('OSS.store.accounts.Usbox', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    model: 'OSS.model.account.Usbox',
    requires: 'OSS.model.account.Usbox'
});
