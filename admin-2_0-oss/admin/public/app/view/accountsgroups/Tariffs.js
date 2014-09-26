Ext.define('OSS.view.accountsgroups.Tariffs', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.grouptariffs',
    border: false,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'back'
        }]
    }],
    items: [{ 
        xtype: "gridpanel",
        flex: 1,
        id: 'groupTariffs',
        title: OSS.Localize.get("Tariff plans allowed for scheduling by users"),
        store: 'accountsgroups.GroupTariffs',
        viewConfig: {
            plugins: {
                ptype: 'gridviewdragdrop',
                dragGroup: 'groupTariffsGridDDGr',
                dropGroup: 'freeTariffsGridDDGr'
            }
        },
        columns: [{
            dataIndex: "tar_id", 
            header: OSS.Localize.get("ID"),
            width: 70
        }, { 
            dataIndex: "tar_name", 
            header: OSS.Localize.get("Tariff"),
            flex: 1
        }, {
            xtype: 'actioncolumn',
            itemId: 'delete',
            header: '&nbsp',
            width: 25,
            dataIndex: 'vg_id',
            getClass: function(v, meta, record) {
                return 'x-ibtn-def x-ibtn-delete';
            }                        
        }],
        dockedItems: [{ 
            xtype: 'pagingtoolbar', 
            store: "accountsgroups.GroupTariffs",
            dock: 'bottom'
        }, {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'button',
                text: OSS.Localize.get('Operations'),
                itemId: 'actions',
                menu:[{
                    iconCls: 'x-ibtn-delete',
                    itemId: 'deletePageTariffsBtn',
                    text: OSS.Localize.get('Delete current page')
                }]
            }, { 
                xtype: 'tbseparator' 
            }, 
                OSS.Localize.get("Search") + ': ',
            {
                xtype: 'textfield',
                name: 'search_field_value',
                itemId: 'fullsearch_txt',
                width: 150
            }, {
                xtype: 'button',
                itemId: 'searchbtn',
                iconCls: 'x-ibtn-search',
                style: 'margin-left: 4px',
                text: OSS.Localize.get('Find')
            }]
        }]
    },
    { 
        xtype: "gridpanel",
        id: 'freeTariffs',
        enableDragDrop: true, 
        ddGroup: 'groupTariffs',
        flex: 1,
        title: OSS.Localize.get("Available tariffs"),
        store: 'accountsgroups.FreeTariffs',
        viewConfig: {
            plugins: {
                ptype: 'gridviewdragdrop',
                dragGroup: 'freeTariffsGridDDGr',
                dropGroup: 'groupTariffsGridDDGr'
            }
        },
        columns: [{
            dataIndex: "tar_id", 
            header: OSS.Localize.get("ID"),
            width: 70
        }, { 
            dataIndex: "tar_name", 
            header: OSS.Localize.get("Tariff"),
            flex: 1
        }],
        dockedItems: [{ 
            xtype: 'pagingtoolbar', 
            store: "accountsgroups.FreeTariffs",
            dock: 'bottom'
        }, {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'button',
                text: OSS.Localize.get('Operations'),
                itemId: 'actions',
                menu:[{
                    iconCls: 'x-ibtn-add',
                    itemId: 'addPageTariffsBtn',
                    text: OSS.Localize.get('Add current page')
                }]
            }, { 
                xtype: 'tbseparator' 
            }, 
                OSS.Localize.get("Search") + ': ',
            {
                xtype: 'textfield',
                name: 'search_field_value',
                itemId: 'fullsearch_txt',
                width: 150
            }, {
                xtype: 'button',
                itemId: 'searchbtn',
                iconCls: 'x-ibtn-search',
                style: 'margin-left: 4px',
                text: OSS.Localize.get('Find')
            }]
        }]
    }]
});
