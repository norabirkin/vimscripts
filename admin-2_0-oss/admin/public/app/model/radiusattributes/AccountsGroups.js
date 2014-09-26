Ext.define('OSS.model.radiusattributes.AccountsGroups', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'group_id', type: 'int'},
        { name: 'name', type: 'string' },
        { name: 'descr', type: 'string' },
        { name: 'vg_count', type : 'int'},
        { name: 'agent_ids', type : 'string'}
    ],
    idProperty: 'group_id'
});