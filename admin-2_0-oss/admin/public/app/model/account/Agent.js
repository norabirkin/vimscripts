/**
 * Агент
 */
Ext.define('OSS.model.account.Agent', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        { name: 'id', type: 'id' },
        { name: 'name', mapping: 'descr', type: 'string' },
        { name: 'type', type: 'int' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/agents'),
        reader: {
            type: 'json',
            root: 'results.agent'
        }
    }
});

