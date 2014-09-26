Ext.define( "OSS.store.agents.internet.Rnas", {
    extend: "Ext.data.Store",
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    requires: "OSS.model.agent.internet.Rnas",
    model: "OSS.model.agent.internet.Rnas",
    remoteSort: true
});
