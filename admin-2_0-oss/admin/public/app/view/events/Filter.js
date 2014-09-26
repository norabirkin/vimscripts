/**
 * Фильтр раздела "Отчеты/Журнал событий"
 */
Ext.define('OSS.view.events.Filter', {
    extend: 'OSS.view.Filter',
    minWidth: 300,
    actions: {
        iconCls: 'x-ibtn-search',
        itemId: 'show',
        text: i18n.get('Show')
    },
    initComponent: function() {
        var labelWidth = 80,
            dateWidth = 110;
        this.items = [{
            xtype: 'fieldset',
            title: i18n.get('Filter'),
            defaults: {
                labelWidth: labelWidth,
                anchor: '100%'
            },
            items: [{
                xtype: 'datefield',
                anchor: null,
                width: dateWidth + labelWidth,
                fieldLabel: i18n.get('Since'),
                format: 'Y-m-d',
                value: Ext.Date.format(
                    Ext.Date.add(
                        new Date(),
                        Ext.Date.MONTH,
                        -1
                    ),
                    'Y-m-01'
                ),
                name: 'dtfrom'
            }, {
                xtype: 'datefield',
                anchor: null,
                width: dateWidth + labelWidth,
                fieldLabel: i18n.get('Till'),
                format: 'Y-m-d',
                value: Ext.Date.format(
                    Ext.Date.add(
                        new Date(),
                        Ext.Date.MONTH,
                        1
                    ),
                    'Y-m-01'
                ),
                name: 'dtto'
            }, {
                xtype: 'combo',
                value: 0,
                fieldLabel: i18n.get('Initiator'),
                name: 'type',
                displayField: 'name',
                valueField: 'type',
                editable: false,
                queryMode: 'local',
                store: Ext.create('Ext.data.Store', {
                    data: [{
                        type: 0,
                        name: i18n.get('All')
                    }, {
                        type: 1,
                        name: i18n.get('Managers')
                    }, {
                        type: 2,
                        name: i18n.get('Clients')
                    }],
                    fields: [{
                        name: 'type',
                        type: 'int'
                    }, {
                        name: 'name',
                        type: 'string'
                    }]
                })
            }, {
                xtype: 'combo',
                showId: true,
                notDisplayId: true,
                editable: false,
                value: -1,
                fieldLabel: OSS.Localize.get('Manager'),
                defaultOption: {
                    person_id: -1,
                    login: i18n.get('All')
                },
                valueField: 'person_id',
                name: 'person_id',
                displayField: 'login',
                store: 'managers.Managers'
            }, {
                xtype: 'combo',
                fieldLabel: i18n.get('Events'),
                name: 'code',
                displayField: 'name',
                valueField: 'code',
                queryMode: 'local',
                value: '2,3,4,5',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    data: [{
                        code: '0',
                        name: i18n.get('All')
                    }, {
                        code: '2,3,4,5',
                        name: i18n.get('Hide messages about viewing')
                    }, {
                        code: '2',
                        name: i18n.get('Authorizations')
                    }, {
                        code: '3,4',
                        name: i18n.get('Create')
                    }, {
                        code: '5',
                        name: i18n.get('Remove')
                    }],
                    fields: [{
                        name: 'code',
                        type: 'string'
                    }, {
                        name: 'name',
                        type: 'string'
                    }]
                })
            }]
        }];
        this.callParent(arguments);
    }
});
