Ext.define('OSS.store.accounts.Networks', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    requires: 'OSS.model.account.Network',
    model: 'OSS.model.account.Network'
});
