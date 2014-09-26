Ext.define('OSS.view.packets.PacketsSelectForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.packetsselect',
    height: 650,
    width: 1000,
    layout: 'fit',
    resizable: false,
    title: OSS.Localize.get('Promotions'),
    modal: true,
    items: [{
        xtype: "gridpanel",
        id: "packetspanel",
        store: "packets.List",
        columnLines: true,
        selModel: Ext.create('Ext.selection.CheckboxModel'),
        columns: [{ 
            dataIndex: "packet_id", 
            width: 80,
            header: OSS.Localize.get("ID")
        }, { 
            dataIndex: "name", 
            flex: 1,
            header: OSS.Localize.get("Name")
        }, { 
            dataIndex: "discount", 
            width: 100,
            header: OSS.Localize.get("Discount"),
            renderer: function(value, meta, record) {
                return value + (record.get('disctype') == 0 ? '%' : '');
            }
        }, { 
            dataIndex: "date_from", 
            width: 160,
            header: OSS.Localize.get("Period"),
            renderer: function(value, meta, record) {
                var str = '';
                if (Ext.isDate(value)) {
                    str += OSS.Localize.get('Since') + ' ' + Ext.Date.format( value, 'd.m.Y');
                }
                if (Ext.isDate(record.get('date_to'))) {
                    str += ' ' + OSS.Localize.get('Till') + ' ' + Ext.Date.format( record.get('date_to'), 'd.m.Y');
                }
                return str;
            }
        }, { 
            dataIndex: "date_end", 
            width: 120,
            header: OSS.Localize.get("Turn off package (date)"),
            renderer: function(value) {
                try {
                    return Ext.Date.format( value, 'd.m.Y');
                } catch (e) {
                }
            }
        }, { 
            dataIndex: "state", 
            width: 150,
            header: OSS.Localize.get("Status"),
            renderer: function(value) {
                switch(value) {
                    case 0: return OSS.Localize.get('Available, not assigned');
                    case 1: return OSS.Localize.get('Is acting, available');
                    case 2: return OSS.Localize.get('Is acting, not available');
                    case 3: return OSS.Localize.get('Not available, completed');
                    case 4: return OSS.Localize.get('Removed');
                }
            }
        }],
        dockedItems: [{ 
            xtype: 'pagingtoolbar', 
            store: "packets.List",
            dock: 'bottom'
        }, {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'button',
                itemId: 'assignPacketsBtn',
                iconCls: 'x-ibtn-save',
                text: OSS.Localize.get('Assign')
            }]
        }]
    }]
});
