Ext.define( 'OSS.store.users.UserBillsDelivery', {
    extend: 'Ext.data.Store',
    fields: [{ type: 'int', name: 'id' }, { type: 'string', name: 'name' }],
    data: [
        { id: 0, name: i18n.get('By a courier') },
        { id: 1, name: i18n.get('By post') },
        { id: 2, name: i18n.get('By self') },
        { id: 3, name: i18n.get('Other') },
        { id: 4, name: i18n.get('Email') }
    ]
});
