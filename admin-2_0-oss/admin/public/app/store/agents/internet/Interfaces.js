Ext.define('OSS.store.agents.internet.Interfaces', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.agent.internet.Interface',
    model: 'OSS.model.agent.internet.Interface',
    proxy: {
        type: 'rest',
        reader: {
            type: 'json',
            root: 'results'
        }
    },
    
    constructor: function(config) {
        this.callParent(arguments);
        this.getProxy().url = Ext.Ajax.getRestUrl('api/interfaces');
    }
});
