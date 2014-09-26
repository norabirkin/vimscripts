Ext.define('OSS.view.users.Terminate', {
    extend: 'Ext.Window',
    alias: 'widget.users_terminate',
    layout: 'fit',
    initComponent: function() {
        var agreement;
        if (this.agrm_id) {
            agreement = {
                xtype: 'hiddenfield',
                name: 'agrm_id',
                value: this.agrm_id
            };
        } else {
            agreement = Ext.create('OSS.view.Agreements', {
                name: 'agrm_id',
                padding: '10 10 10 10',
                store: Ext.app.Application.instance.getController('Users').getAgreementsStore()
            });
        }
        this.items = [{
            xtype: 'form',
            frame: true,
            defaults: {
                labelWidth: 150
            },
            items: [
                agreement,
                {
                    xtype: 'datefield',
                    padding: '10 10 10 10',
                    name: 'close_date',
                    format: 'Y-m-d',
                    value: Ext.Date.format(new Date(), 'Y-m-d'),
                    fieldLabel: OSS.Localize.get('Date of terminate')
                }
            ]
        }];
        this.callParent( arguments );
    },
    buttonAlign: 'center',
    buttons: [{
        xtype: 'button',
        itemId: 'save',
        text: OSS.Localize.get('Save')
    }]
});
