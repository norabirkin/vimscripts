Ext.define('OSS.model.matrixdiscounts.MatrixDiscounts', {
    extend: 'Ext.data.Model',
    fields: [
        { 
            name: 'id', 
            type: 'int',
            mapping: 'record_id'
        },
        { name: 'action_id', type: 'int' },
        { name: 'packet_id', type: 'int' },
        { name: 'individual', type: 'int' },
        { name: 'method', type: 'int'},
        { name: 'descr', type: 'string'},
        { name: 'type', type: 'int'}
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/matrixdiscounts'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});