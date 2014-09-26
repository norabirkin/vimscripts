/**
 * Окно создания/редактирования услуг UsBox
 */
Ext.define('OSS.view.usbox.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.usboxwin',
    layout: 'fit',
    resizable: false,
    modal: true,
    items: [{
        xtype: 'form',
        padding: '10',
        frame: true,
        buttonAlign: 'center',
        items: [{
            xtype: 'datetime',
            fieldLabel: i18n.get('Since'),
            labelWidth: 150,
            allowBlank: false,
            name: 'time_from',
            defaultDate: null
        }, {
            xtype: 'datetime',
            fieldLabel: i18n.get('Till'),
            labelWidth: 150,
            hidden: true,
            name: 'time_to',
            defaultDate: null
        }, {
            xtype: 'datetime',
            fieldLabel: i18n.get('Tariff upon'),
            allowBlank: false,
            labelWidth: 150,
            name: 'activated',
            hidden: true,
            defaultDate: null
        }, {
            fieldLabel: i18n.get('Service'),
            showId: true,
            labelWidth: 150,
            width: 500,
            xtype: 'combo',
            name: 'cat_idx',
            displayField: 'descr',
            valueField: 'cat_idx',
            editable: false,
            queryMode: 'local',
            store: 'tariffs.Categories'
        }, {
            fieldLabel: i18n.get('Installment plan'),
            showId: true,
            labelWidth: 150,
            width: 500,
            xtype: 'combo',
            hidden: true,
            name: 'plan_id',
            displayField: 'name',
            defaultOption: {
                plan_id: 0,
                name: i18n.get('No')
            },
            value: 0,
            valueField: 'plan_id',
            editable: false,
            store: 'accounts.usbox.Installments'
        }, {
            fieldLabel: i18n.get('Quantity'),
            labelWidth: 150,
            width: 500,
            xtype: 'numberfield',
            name: 'mul',
            value: 1
        }, {
            fieldLabel: i18n.get('Comment'),
            labelWidth: 150,
            width: 500,
            xtype: 'textfield',
            name: 'comment'
        }, {
            fieldLabel: i18n.get('Not duplicate'),
            labelWidth: 150,
            hidden: true,
            xtype: 'checkbox',
            name: 'noduplicate'
        }, {
            title: i18n.get('The period of the discount'),
            itemId: 'period_of_discount',
            hidden: true,
            xtype: 'fieldset',
            items: [{
                fieldLabel: i18n.get('Since'),
                labelWidth: 140,
                width: 245,
                xtype: 'datefield',
                name: 'discount_time_from'
            }, {
                fieldLabel: i18n.get('Till'),
                labelWidth: 140,
                width: 245,
                xtype: 'datefield',
                name: 'discount_time_to'
            }]
        }, {
            fieldLabel: i18n.get('Discount type'),
            labelWidth: 150,
            width: 500,
            xtype: 'combo',
            name: 'disctype',
            displayField: 'name',
            valueField: 'id',
            editable: false,
            store: Ext.create('Ext.data.Store', {
                fields: [{
                    name: 'id',
                    type: 'string'
                }, {
                    name: 'name',
                    type: 'string'
                }],
                data: [{
                    id: 'discount',
                    name: i18n.get('Absolute')
                }, {
                    id: 'rate',
                    name: i18n.get('Coefficient')
                }]
            })
        }, {
            xtype: 'container',
            layout: 'card',
            itemId: 'discount_fields',
            items: [{
                fieldLabel: i18n.get('Ratio'),
                labelWidth: 150,
                width: 500,
                xtype: 'numberfield',
                name: 'rate',
                itemId: 'rate',
                decimalPrecision: 5,
                value: 1
            }, {
                fieldLabel: i18n.get('Discount'),
                labelWidth: 150,
                width: 500,
                xtype: 'numberfield',
                name: 'discount',
                itemId: 'discount',
                decimalPrecision: 5,
                value: 0
            }]
        }],
        buttons: [{
            xtype: 'button',
            itemId: 'save',
            formBind: true,
            text: i18n.get('Save')
        }, {
            xtype: 'button',
            text: i18n.get('Cancel')
        }]
    }]
});
