Ext.define('OSS.store.agents.internet.IgnoreNetworks', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.agent.internet.IgnoreNetwork',
    model: 'OSS.model.agent.internet.IgnoreNetwork',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/ignorenetworks'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
