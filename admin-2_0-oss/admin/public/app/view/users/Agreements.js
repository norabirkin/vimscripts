Ext.define('OSS.view.users.Agreements', {
    extend: 'Ext.grid.Panel',
    title: i18n.get('Agreements'),
    selType: 'checkboxmodel',
    alias: 'widget.users_agreements',
    store: 'users.Agreements',
    initComponent: function() {
        this.callParent(arguments);
    },
    tbar: [{ 
        xtype: 'button',
        itemId: 'back',
        text: i18n.get('Back')
    }],
    columns: [
        { dataIndex: 'agrm_num', header: i18n.get('Number'), flex: 1 },
        { 
            dataIndex: 'oper_id', 
            header: i18n.get('Operator'),
            flex: 1,
            renderer: function( value ) {
                   return Ext.data.StoreManager.lookup( 'OperatorsList' ).findRecord( 'uid', value, 0, false, true, true ).get('name');
            }
        },
        { dataIndex: 'pay_code', header: i18n.get('Payment code') },
        { dataIndex: 'balance', header: i18n.get('Balance') },
        { dataIndex: 'symbol', header: i18n.get('Symbol') },
        /*{
            itemId: 'edit',
            width: 30,
            xtype: 'actioncolumn',
            tooltip: i18n.get('Edit'),
            iconCls: 'x-ibtn-def x-ibtn-edit'
        },*/
        {
            xtype: 'actioncolumn',
            tooltip: i18n.get( 'Payments' ), 
            itemId: 'payments',
            iconCls: 'x-ibtn-def x-ibtn-money',
            width: 20
        },
        {
            xtype: 'actioncolumn',
            tooltip: i18n.get( 'Rent charges' ), 
            itemId: 'rent_charges',
            iconCls: 'x-ibtn-def x-ibtn-chart',
            width: 20
        },
        {
            xtype: 'actioncolumn',
            tooltip: i18n.get( 'Management of blocking' ), 
            itemId: 'block',
            iconCls: 'x-ibtn-def x-ibtn-lock',
            width: 20
        },
        {
            xtype: 'actioncolumn',
            tooltip: i18n.get( 'Additional fields' ), 
            itemId: 'agrmAddons',
            iconCls: 'x-ibtn-def x-ibtn-additional',
            width: 20
        },
        {
            xtype: 'actioncolumn',
            tooltip: i18n.get( 'Terminate contract' ), 
            itemId: 'terminate',
            iconCls: 'x-ibtn-def x-ibtn-remove',
            width: 20
        }
    ]
});
