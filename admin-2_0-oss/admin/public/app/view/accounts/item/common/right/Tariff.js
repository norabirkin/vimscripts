/**
 * Группа полей связанных с тарифом в правой части вкладки <Общие> панели создания/редактирования учетной записи
 *
 * ref: 'accounts > #form > #common > #right > #tariff'
 */
Ext.define('OSS.view.accounts.item.common.right.Tariff', {
    extend: 'Ext.form.FieldSet',
    itemId: 'tariff',
    //padding: '10',
    defaultBackground: true,
    //layout: 'fit',
    defaults: {
        anchor: '100%'
    },
    initComponent: function() {
        var labelWidth = 120;
        this.items = [{
            xtype: 'fieldcontainer',
            //padding: '5 0',
            fieldLabel: OSS.Localize.get('Tarifs'),
            labelWidth: labelWidth,
            layout: 'hbox',
            itemId: 'field',
            items: [{
                xtype: 'button',
                disabled: true,
                itemId: 'choose',
                iconCls: 'x-ibtn-list',
                tooltip: i18n.get('Choose')
            }, {
                xtype: 'tbspacer',
                width: 5
            }, {
                xtype: 'button',
                hidden: true,
                itemId: 'view',
                disabled: true,
                iconCls: 'x-ibtn-info',
                tooltip: i18n.get('Go to view selected tariff')
            }, {
                xtype: 'tbspacer',
                width: 5
            }, {
                xtype: 'displayfield',
                itemId: 'descr',
                flex: 1
            }]
        }, {
            xtype: 'displayfield',
            //padding: '0 0 5 0',
            labelWidth: labelWidth,
            itemId: 'rent',
            fieldLabel: i18n.get('Rent'),
            flex: 1
        }, {
            xtype: 'displayfield',
            flex: 1,
            //padding: '0 0 5 0',
            labelWidth: labelWidth,
            fieldLabel: i18n.get('Write rent off'),
            value: 2,
            valueField: 'id',
            displayField: 'name',
            itemId: 'daily_rent',
            store: Ext.create('Ext.data.Store', {
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'name',
                    type: 'string'
                }],
                data: [{
                    id: 2,
                    name: ''
                }, {
                    id: 1,
                    name: i18n.get('daily')
                }, {
                    id: 0,
                    name: i18n.get('monthly')
                }]
            })
        }, {
            xtype: 'displayfield',
            //padding: '0 0 5 0',
            itemId: 'act_block',
            fieldLabel: i18n.get('Service blocking'),
            labelWidth: labelWidth,
            flex: 1,
            value: -1,
            valueField: 'id',
            displayField: 'name',
            store: Ext.create('Ext.data.Store', {
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'name',
                    type: 'string'
                }],
                data: [{
                    id: -1,
                    name: ''
                }, {
                    id: 0,
                    name: i18n.get('None')
                }, {
                    id: 1,
                    name: i18n.get('Automatically')
                }, {
                    id: 2,
                    name: i18n.get('Aggressive')
                }]
            })
        }, {
            xtype: 'displayfield',
            hidden: true,
            itemId: 'tar_shape',
            labelWidth: labelWidth,
            //padding: '0 0 5 0',
            fieldLabel: i18n.get('Shape rate') + ' (' + i18n.get('Kbit') + '/' + i18n.get('sec-s') + ')',
            flex: 1
        }];
        this.callParent(arguments);
    }
});
