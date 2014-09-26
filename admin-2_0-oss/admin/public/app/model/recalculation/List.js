Ext.define('OSS.model.recalculation.List', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'agent_id', type: 'int' },
        { name: 'recalc_current', type: 'string' },
        { name: 'recalc_date', type: 'string' },
        { name: 'recalc_group', type: 'int'},
        { name: 'recalc_percent', type: 'float'},
        { name: 'recalc_rent', type: 'int'},
        { name: 'recalc_stat', type: 'int'},
        { name: 'agent_name', type: 'string'},
        { name: 'group_name', type: 'string'}
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