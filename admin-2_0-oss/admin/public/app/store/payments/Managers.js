Ext.define('OSS.store.payments.Managers', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'person_id', type: 'int' }, 
        { name: 'fio', type: 'string' }, 
        { name: 'login', type: 'string' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/managergroups/payment'),
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});
