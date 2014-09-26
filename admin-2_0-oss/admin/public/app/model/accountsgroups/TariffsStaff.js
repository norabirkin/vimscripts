Ext.define('OSS.model.accountsgroups.TariffsStaff', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'tar_id', type: 'int'},
        { name: 'tar_name', type: 'string' }
    ],
    idProperty: 'tar_id'
});