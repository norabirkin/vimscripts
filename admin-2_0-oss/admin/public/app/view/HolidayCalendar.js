Ext.define("OSS.view.HolidayCalendar", {
    extend: "Ext.Window",
    alias: "widget.holidayCalendar",
    title: i18n.get('Calendar of holidays'),
    iconCls: 'x-ibtn-calendar',
    width: 380,
    closeAction: 'hide',
    dockedItems: [{
        xtype: 'toolbar',
        items:[ 
            i18n.get('Period') + ':&nbsp;', 
        {
            xtype: 'combo',
            name: 'month',
            itemId: 'monthCmb',
            editable: false,
            width: 200,
            displayField: 'name',
            valueField: 'id',
            triggerAction: 'all',
            queryMode: 'local',
            store: Ext.create('Ext.data.Store', {
                autoLoad: false,
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'name',
                    type: 'string'
                }],
                data: []
            })
        }, {
            xtype: 'tbspacer'
        }, {
            xtype: 'combo',
            name: 'year',
            itemId: 'yearCmb',
            width: 100,
            editable: false,
            displayField: 'id',
            valueField: 'id',
            triggerAction: 'all',
            queryMode: 'local',
            store: Ext.create('Ext.data.Store', {
                autoLoad: false,
                fields: [{
                    name: 'id',
                    type: 'int'
                }],
                data: []
            })
        }]
    }],
    items: [{
        xtype: 'form',
        frame: true,
        hideLabels: true,
        autoHeight: true,
        items: [{
            xtype: 'container',
            autoWidth: true,
            tpl: new Ext.XTemplate(
                '<table style="width: auto"><tr>',
                    '<tpl for="."><td style="width: 48px; font-weight: bold;">{name}</td></tpl>',
                '</tr></table>'
            ),
            data: [
                { name: i18n.get('Mon') },
                { name: i18n.get('Tue') },
                { name: i18n.get('Wed') },
                { name: i18n.get('Thu') },
                { name: i18n.get('Fri') },
                { name: i18n.get('Sat') },
                { name: i18n.get('Sun') }
            ]
        }]
    }],
    buttons: [{
        xtype: 'button',
        itemId: 'saveBtn',
        text: i18n.get('Save')
    }]
    
});
