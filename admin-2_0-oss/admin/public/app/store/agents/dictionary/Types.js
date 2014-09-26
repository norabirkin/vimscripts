Ext.define( "OSS.store.agents.dictionary.Types", {
    extend: "Ext.data.Store",
    data: [
        { id: 0, name: 'int'},
        { id: 1, name: 'string'},
        { id: 2, name: 'avpair'},
        { id: 3, name: 'ipaddr'},
        { id: 5, name: 'url'},
        { id: 6, name: 'octet'},
        { id: 7, name: 'sublist'}
    ],
    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' }
    ]
});
