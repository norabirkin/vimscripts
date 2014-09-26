Ext.define( 'OSS.store.agents.internet.NetworkManagement', {
    extend: "Ext.data.Store",
    mixins: ["OSS.ux.data.store.LazyBehaviour"],
    requires: "OSS.model.agent.internet.Segment",
    model: "OSS.model.agent.internet.Segment",
    listeners: {
        load: function() { this.sort( "ip", "ASC" ); }
    }
});
