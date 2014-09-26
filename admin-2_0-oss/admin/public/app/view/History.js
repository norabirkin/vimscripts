Ext.define('OSS.view.History', {
    extend: 'Ext.Window',
    alias: 'widget.history',
    width: 1000,
    resizable: false,
    title: OSS.Localize.get('Rent charges'),
    initComponent: function() {
        this.items = [
            {
                xtype: 'container',
                itemId: 'wrapper',
                padding: '13 7 7 7',
                items: [
                    Ext.create('OSS.view.Agreements', {
                        store: Ext.app.Application.instance.getController('Users').getAgreementsStore()
                    })
                ]
            },
            Ext.create('OSS.view.history.Tabs') 
        ];
        this.callParent( arguments );
    }
});
