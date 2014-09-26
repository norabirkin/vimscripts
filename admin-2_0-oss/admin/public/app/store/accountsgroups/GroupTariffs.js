Ext.define('OSS.store.accountsgroups.GroupTariffs', {
    extend: 'OSS.ux.data.store.JAPI',
    lazy: true,
    validity: ['tariff'],
    requires: 'OSS.model.accountsgroups.TariffsStaff',
    model: 'OSS.model.accountsgroups.TariffsStaff',
    proxy: {
        type: 'rest',
        url: 'api/tariffsStaff', 
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
