Ext.define('OSS.store.accountsgroups.Agents', {
    extend: 'OSS.ux.data.store.JAPI',
    requires: 'OSS.model.accountsgroups.Agents',
    model: 'OSS.model.accountsgroups.Agents',
    proxy: {
        type: 'rest',
        url: 'api/agents', 
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
