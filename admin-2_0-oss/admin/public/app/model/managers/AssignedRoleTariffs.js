Ext.define('OSS.model.managers.AssignedRoleTariffs', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'role_id', type: 'int' }, 
        { name: 'tar_descr', type: 'string' }, 
        { name: 'tar_id', type: 'int' },
        { name: 'rights', type: 'int' },
        { name: 'f_read', type: 'boolean' }, 
        { name: 'f_write', type: 'boolean' }
    ],
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