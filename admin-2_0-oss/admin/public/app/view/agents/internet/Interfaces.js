Ext.define('OSS.view.agents.internet.Interfaces', {
    extend: 'OSS.view.agents.ComplexAgentParamGrid',
    itemId: "interfaces",
    mixins: [ "OSS.view.agents.Tab" ],
    title: OSS.Localize.get("Interfaces"),
    store: 'agents.internet.Interfaces',
    columns: [ 
        { dataIndex: "device_id", header: "ID" },
        { dataIndex: "device_name", flex: 1, header: OSS.Localize.get("Interface name"), editor: {xtype: "textfield", maskRe: /[a-z-A-Z0-9\.\-\/]/} }
    ],
    paramName: "interfaces",
    onValuesRecieved: function( res ) {
        for (i = 0; i < res.length; i ++) {
            this.getStore().add( Ext.create('OSS.model.agent.internet.Interface', res[i]) );
        }
    },
    onNewNodeCreated: function( node ) {
        node.set( "device_name", "eth0" );
        this.callParent( [node] );
    }
});
