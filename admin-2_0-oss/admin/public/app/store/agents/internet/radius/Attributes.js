Ext.define('OSS.store.agents.internet.radius.Attributes', {
    extend: "Ext.data.Store",
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    requires: 'OSS.model.agent.internet.radius.Attribute',
    model: 'OSS.model.agent.internet.radius.Attribute',
    listeners: {
        load: function() { this.sort( "radius_type", "ASC" ); }
    }
});
