Ext.define( "OSS.store.users.searchtemplates.Parameters", {
    extend: "Ext.data.Store",
    requires: 'OSS.model.users.searchtemplates.Parameter',
    model: 'OSS.model.users.searchtemplates.Parameter',
    data: [
        { name: 'accounts.type', descr: OSS.Localize.get('User type'), values: '' },
        { name: 'accounts.name', descr: OSS.Localize.get('User name'), values: '' },
        { name: 'accounts.login', descr: OSS.Localize.get('User login'), values: '' },
        { name: 'accounts.email', descr: 'Email', values: '' },
        { name: 'agreements.balance', descr: OSS.Localize.get('Balance'), values: '' },
        { name: 'agreements.number', descr: OSS.Localize.get('Agreement'), values: '' },
        { name: 'agreements.code', descr: OSS.Localize.get('Paycode'), values: '' },
        { name: 'agreements.credit', descr: OSS.Localize.get('Credit'), values: '' },
        { name: 'agreements.balance_status', descr: OSS.Localize.get('Deptor'), values: '' },
        { name: 'accounts_addr.address', descr: OSS.Localize.get('Address'), values: '' },
        { name: 'vgroups.login', descr: OSS.Localize.get('Account login'), values: '' },
        { name: 'vgroups.id', descr: OSS.Localize.get('Module'), values: '' },
        { name: 'vgroups.blocked', descr: OSS.Localize.get('Blocking'), values: '' },
        { name: 'vgroups.current_shape', descr: OSS.Localize.get('Current shape'), values: '' },
        { name: 'vgroups.tar_id', descr: OSS.Localize.get('Tarif'), values: '' },
        { name: 'vgroups.archive', descr: OSS.Localize.get('Deleted accounts'), values: '' },
        { name: 'staff.segment', descr: 'IP ' + OSS.Localize.get('Address'), values: '' },
        { name: 'mac_staff.mac', descr: 'MAC ' + OSS.Localize.get('Address'), values: '' },
        { name: 'currency.id', descr: OSS.Localize.get('Currency'), values: '' },
        { name: 'agreements.oper_id', descr: OSS.Localize.get('Operator'), values: '' },
        { name: 'agreements_groups', descr: OSS.Localize.get('Agreements groups'), values: '' }
    ]
});
