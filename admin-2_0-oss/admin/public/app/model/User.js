Ext.define('OSS.model.User', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'uid', type: 'int' },
        { name: 'is_template', type: 'int' },
        { name: 'name', type: 'string' },
        { name: 'balance', type: 'float' },
        { name: 'agrmid', type: 'int' },
        { name: 'agrmnum', type: 'string' },
        { name: 'agrmdate', type: 'date' , format: "Y-m-d"},
        { name: 'symbol', type: 'string' },
        { name: 'descr', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'mobile', type: 'string' },
        { name: 'addrtype', type: 'int' },
        { name: 'addrcode', type: 'string' },
        { name: 'address', type: 'string' },
        { name: 'vgcnt', type: 'int' },
        { name: 'login', type: 'string' },
        { name: 'type', type: 'int' },
        { name: 'address_1', type: 'string' },
        { name: 'address_2', type: 'string' },
        { name: 'address_3', type: 'string' },
        { name: 'address_descr_1', type: 'string' },
        { name: 'address_descr_2', type: 'string' },
        { name: 'address_descr_3', type: 'string' },
        { name: 'address_code_1', type: 'string' },
        { name: 'address_code_2', type: 'string' },
        { name: 'address_code_3', type: 'string' },
        { name: 'ppdebt', type: 'float' },
        { name: 'category', type: 'int' },
        { name: 'code', type: 'string' },
        { name: 'opername', type: 'string' },
        { name: 'closedon' }
    ],
    proxy: {
        type: 'rest',
        url: Ext.Ajax.getRestUrl('api/users'),
        reader: {
            type: 'json',
            root: 'results',
            totalProperty: 'total'
        }
    }
});
