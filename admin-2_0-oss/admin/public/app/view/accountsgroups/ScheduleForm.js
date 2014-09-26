Ext.define('OSS.view.accountsgroups.ScheduleForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.scheduleform',
    height: 420,
    width: 800,
    layout: 'fit',
    resizable: false,
    modal: true,
    title: OSS.Localize.get("Schedule"),
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'tbspacer',
            width: 5
        }, {
            xtype: 'combobox',
            width: 280,
            valueField: 'id',
            displayField: 'descr',
            store: 'accountsgroups.Agents',
            itemId: 'agents',
            labelWidth: 40,
            tpl: '<tpl for="."><div class="x-boundlist-item">{[values.id]}. {[Ext.util.Format.ellipsis(values.descr, 50)]}</div></tpl>',
            fieldLabel: OSS.Localize.get('Agent')
        }, {
            xtype: 'button',
            itemId: 'addRaspButton',
            iconCls: 'x-ibtn-add',
            disabled: true,
            tooltip: OSS.Localize.get('Add')
        }]
    }],
    items: [{
        xtype: "gridpanel",
        store: "accountsgroups.Schedules",
        plugins: [
           Ext.create('Ext.grid.plugin.CellEditing', {
              clicksToEdit: 1
           })
        ],
        columns: [{ 
            dataIndex: "change_date", 
            width: 150,
            header: OSS.Localize.get("Date"),
            renderer: function (value, meta, record) {
                return Ext.Date.format(value, 'd.m.Y');
            },
            editor: {
                xtype: 'datefield',
                format: 'd.m.Y',
                allowBlank: false
            }
        }, { 
            dataIndex: "change_time", 
            width: 150,
            header: OSS.Localize.get("Time"),
            renderer: function (value, meta, record) {
                return Ext.Date.format(value, 'H:i:s');
            },
            editor: {
                xtype: 'timefield',
                format: 'H:i:s',
                allowBlank: false
            }
        }, /*{ 
            dataIndex: "tar_old_name", 
            flex: 1,
            header: OSS.Localize.get("Current tariff plan"),
            renderer: function (value, meta, record) {
                return value == "" ? OSS.Localize.get("Undefined") : value;
            }
        }, */{ 
            dataIndex: "tar_id_new", 
            flex: 1,
            header: OSS.Localize.get("Scheduled tariff plan"),
            renderer: function (value, meta, record, a, b, c, grid) {
                if (record.get("tar_id_new") == 0) {
                    return "";
                }
                return record.get("tar_new_name") + "(" + record.get("tar_new_symbol") + ")";
            },
            editor: {
                xtype: 'combobox',
                valueField: 'tar_id',
                displayField: 'tar_name',
                store: 'accountsgroups.SchedulingTariffs',
                tpl: '<tpl for="."><div class="x-boundlist-item">{[values.tar_id]}. {[Ext.util.Format.ellipsis(values.tar_name, 30)]}({[values.symbol]})</div></tpl>',
                itemId: 'tariffs'
            }
        }, {
            xtype: 'actioncolumn',
            itemId: 'delete',
            header: '&nbsp',
            width: 25,
            dataIndex: 'record_id',
            getClass: function(v, meta, record) {
                return 'x-ibtn-def x-ibtn-delete';
            }
        }]                     
    }]
});
