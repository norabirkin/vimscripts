Ext.define('OSS.store.printforms.DocumentsList', {
    extend: 'Ext.data.Store',
    mixins: ['OSS.ux.data.store.LazyBehaviour'],
    fields: [{
        name: 'create_date',
        type: 'date',
        dateFormat: 'Y-m-d H:i:s'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'person_id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'end_date',
        type: 'date',
        dateFormat: 'Y-m-d H:i:s'
    }, {
        name: 'last_order_id',
        type: 'int'
    }, {
        name: 'message',
        type: 'string'
    }, {
        name: 'percent',
        type: 'int'
    }, {
        name: 'period',
        type: 'date',
        dateFormat: 'Y-m-d'
    }, {
        name: 'manager_fio',
        type: 'string'
    }, {
        name: 'manager_fio',
        type: 'string'
    }, {
        name: 'record_id',
        type: 'int'
    }, {
        name: 'status',
        type: 'int'
    }],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/documentsqueue'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        },
        remoteSort: true
    }
});
