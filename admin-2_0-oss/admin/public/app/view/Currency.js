Ext.define('OSS.view.Currency', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.currency',
    title: OSS.Localize.get( 'Currency / Rate' ),
    layout: { type: 'border' },
    frame: true,
    plain: true,
    dockedItems: [{
        xtype: 'toolbar',
        items: [{ 
            xtype: 'button', 
            text: OSS.Localize.get( 'Actions' ),
            itemId: 'actions', 
            menu: [{ 
                iconCls: 'x-ibtn-add',
                itemId: 'addCurrBtn',
                text: OSS.Localize.get( 'Add currency' )
            }, {
                iconCls: 'x-ibtn-def x-ibtn-edit',
                itemId: 'editCurrBtn',
                text: OSS.Localize.get( 'Edit currency' )
            }, {
                iconCls: 'x-ibtn-def x-ibtn-delete',
                itemId: 'delCurrBtn',
                text: OSS.Localize.get( 'Delete' )
            }]
        }, '->', {
            xtype: 'button',
            iconCls: 'x-ibtn-prev',
            itemId: 'prevMonthBtn',
            text: i18n.get( 'Предыдущий месяц' )
        }, {
            xtype: 'button',
            iconCls: 'x-ibtn-next',
            itemId: 'nextMonthBtn',
            text: i18n.get( 'Следующий месяц' )
        }]
    }],
    items: [{ 
        xtype: 'osscurrenciesgrid' 
    }, {
        xtype: 'osscurrenciespanel'
    }]
});