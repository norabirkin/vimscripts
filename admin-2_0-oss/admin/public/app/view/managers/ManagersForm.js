Ext.define('OSS.view.managers.ManagersForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.managersform',
    height: 340,
    width: 700,
    layout: 'fit',
    resizable: false,
    modal: true,
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'button',
            itemId: 'formSaveBtn',
            iconCls: 'x-ibtn-save',
            text: OSS.Localize.get( 'Save' )
        }]
    }],
    items: [{
        xtype: 'form',
        method: 'POST',
        frame: true,
        itemId: 'windowForm',
        layout: 'column',
        items: [{
            xtype: 'hidden',
            name: 'person_id'
        }, {
            xtype: 'hidden',
            name: 'pass_changed',
            value: false
        }, {
            xtype: 'fieldset',
            border: false,
            columnWidth: 0.5,
            items: [{
                xtype: 'checkboxfield',
                name: 'payments',
                fieldLabel: OSS.Localize.get( 'External payment system' ),
                labelWidth: 160
            }, {
                xtype: 'checkboxfield',
                name: 'useadvance',
                fieldLabel: OSS.Localize.get( 'Allow advance payment for external PS' ),
                labelWidth: 160
            }, {
                xtype: 'textfield',
                name: 'fio',
                fieldLabel: OSS.Localize.get( 'Manager name' ),
                labelWidth: 160
            }, {
                xtype: 'textfield',
                fieldLabel: OSS.Localize.get( 'Login' ),
                name: 'login',
                allowBlank: false,
                labelWidth: 160,
                allowBlank: false,
                maskRe: new RegExp('[a-zA-Z0-9\_\-]')

            }, {
                xtype: 'textfield',
                inputType: 'password',
                itemId: 'password',
                fieldLabel: OSS.Localize.get( 'Password' ),
                name: 'pass',
                labelWidth: 160,
                maskRe: new RegExp('[a-zA-Z0-9\_\-]')
            }, {
                xtype: 'textfield',
                name: 'cash_register_folder',
                fieldLabel: OSS.Localize.get( 'Folder of cash register' ),
                labelWidth: 160
            }, {
                xtype: 'textfield',
                name: 'external_id',
                fieldLabel: OSS.Localize.get( 'External ID' ),
                labelWidth: 160
            }]
        }, {
            xtype: 'fieldset',
            border: false,
            columnWidth: 0.5,
            items: [{
                xtype: 'checkboxfield',
                fieldLabel: OSS.Localize.get( 'Show passwords' ),
                name: 'open_pass',
                labelWidth: 150
            }, {
                xtype: 'textfield',
                name: 'email',
                fieldLabel: 'Email',
                labelWidth: 150
            }, {
                xtype: 'textfield',
                name: 'office',
                fieldLabel: OSS.Localize.get( 'Office' ),
                labelWidth: 150
            }, {
                xtype: 'textareafield',
                name: 'descr',
                fieldLabel: OSS.Localize.get( 'Description' ),
                labelWidth: 150
            }, {
                xtype: 'combobox',
                name: 'pay_class_id',
                fieldLabel: OSS.Localize.get( 'Default payment category' ),
                labelWidth: 150,
                valueField: 'class_id',
                displayField: 'name',
                store: 'managers.Paycategories',
                allowBlank: false
            }]
        }]
    }]
});
