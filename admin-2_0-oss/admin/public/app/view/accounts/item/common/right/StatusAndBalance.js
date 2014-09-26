/**
 * Группа полей связанных со статусом и балансом в правой части вкладки <Общие> панели создания/редактирования учетной записи
 *
 * ref: 'accounts > #form > #common > #right > #statusAndBalance'
 */
Ext.define('OSS.view.accounts.item.common.right.StatusAndBalance', {
    extend: 'Ext.form.FieldSet',
    itemId: 'statusAndBalance',
    defaultBackground: true,
    initComponent: function() {
        var labelWidth = 120;
        this.items = [{
            xtype: 'displayfield',
            labelWidth: labelWidth,
            name: 'blocked',
            fieldLabel: i18n.get('Status'),
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
                    name: i18n.get('On state')
                }, {
                    id: 1,
                    name: i18n.get('Blocked by balance')
                }, {
                    id: 2,
                    name: i18n.get('Blocked by client')
                }, {
                    id: 3,
                    name: i18n.get('Blocked by manager')
                }, {
                    id: 4,
                    name: i18n.get('Blocked by balance')
                }, {
                    id: 5,
                    name: i18n.get('Blocked by traffic')
                }, {
                    id: 10,
                    name: i18n.get('Turned off')
                }]
            })
        }, {
            xtype: 'fieldcontainer',
            itemId: 'balance',
            fieldLabel: i18n.get('Balance'),
            labelWidth: labelWidth,
            layout: 'hbox',                   
            items: [{
                xtype: 'button',
                itemId: 'pay',
                disabled: true,
                iconCls: 'x-ibtn-money',
                tooltip: i18n.get('Save payment')
            }, {
                padding: '0 0 0 5',
                xtype: 'displayfield',
                name: 'balance'
            }]
        }, {
            xtype: 'displayfield',
            labelWidth: labelWidth,
            name: 'payment_method',
            fieldLabel: i18n.get('Type of agreement'),
            value: -1,
            valueField: 'id',
            displayField: 'name',
            store: Ext.create('OSS.store.agreements.Types')
        }];
        this.callParent(arguments);
    }
});

