Ext.define('OSS.store.accountsgroups.AccountsGroups', {
    extend: 'OSS.ux.data.store.JAPI',
    requires: ['OSS.model.accountsgroups.AccountsGroups'],
    model: 'OSS.model.accountsgroups.AccountsGroups',
    sorters: { property: 'group_id', direction : 'ASC' },
    proxy: {
        type: 'rest',
        url: 'api/accountsgroups',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
