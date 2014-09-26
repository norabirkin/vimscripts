Ext.define('OSS.store.agents.internet.radius.EmulateAgents', {
    extend: "Ext.data.Store",
    mixins: [ "OSS.ux.data.store.LazyBehaviour" ],
    fields: [ { type: "int", name: "id" },{ type: "string", name: "name" } ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/agents/emul'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
    
});
