Ext.define('OSS.store.history.locks.Types', {
    extend: 'Ext.data.Store',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' }
    ],
    data: [
        { id: 0, name: '(0) ' + OSS.Localize.get('Active') },
        { id: 1, name: '(1) ' + OSS.Localize.get('Blocked by balance') },
        { id: 2, name: '(2) ' + OSS.Localize.get('Blocked by client') },
        { id: 3, name: '(3) ' + OSS.Localize.get('Blocked by manager') },
        { id: 4, name: '(4) ' + OSS.Localize.get('Blocked by balance') },
        { id: 5, name: '(5) ' + OSS.Localize.get('Blocked by traffic') },
        { id: 10, name: '(10) ' + OSS.Localize.get('Turned off') }
    ]
});
