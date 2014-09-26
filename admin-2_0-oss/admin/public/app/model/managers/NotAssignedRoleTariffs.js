Ext.define('OSS.model.managers.NotAssignedRoleTariffs', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'role_id', type: 'int' }, 
        { name: 'tar_descr', type: 'string' }, 
        { name: 'tar_id', type: 'int' }, 
        { name: 'f_read', type: 'boolean' }, 
        { name: 'f_write', type: 'boolean' }
    ],
    idProperty: 'role_id',
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/roles/TariffsList'),
        reader: {
            type: 'json',
            root: 'results'
        },
        writer: {
            type: 'json',
            allowSingle: true
        }
    }
});      
