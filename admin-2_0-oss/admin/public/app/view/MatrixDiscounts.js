Ext.define("OSS.view.MatrixDiscounts", {
    extend: "Ext.panel.Panel",
    alias: "widget.matrixdiscounts",
    layout: 'fit',
    items: [{ 
        xtype: "gridpanel",
        title: OSS.Localize.get("Matrix discounts"),
        id: "matrixdiscountspanel",
        store: "matrixdiscounts.MatrixDiscounts",
        selType: 'cellmodel',
        plugins: [
           Ext.create('Ext.grid.plugin.CellEditing', {
              clicksToEdit: 1
           })
        ],
        columns: [{ 
            dataIndex: "type", 
            header: OSS.Localize.get("Type"),
            width: 160,
            renderer: function(value) {
                switch(value) {
                    case 1: return OSS.Localize.get('Promotion');
                    case 2: return OSS.Localize.get('Package');
                    case 3: return OSS.Localize.get('Personal discount');
                }
            }
        }, { 
            dataIndex: "descr", 
            header: OSS.Localize.get("Name"),
            renderer: function(value, meta, record) {
                return !record.get('descr') ? '---' : value;
            },
            flex: 1 
        }, { 
            dataIndex: "method", 
            header: OSS.Localize.get("Operation"),
            width: 140,
            renderer: function(value) {
                return (value == 1) ?  OSS.Localize.get('Do not sum') :  OSS.Localize.get('Sum');
            },
            editor: {
                xtype: 'combo',
                triggerAction: 'all',
                valueField: 'id',
                displayField: 'name',
                editable: false,
                mode: 'local',
                store: Ext.create( "Ext.data.Store", {
                    fields: [ 
                        { type: 'int', name: 'id' }, 
                        { type: 'string', name: 'name' }
                    ],
                    data: [
                        { id: 0, name: OSS.Localize.get('Sum') },
                        { id: 1, name: OSS.Localize.get('Do not sum') }
                    ]
                })
            }
        }, {
            xtype: 'actioncolumn',
            header: '&nbsp',
            width: 25,
            dataIndex: 'id',
            getClass: function(v, meta, record) {
                return 'x-ibtn-def x-ibtn-delete';
            }                        
        }],
        dockedItems: [{ 
            xtype: 'pagingtoolbar', 
            store: "Paycards",
            dock: 'bottom'
        }, {
            xtype: 'toolbar',
            dock: 'top',
            itemId: 'searchTbar',
            items: [{
                xtype: 'button',
                text: OSS.Localize.get( 'Operations' ),
                itemId: 'actions',
                menu:[{
                    iconCls: 'x-ibtn-add', 
                    itemId: 'addPromotionBtn',
                    text: OSS.Localize.get( 'Add Promotion' )
                }, {
                    iconCls: 'x-ibtn-add', 
                    itemId: 'addPacketBtn',
                    text: OSS.Localize.get( 'Add packet' )
                }, {
                    iconCls: 'x-ibtn-add', 
                    itemId: 'addPersonDiscBtn',
                    text: OSS.Localize.get( 'Add personal discount' )
                }]
            }]
        }]
    }]
});
