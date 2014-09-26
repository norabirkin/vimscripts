Ext.define('OSS.store.Tariffs', {
    extend: 'Ext.data.Store',
    lazy: true,
    validity: ['tariff'],
    requires: 'OSS.model.account.Tariff',
    model: 'OSS.model.account.Tariff'
});
