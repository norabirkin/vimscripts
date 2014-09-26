Ext.define( 'OSS.store.statistics.Agents', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.account.Agent',
    lazy: true,
    model: 'OSS.model.account.Agent',
    validity: 'agents',
    proxy: {
        type: 'rest',
        licid: 'agents',
        url: Ext.Ajax.getRestUrl('api/agents'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
