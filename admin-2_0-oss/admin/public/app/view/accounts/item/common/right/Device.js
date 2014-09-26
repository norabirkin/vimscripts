/**
 * Группа полей <Оборудование>
 *
 * ref: 'accounts > #form > #common > #right > #device'
 */
Ext.define('OSS.view.accounts.item.common.right.Device', {
    extend: 'Ext.form.FieldSet',
    itemId: 'device',
    hidden: true,
    padding: '10',
    layout: 'fit',
    initComponent: function() {
        var labelWidth = 120;
        this.items = [{
            xtype: 'textfield',
            padding: '0 0 5 0',
            fieldLabel: i18n.get('Name'),
            labelWidth: labelWidth,
            flex: 1,
            name: 'device_name',
            readOnly: true                              
        }, {
            xtype: 'textfield',
            labelWidth: labelWidth,
            padding: '0 0 5 0',
            flex: 1,
            readOnly: true,
            fieldLabel: i18n.get('Vlan'),
            name: 'port_vlan'
        }, {
            xtype: 'textarea',
            padding: '0 0 5 0',
            fieldLabel: i18n.get('Comment'),
            flex: 1,
            labelWidth: labelWidth,
            name: 'port_comment'
        }, {
            xtype: 'displayfield',
            padding: '0 0 5 0',
            flex: 1,
            labelWidth: labelWidth,
            fieldLabel: i18n.get('Device port'),
            name: 'device_port'
        }, {
            xtype: 'textfield',
            padding: '0 0 5 0',
            flex: 1,
            labelWidth: labelWidth,
            fieldLabel: i18n.get('Policy'),
            name: 'policy_name'
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            fieldLabel: i18n.get('Port'),
            labelWidth: labelWidth,
            items: [{
                xtype: 'button',
                itemId: 'port',
                iconCls: 'x-ibtn-list',
                tooltip: i18n.get('Change')
            }, {
                xtype: 'tbspacer',
                width: 10
            }, {
                xtype: 'button',
                itemId: 'removePort',
                iconCls: 'x-ibtn-clear',
                tooltip: i18n.get('Remove port')
            }]
        }];
        this.callParent(arguments);
    }
});
