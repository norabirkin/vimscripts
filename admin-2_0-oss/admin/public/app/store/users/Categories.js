Ext.define( 'OSS.store.users.Categories', {
    extend: 'Ext.data.Store',
    fields: [{ type: 'int', name: 'id' }, { type: 'string', name: 'name' }],
    data: [
        { id: 0, name: OSS.Localize.get('Subscriber') },
        { id: 1, name: OSS.Localize.get('Operator') },
        { id: 2, name: OSS.Localize.get('Dealer') },
        { id: 3, name: OSS.Localize.get('LegalOwner') },
        { id: 4, name: OSS.Localize.get('Advertiser') },
        { id: 5, name: OSS.Localize.get('Partner') },
        { id: 6, name: OSS.Localize.get('Agent') }
    ]
});
