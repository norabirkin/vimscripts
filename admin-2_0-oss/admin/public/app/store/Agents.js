Ext.define('OSS.store.Agents', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.Agent',
    model: 'OSS.model.Agent',
    proxy: {
        type: 'rest',
        licid: 'agents',
        url: 'index.php/api/agents',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
