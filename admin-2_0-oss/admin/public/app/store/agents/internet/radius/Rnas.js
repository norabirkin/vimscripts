Ext.define( "OSS.store.agents.internet.radius.Rnas", {
    extend: "Ext.data.Store",
    mixins: [ "OSS.ux.data.store.LazyBehaviour" ],
    requires: "OSS.model.agent.internet.Rnas",
    model: "OSS.model.agent.internet.Rnas",
    proxy: {
        type: 'rest',
        reader: {
            type: 'json',
                root: 'results'
        }
    },
    
    constructor: function(config) {
        this.callParent(arguments);
        this.getProxy().url = Ext.Ajax.getRestUrl('api/rnas');
    }
});
