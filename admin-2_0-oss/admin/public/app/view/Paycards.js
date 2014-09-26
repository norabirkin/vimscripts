Ext.define("OSS.view.Paycards", {
    extend: "Ext.panel.Panel",
    alias: "widget.paycards",
    layout: 'fit',
    items: [{ 
        xtype: "gridpanel",
        title: OSS.Localize.get("Pre-paid cards"),
        id: "paycardspanel",
        store: "Paycards",
        viewConfig: {
            enableTextSelection: true
        },
        columns: [
            { 
                dataIndex: "ser_no", 
                header: OSS.Localize.get("Series")
            }, { 
                dataIndex: "set_name", 
                header: OSS.Localize.get("Set") 
            }, { 
                dataIndex: "card_key", 
                header: OSS.Localize.get("Key"),
                flex: 1 
            }, { 
                dataIndex: "sum", 
                header: OSS.Localize.get("Amount"),
                renderer: function(value, meta, record) {
                    return value + ' ' + record.get('symbol');
                }
            }, { 
                dataIndex: "create_date", 
                header: OSS.Localize.get("Creation date"),
                width: "120px",
                renderer: function(value){
                    return Ext.Date.format( value, 'd.m.Y');
                }
            }, { 
                dataIndex: "act_til", 
                header: OSS.Localize.get("Activate till"),
                width: "120px",
                renderer: function(value){
                    return Ext.Date.format( value, 'd.m.Y');
                }
            }, { 
                dataIndex: "activate_date",
                header: OSS.Localize.get("Activation date"),
                renderer: function(value){
                    return Ext.Date.format( value, 'd.m.Y');
                },
                hidden: true
            },{ 
                dataIndex: "expire_period", 
                header: OSS.Localize.get("Validity period"),
                renderer: function(value){
                    
                    if (value == 0) {
                        return OSS.Localize.get("Unlimited");
                    }

                    if (value < 60) {
                        return value + ' (' + OSS.Localize.get("Seconds") + ')'
                    }
                    var iter = 0;
                    while (value > 60 && iter < 3) {
                        value = value / ((iter < 2) ? 60 : 24);
                        iter++;
                    }
                    return value + ' (' + ((iter == 1) ? OSS.Localize.get("Minutes") : ((iter == 2) ? OSS.Localize.get("Hours") : OSS.Localize.get("Days"))) + ')';
                }
            }, { 
                dataIndex: "mod_person_name", 
                header: OSS.Localize.get("Author")
            }, { 
                dataIndex: "user_name",
                header: OSS.Localize.get("Activated by"),
                hidden: true     
            }
        ],
        dockedItems: [{ 
            xtype: 'pagingtoolbar', 
            store: "Paycards",
            dock: 'bottom'
        }, {
            xtype: 'toolbar',
            dock: 'top',
            items: [{ 
                xtype: 'button', 
                text: OSS.Localize.get( 'Actions' ),
                itemId: 'actions', 
                menu: [{ 
                    iconCls: 'x-ibtn-add',
                    itemId: 'paycardsgen',
                    text: OSS.Localize.get('Generate pre-paid cards')
                }, {
                    iconCls: 'x-ibtn-def x-ibtn-list',
                    itemId: 'downloadbtn',
                    text: OSS.Localize.get('Export'),
                    menu: [{
                        text: OSS.Localize.get('Current page'),
                        itemId: 'exportCurrentBtn'
                    }, {
                        text: OSS.Localize.get('All'),
                        itemId: 'exportAllBtn'
                    }]
                }]
            }, { 
                xtype: 'tbseparator' 
            },
            OSS.Localize.get("Search") + ': ', 
            {
                xtype: 'combobox',
                itemId: 'is_activated',
                name: 'is_activated',
                valueField: 'id',
                displayField: 'name',
                value: 0,
                width: 120,
                store: Ext.create( "Ext.data.Store", {
                    fields: [{ type: 'int', name: 'id' }, { type: 'string', name: 'name' }],
                    data: [
                        { id: 0, name: OSS.Localize.get('Available') },
                        { id: 1, name: OSS.Localize.get('Used') }
                    ]
                })
            }, OSS.Localize.get("Creation date") + ': ', {
                xtype: 'datefield',
                id: 'cardCreated',
                name: 'create_date',
                width: 95,
                format: 'Y-m-d',
                style: 'margin-left: 5px'
            }, OSS.Localize.get("Activation date") + ': ', {
                xtype: 'datefield',
                itemId: 'cardActivated',
                name: 'activate_date',
                width: 95,
                format: 'Y-m-d',
                style: 'margin-left: 5px',
                disabled: true
            }, OSS.Localize.get("Set") + ': ',{
                xtype: 'combobox',
                name: 'set_id',
                width: 120,
                valueField: 'set_id',
                displayField: 'set_descr',
                store: 'paycards.PaycardsSets',
                tpl: '<tpl for="."><div class="x-boundlist-item">{[values.set_id]}. {[Ext.util.Format.ellipsis(values.set_descr, 25)]}</div></tpl>'
            }, {
                xtype: 'textfield',
                name: 'fullsearch',
                itemId: 'fullsearch',
                width: 150
            }, {
                xtype: 'button',
                itemId: 'searchbtn',
                iconCls: 'x-ibtn-search',
                style: 'margin-left: 4px',
                text: OSS.Localize.get( 'Find' )
            }]

        }]
    }]
});
