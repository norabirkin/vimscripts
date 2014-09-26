Ext.define('OSS.view.Payments', {
    extend: 'Ext.Window',
    alias: 'widget.payments',
    width: 1000,
    layout: 'anchor',
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
            Ext.create('OSS.view.payments.Tabs')
        ];
        this.callParent( arguments );
    }
});
