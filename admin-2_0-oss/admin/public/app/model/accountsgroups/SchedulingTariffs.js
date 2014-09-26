Ext.define('OSS.model.accountsgroups.SchedulingTariffs', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'tar_id', type: 'int' },
        { name: 'tar_name', type: 'string' },
        { name: 'vgroups', type: 'int' },
        { name: 'type', type: 'int' },
        { name: 'curid', type: 'int' },
        { name: 'symbol', type: 'string' },
        { name: 'agents', type: 'string' }
    ],
    idProperty: 'tar_id'
});
