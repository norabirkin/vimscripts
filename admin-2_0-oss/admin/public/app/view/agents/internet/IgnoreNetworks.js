Ext.define('OSS.view.agents.internet.IgnoreNetworks', {
    extend: 'OSS.view.agents.ComplexAgentParamGrid',
    requires: [ 'OSS.store.agents.internet.IPAndPrefixSize' ],
    itemId: "ignorenetworks",
    mixins: [ 'OSS.view.agents.Tab' ],
    title: OSS.Localize.get("Ignore networks"),
    store: 'agents.internet.IgnoreNetworks',
    columns: [ 
        { dataIndex: "ip", header: OSS.Localize.get("Segment"), editor: { xtype: "ipfield", allowBlank: false }, flex: 1 },
        { dataIndex: "mask", header: OSS.Localize.get("Mask"), editor: { xtype: "numberfield", minValue: 0, maxValue: 32 } }
    ],
    paramName: "ignore_nets",
    beforeGettingItem: function( data ) {
        var item = {};
        Ext.apply( item, data );
        item.mask = this.getIPMaskByPrefixSize( item.mask );
        return item;
    },
    onValuesRecieved: function( res ) {
        for (i = 0; i < res.length; i ++) { 
            var item = res[i];
            item.mask = this.getPrefixSizeByIPMask( item.mask );
            this.getStore().add( Ext.create('OSS.model.agent.internet.IgnoreNetwork', item) ); 
        }
    },
    onNewNodeCreated: function( node ) {
        node.set( "ip", "127.0.0.1" );
        this.callParent( [node] );
    },
    getIPMaskByPrefixSize: function( prefix_size ) {
        var store = Ext.create("OSS.store.agents.internet.IPAndPrefixSize");
        var record = store.findRecord("prefix_size", prefix_size);
        return record.get("ip");
    },
    getPrefixSizeByIPMask: function( ip ) {
        var store = Ext.create("OSS.store.agents.internet.IPAndPrefixSize");
        var record = store.findRecord("ip", ip);
        if (record) {
            return record.get("prefix_size");
        } else {
            return 32;
        }
    }
});
