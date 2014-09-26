Ext.define('OSS.model.recalculation.Agents', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'agent_id', type: 'int' },
        { name: 'agent_name', type: 'string'},
        { name: 'agent_type', type: 'int'}
    ],
    idProperty: 'agent_id',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/recalculation'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
