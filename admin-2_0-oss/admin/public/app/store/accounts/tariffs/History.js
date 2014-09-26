Ext.define('OSS.store.accounts.tariffs.History', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    model: 'OSS.model.account.tariff.History',
    requires: 'OSS.model.account.tariff.History'
});
