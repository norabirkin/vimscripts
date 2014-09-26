Ext.define('OSS.store.accountsgroups.FreeTariffs', {
    extend: 'OSS.ux.data.store.JAPI',
    lazy: true,
    validity: ['tariff'],
    requires: 'OSS.model.accountsgroups.TariffsStaff',
    model: 'OSS.model.accountsgroups.TariffsStaff',
    proxy: {
        type: 'rest',
        url: 'api/tariffsFreeStaff',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
