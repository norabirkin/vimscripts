Ext.define('OSS.store.documenttemplates.AccountsGroups', {
    extend: 'OSS.ux.data.store.JAPI',
    requires: ['OSS.model.documenttemplates.AccountsGroups'],
    model: 'OSS.model.documenttemplates.AccountsGroups',
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
