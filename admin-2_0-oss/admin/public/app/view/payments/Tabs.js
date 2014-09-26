Ext.define( 'OSS.view.payments.Tabs', {
    extend: 'Ext.tab.Panel',
    itemId: 'tabs',
    disabled: true,
    layout: 'fit',
    anchor: '100% 100%',
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.payments.tabs.Payment'), 
            Ext.create('OSS.view.payments.tabs.Promised'),
            Ext.create('OSS.view.payments.tabs.history.Payments'),
            Ext.create('OSS.view.payments.tabs.Transfer'),
            Ext.create('OSS.view.payments.tabs.history.Promised')
        ];
        this.callParent( arguments );
    }

});
