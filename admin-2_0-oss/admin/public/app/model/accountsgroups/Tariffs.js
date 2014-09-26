Ext.define('OSS.model.accountsgroups.Tariffs', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'tar_id', type: 'int'},
        { name: 'descr', type: 'string' }
    ],
    idProperty: 'tar_id'
});