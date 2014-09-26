Ext.define('OSS.model.searchtemplate.Grid', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'parameter', type: 'string', defaultValue: "accounts.type"  },
        { name: 'value', type: 'string' },
        { name: 'condition', type: 'string', defaultValue: '=' },
        { name: 'logic', type: 'string', defaultValue: 'OR' }
    ]
});
