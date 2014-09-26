Ext.define('OSS.model.agent.phone.BillingMediation', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'parameter', type: 'string', defaultValue: "direction"  },
        { name: 'value', type: 'string' },
        { name: 'condition', type: 'string', defaultValue: '=' },
        { name: 'logic', type: 'string', defaultValue: 'none' }
    ]
});
