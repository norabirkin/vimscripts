Ext.define('OSS.store.agents.phone.BillingMediation', {
    extend: 'Ext.data.Store',
    requires: 'OSS.model.agent.phone.BillingMediation',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    model: 'OSS.model.agent.phone.BillingMediation',
    proxy: {
        type: 'rest',
        reader: {
            type: 'json',
            root: 'results'
        }
    },
    
    
    constructor: function(config) {
        this.callParent(arguments);
        this.getProxy().url = Ext.Ajax.getRestUrl('api/billingmediation');
    }
});
