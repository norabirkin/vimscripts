Ext.define('OSS.view.documenttemplates.List', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.documenttemplates_list',
    layout: 'fit',
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',

        items: [{
            xtype: 'button',
            itemId: 'actions',
            text: OSS.Localize.get( 'Actions' ),
            menu: {
                xtype: 'menu',
                width: 180,
                items: [{    
                    iconCls: 'x-ibtn-add',
                    itemId: 'addNewDocumentBtn',
                    text: OSS.Localize.get( 'Add' )
                }]
            }
        }]
    }],
    items: [{
        xtype: 'gridpanel',
        store: 'documenttemplates.List',
        itemId: 'docsgrid',
        autoHeight: true,
        dockedItems: [{
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            store: 'documenttemplates.List',
            displayInfo: true
        }],
        columns: [{
            xtype: 'actioncolumn',
            itemId: 'editColumn',
            width: 30,
            iconCls: 'x-ibtn-def x-ibtn-edit'
        }, {
            xtype: 'gridcolumn',
            width: 50,
            dataIndex: 'doc_id',
            text: 'ID'
        }, {
            xtype: 'gridcolumn',
            flex: 1,
            dataIndex: 'name',
            text: OSS.Localize.get('Name')
        }, {
            xtype: 'gridcolumn',
            width: 180,
            dataIndex: 'payable',
            text: OSS.Localize.get('The invoice is paid'),
            renderer: function (value, meta, record) {
                switch(value) {
                    case 0: return OSS.Localize.get('without payment');
                    case 1: return OSS.Localize.get('post-payment');
                    case 2: return OSS.Localize.get('prepayment');
                    case 3: return OSS.Localize.get('prepayment') + ' + ' + OSS.Localize.get('services');
                }
                return '';  
            }
        }, {
            xtype: 'gridcolumn',
            dataIndex: 'group_id',
            width: 180,
            text: OSS.Localize.get('Generate automatically'),
            renderer: function (value, meta, record) {
                if (record.get('user_group_id') < 0 && record.get('group_id') < 0) {
                    return OSS.Localize.get('For no one');
                }
                if (record.get('user_group_id') == 0 && record.get('group_id') == 0) {
                    return OSS.Localize.get('For all');
                }
                if (record.get('user_group_id') > 0) {
                    return record.get('ug_name');
                }
                if (record.get('group_id') > 0) {
                    return record.get('g_name');
                }
                return " ";
            }
        }, {
            xtype: 'actioncolumn',
            width: 30,
            itemId: 'deleteColumn',
            iconCls: 'x-ibtn-def x-ibtn-delete'
        }]
    }]
});
