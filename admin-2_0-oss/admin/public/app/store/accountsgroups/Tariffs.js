Ext.define('OSS.store.accountsgroups.Tariffs', {
    extend: 'OSS.ux.data.store.JAPI',
    requires: 'OSS.model.accountsgroups.Tariffs',
    model: 'OSS.model.accountsgroups.Tariffs',
    proxy: {
        type: 'rest',
        url: 'api/tariffs', 
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
