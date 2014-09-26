Ext.define('OSS.store.recalculation.AccountsGroups', {
    extend: 'OSS.ux.data.store.JAPI',
    requires: ['OSS.model.recalculation.AccountsGroups'],
    model: 'OSS.model.recalculation.AccountsGroups',
    proxy: {
        type: 'rest',
        url: 'api/accountsgroups',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
