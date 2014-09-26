Ext.define('OSS.store.radiusattributes.AccountsGroups', {
    extend: 'OSS.ux.data.store.JAPI',
    requires: ['OSS.model.radiusattributes.AccountsGroups'],
    model: 'OSS.model.radiusattributes.AccountsGroups',
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
