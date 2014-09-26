Ext.define('OSS.view.accountsgroups.Accounts', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.groupaccounts',
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
        id: 'groupAccounts',
        title: OSS.Localize.get("Assigned accounts"),
        store: "accountsgroups.GroupAccounts",
        viewConfig: {
            plugins: {
                ptype: 'gridviewdragdrop',
                dragGroup: 'groupAccountsGridDDGr',
                dropGroup: 'freeAccountsGridDDGr'
            }
        },
        columns: [{
            dataIndex: "login", 
            header: OSS.Localize.get("Account"),
            flex: 1
        }, { 
            dataIndex: "agrm_num", 
            header: OSS.Localize.get("Agreement"),
            flex: 1 
        }, { 
            dataIndex: "user_name", 
            header: OSS.Localize.get("User"),
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
            store: "accountsgroups.GroupAccounts",
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
                    itemId: 'deletePageAccountsBtn',
                    text: OSS.Localize.get('Delete current page')
                },{
                    iconCls: 'x-ibtn-delete',
                    itemId: 'deleteAllAccountsBtn',
                    text: OSS.Localize.get('Delete all')
                }]
            }, { 
                xtype: 'tbseparator' 
            }, 
                OSS.Localize.get("Search") + ': ',
            {
                xtype: 'combobox',
                itemId: 'search_field_cmb',
                name: 'search_field',
                valueField: 'key',
                displayField: 'name',
                value: 'name',
                width: 120,
                store: 'accountsgroups.AccountsSearchTypes'
            },{
                xtype: 'combobox',
                hidden: true,
                itemId: 'fullsearch_cmb_agent',
                name: 'agent_id',
                valueField: 'id',
                displayField: 'descr',
                width: 150,
                store: 'Agents'
            }, {
                xtype: 'combobox',
                hidden: true,
                itemId: 'fullsearch_cmb_tar',
                name: 'tar_id',
                valueField: 'tar_id',
                displayField: 'descr',
                width: 150,
                mode: 'remote',
                lastQuery: '',
                hideTrigger: true,
                triggerAction: 'query',
                queryParam: 'tarsearch',
                forceSelection: true,
                allowBlank: false,
                store: 'accountsgroups.Tariffs'
            },{
                xtype: 'combobox',
                hidden: true,
                itemId: 'fullsearch_cmb_block',
                name: 'blocked',
                valueField: 'id',
                displayField: 'name',
                width: 150,
                store: 'accountsgroups.AccountsBlocksTypes'
            },{
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
        id: 'freeAccounts',
        enableDragDrop: true, 
        ddGroup: 'groupAccounts',
        flex: 1,
        id: 'freeAccounts',
        title: OSS.Localize.get("Available accounts"),
        store: "accountsgroups.FreeAccounts",
        viewConfig: {
            plugins: {
                ptype: 'gridviewdragdrop',
                dragGroup: 'freeAccountsGridDDGr',
                dropGroup: 'groupAccountsGridDDGr'
            }
        },
        columns: [{
            dataIndex: "login", 
            header: OSS.Localize.get("Account"),
            flex: 1
        }, { 
            dataIndex: "agrm_num", 
            header: OSS.Localize.get("Agreement"),
            flex: 1 
        }, { 
            dataIndex: "user_name", 
            header: OSS.Localize.get("User"),
            flex: 1
        }],
        dockedItems: [{ 
            xtype: 'pagingtoolbar', 
            store: "accountsgroups.FreeAccounts",
            dock: 'bottom'
        }, {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'button',
                text: OSS.Localize.get( 'Operations' ),
                itemId: 'actions',
                menu:[{
                    iconCls: 'x-ibtn-add',
                    itemId: 'addPageAccountsBtn',
                    text: OSS.Localize.get('Add current page')
                }]
            }, { 
                xtype: 'tbseparator' 
            }, 
                OSS.Localize.get("Search") + ': ',
            {
                xtype: 'combobox',
                itemId: 'search_field_cmb',
                name: 'search_field',
                valueField: 'key',
                displayField: 'name',
                value: 'name',
                width: 120,
                store: 'accountsgroups.AccountsSearchTypes'
            },{
                xtype: 'combobox',
                hidden: true,
                itemId: 'fullsearch_cmb_agent',
                name: 'agent_id',
                valueField: 'id',
                displayField: 'descr',
                width: 150,
                store: 'Agents'
            }, {
                xtype: 'combobox',
                hidden: true,
                itemId: 'fullsearch_cmb_tar',
                name: 'tar_id',
                valueField: 'tar_id',
                displayField: 'descr',
                width: 150,
                mode: 'remote',
                lastQuery: '',
                hideTrigger: true,
                triggerAction: 'query',
                queryParam: 'tarsearch',
                forceSelection: true,
                allowBlank: false,
                store: 'accountsgroups.Tariffs'
            },{
                xtype: 'combobox',
                hidden: true,
                itemId: 'fullsearch_cmb_block',
                name: 'blocked',
                valueField: 'id',
                displayField: 'name',
                width: 150,
                store: 'accountsgroups.AccountsBlocksTypes'
            },{
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
