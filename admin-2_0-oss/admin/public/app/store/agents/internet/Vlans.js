Ext.define( 'OSS.store.agents.internet.Vlans', {
    extend: "Ext.data.Store",
    fields: [{ type: "int", name: "record_id" }, { type: "string", name: "name" }],
    proxy: {
        type: 'rest',
        reader: {
            type: 'json',
                root: 'results'
        }
    },
    
    
    constructor: function(config) {
        this.callParent(arguments);
        this.getProxy().url = Ext.Ajax.getRestUrl('api/vlans');
    }
});
