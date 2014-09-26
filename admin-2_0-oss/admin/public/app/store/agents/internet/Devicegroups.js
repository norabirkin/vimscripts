Ext.define( "OSS.store.agents.internet.Devicegroups", {
    extend: "Ext.data.Store",
    requires: 'OSS.model.agent.internet.Devicegroup',
    model: 'OSS.model.agent.internet.Devicegroup',
    proxy: {
        type: 'rest',
            reader: {
                type: 'json',
                    root: 'results'
        }
    },
    
    
    listeners: {
        load: function( store ){ 
            store.insert(0, Ext.create( 'OSS.model.agent.internet.Devicegroup', {
                group_id: 0,
                name: OSS.Localize.get('No')
            }));
        }
    },
    
    
    constructor: function(config) {
        this.callParent(arguments);
        this.getProxy().url = Ext.Ajax.getRestUrl('api/devicegroups');
    }
});
