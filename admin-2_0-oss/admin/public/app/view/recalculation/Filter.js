/**
 * Фильтр раздела "Действия/Перерасчет"
 */
Ext.define('OSS.view.recalculation.Filter', {
    extend: 'OSS.view.Filter',
    minWidth: 200,
    width: "20%",
    itemId: 'calcForm',
    actions: {
        iconCls: 'x-ibtn-reload',
        itemId: 'startRecals',
        text: i18n.get('Start recalculation')
    },
    items: [{
        xtype: 'fieldset',
        layout: 'anchor',
        defaults: {
            anchor: '100%',
            disabled: true,
            labelWidth: 120
        },
        items: [{
            xtype: 'label',
            itemId: 'stat_alert',
            hidden: true,
            disabled: false,
            text: i18n.get('Statistics will be deleted! Make sure that you have data for re-upload'),
            style: {
                'color': 'red',
                'font-weight': 'bold'
            }
        },{
            xtype: 'combobox',
            disabled: false,
            name: 'agent_id',
            valueField: 'agent_id',
            displayField: 'agent_name',
            width: 290,
            store: 'recalculation.Agents',
            fieldLabel: i18n.get('Agent'),
            labelAlign: 'top',
            allowBlank: false
        }, {
            xtype: 'datefield',
            width: 290,
            fieldLabel: i18n.get('Date'),
            labelAlign: 'top',
            format: 'd.m.Y',
            submitFormat: 'Y-m-d',
            allowBlank: false,
            name: 'recalc_date',
            value: Ext.Date.format(new Date(), '01.m.Y')
        }, {
            xtype: 'combobox',
            name: 'recalc_group',
            valueField: 'group_id',
            displayField: 'name',
            width: 290,
            store: 'recalculation.AccountsGroups',
            fieldLabel: i18n.get('Accounts group'),
            labelAlign: 'top'
        }, {
            xtype: 'combo',
            labelAlign: 'top',
            width: 290,
            displayField: 'name',
            valueField: 'id',
            mode: 'local',
            triggerAction: 'all',
            editable: false,
            itemId: 'recalc_stat',
            name: 'recalc_stat',
            value: 0,
            fieldLabel: i18n.get('Statistics'), 
            store: Ext.create( "Ext.data.Store", {
                fields: [ 
                    { type: 'int', name: 'id' }, 
                    { type: 'string', name: 'name' }
                ],
                data: [
                    { id: 0, name: i18n.get('None') },
                    { id: 1, name: i18n.get('Recalculation') },
                    { id: -1, name: i18n.get('Rollback') }
                ]
            })
        },{
            xtype: 'checkbox',
            licid: 'full',
            width: 290,
            name: 'stat_owner',
            itemId: 'stat_owner',
            labelWidth: 271,
            boxLabel: i18n.get('Remember NLAI owner')
        }, {
            xtype: 'checkbox',
            licid: 'full',
            width: 290,
            name: 'stat_tariff',
            labelWidth: 271,
            boxLabel: i18n.get('Remember tariff')
        }, {
            xtype: 'combo',
            licid: 'full',
            labelAlign: 'top',
            width: 290,
            displayField: 'name',
            valueField: 'id',
            mode: 'local',
            triggerAction: 'all',
            editable: false,
            name: 'recalc_rent',
            value: 0,
            fieldLabel: i18n.get('Rent'), 
            store: Ext.create( "Ext.data.Store", {
                fields: [ 
                    { type: 'int', name: 'id' }, 
                    { type: 'string', name: 'name' }
                ],
                data: [
                    { id: 0, name: i18n.get('None') },
                    { id: 1, name: i18n.get('Recalculation') }
                ]
            })
        }]
    }]
});
