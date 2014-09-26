Ext.define('OSS.store.accountsgroups.GroupAccounts', {
    extend: 'OSS.ux.data.store.JAPI',
    requires: 'OSS.model.accountsgroups.Accounts',
    model: 'OSS.model.accountsgroups.Accounts',
    
    proxy: {
        type: 'rest',
        url: 'api/vgroup', 
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
