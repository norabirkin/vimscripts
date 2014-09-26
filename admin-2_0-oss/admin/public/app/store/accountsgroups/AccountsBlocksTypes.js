Ext.define('OSS.store.accountsgroups.AccountsBlocksTypes', {
    extend: 'Ext.data.Store',
    fields: [
        { type: 'string', name: 'name' }, 
        { type: 'int', name: 'id' }
    ],
    data: [
        { name: OSS.Localize.get('All'), id: "0" },
        { name: OSS.Localize.get('Blocked by balance'), id: "1" },
        { name: OSS.Localize.get('Blocked by client'), id: "2" },
        { name: OSS.Localize.get('Blocked by manager'), id: "3" },
        { name: OSS.Localize.get('Blocked by traffic'), id: "5" },
        { name: OSS.Localize.get('Turned off'), id: "10" }
    ]

});