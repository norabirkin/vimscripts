Ext.define( 'OSS.store.users.DocumentTypes', {
    extend: 'Ext.data.Store',
    fields: [{ type: 'int', name: 'id' }, { type: 'string', name: 'name' }],
    data: [
        { id: 0, name: i18n.get('Accounting document') },
        { id: 1, name: i18n.get('User document') },
        { id: 2, name: i18n.get('Reporting document') },
        { id: 3, name: i18n.get('Receipt') },
        { id: 4, name: i18n.get('Application') },
        { id: 5, name: i18n.get('Notification') },
        { id: 6, name: i18n.get('Account entry') },
        { id: 7, name: i18n.get('Report on payments') }
    ]
});
