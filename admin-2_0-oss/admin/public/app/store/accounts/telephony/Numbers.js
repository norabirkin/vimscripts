Ext.define('OSS.store.accounts.telephony.Numbers', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    model: 'OSS.model.account.telephony.Number',
    requires: 'OSS.model.account.telephony.Number'
});
