Ext.define('OSS.store.agents.phone.Replaces', {
    extend: "Ext.data.Store",
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    requires: 'OSS.model.agent.phone.Replaces',
    model: 'OSS.model.agent.phone.Replaces'
});
