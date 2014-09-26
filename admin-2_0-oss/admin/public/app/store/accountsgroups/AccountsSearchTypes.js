Ext.define('OSS.store.accountsgroups.AccountsSearchTypes', {
    extend: 'Ext.data.Store',
    fields: [
        { type: 'string', name: 'name' }, 
        { type: 'string', name: 'key' }
    ],
    data: [
        { name: OSS.Localize.get('User'), key: "name" },
        { name: OSS.Localize.get('Agreement'), key: "agrm_num" },
        { name: OSS.Localize.get('Login'), key: "login" },
        { name: OSS.Localize.get('Address'), key: "address" },
        { name: OSS.Localize.get('Tarif'), key: "tar_id" },
        { name: OSS.Localize.get('Status'), key: "blocked" },
        { name: OSS.Localize.get('Agent'), key: "agent_id" }
    ]

});
