Ext.define('OSS.view.promotions.PromotionsSelectForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.promotionsselect',
    height: 650,
    width: 1000,
    layout: 'fit',
    resizable: false,
    title: OSS.Localize.get('Promotions'),
    modal: true,
    items: [{
        xtype: "gridpanel",
        id: "promotionspanel",
        store: "promotions.List",
        selType: 'checkboxmodel',
        columns: [{ 
            dataIndex: "name", 
            flex: 1,
            header: OSS.Localize.get("Name")
        },{ 
            dataIndex: "object", 
            header: OSS.Localize.get("For"),
            width: 120,
            renderer: function(value) {
                switch(value) {
                    case 0: return OSS.Localize.get('User');
                    case 1: return OSS.Localize.get('Аgreement');
                    case 2: return OSS.Localize.get('Account');
                }
            }
        }, { 
            dataIndex: "type", 
            header: OSS.Localize.get("Type"),
            width: 75,
            renderer: function(value) {
                switch(value) {
                    case 1: return OSS.Localize.get('conditional promotion');
                    case 2: return OSS.Localize.get('unconditional promotion');
                    case 3: return OSS.Localize.get('combined promotion');
                }
            }
        }, { 
            dataIndex: "date_from_start", 
            header: OSS.Localize.get("Можно назначить с"),
            width: 120,
            renderer: function(value) {
                try {
                    return Ext.Date.format( value, 'd.m.Y');
                } catch (e) {
                }
            }
        }, { 
            dataIndex: "date_from_end", 
            header: OSS.Localize.get("Можно назначить до"),
            width: 120,
            renderer: function(value) {
                try {
                    if (Ext.isEmpty(value)) {
                        return OSS.Localize.get('No limits');
                    }
                    return Ext.Date.format( value, 'd.m.Y');
                } catch (e) {
                }
            }
        }, { 
            dataIndex: "date_to", 
            header: OSS.Localize.get("Фактическое окончание"),
            renderer: function(value) {
                try {
                     if (Ext.isEmpty(value)) {
                        return OSS.Localize.get('No limits');
                    }
                    return Ext.Date.format( value, 'd.m.Y');
                } catch (e) {
                }
            }
        }, { 
            dataIndex: "day_count", 
            header: OSS.Localize.get("Действует с момента подключения (дней)")
        }],
        dockedItems: [{ 
            xtype: 'pagingtoolbar', 
            store: "promotions.List",
            dock: 'bottom'
        }, {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'button',
                itemId: 'assignPromotionsBtn',
                iconCls: 'x-ibtn-save',
                text: OSS.Localize.get('Assign')
            }]
        }]
    }]
});
