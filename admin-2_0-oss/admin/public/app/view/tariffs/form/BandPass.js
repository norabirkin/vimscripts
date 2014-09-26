/**
 * Вкладка "Настройки полосы пропускания" формы тарифов
 */
Ext.define('OSS.view.tariffs.form.BandPass', {
    extend: 'Ext.panel.Panel',
    itemId: 'bandpass',
    title: i18n.get('Bandpass settings'),
    layout: 'border',
    initComponent: function() {
        this.tbar = [Ext.create('OSS.view.tariffs.form.Back'), 
        '-', 
        {
            xtype: 'splitbutton',
            text: i18n.get('Actions'),
            handler: function(B){
                B.showMenu();
            },
            menu: {
                items: [{
                    text: i18n.get('Add'),
                    iconCls: 'x-ibtn-add',
                    menu: {
                        items:[{
                            text: i18n.get('by time'),
                            itemId: 'addByTime'
                        }, {
                            text: i18n.get('by size'),
                            itemId: 'addBySize'
                        }]
                    }
                }, {
                    text: i18n.get('Remove'),
                    iconCls: 'x-ibtn-remove',
                    menu: {
                        items:[{
                            text: i18n.get('by time'),
                            itemId: 'removeByTime'
                        }, {
                            text: i18n.get('by size'),
                            itemId: 'removeBySize'
                        }]
                    }
                }]
            }
        }];
        this.items = [
            Ext.create('OSS.view.tariffs.form.bandpass.Time'),
            Ext.create('OSS.view.tariffs.form.bandpass.Size')
        ];
        this.callParent(arguments);
    }
});
