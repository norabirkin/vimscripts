Ext.define('OSS.store.accounts.telephony.Trunks', {
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    extend: 'Ext.data.Store',
    model: 'OSS.model.account.telephony.Trunk',
    requires: 'OSS.model.account.telephony.Trunk'
});
