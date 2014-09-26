/**
 * Хранилище договоров для вкладки перевода средств
 */
Ext.define('OSS.store.payments.agreements.Transfer', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    requires: 'OSS.model.payments.agreements.Transfer',
    model: 'OSS.model.payments.agreements.Transfer'
});
