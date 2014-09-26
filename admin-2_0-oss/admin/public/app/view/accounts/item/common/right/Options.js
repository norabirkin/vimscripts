/**
 * Группа полей для опций
 *
 * ref: 'accounts > #form > #common > #right > #options'
 */
Ext.define('OSS.view.accounts.item.common.right.Options', {
    extend: 'Ext.form.FieldSet',
    padding: '10',
    itemId: 'options',
    layout: 'hbox',
    hidden: true,
    licid: 'full',
    defaultBackground: true,
    initComponent: function() {
        var nlabel = 200,
            nwidth = nlabel + 100;
        this.items = [{
            xtype: 'container',
            padding: '0 20 0 0',
            items: [{
                xtype: 'numberfield',
                hidden: true,
                labelWidth: nlabel,
                width: nwidth,
                fieldLabel: i18n.get('Shape rate') + ' (' + i18n.get('Kbit') + '/' + i18n.get('sec-s') + ')',
                name: 'shape'
            }, {
                xtype: 'numberfield',
                hidden: true,
                labelWidth: nlabel,
                width: nwidth,
                fieldLabel: i18n.get('Sessions at the moment'),
                value: 1,
                name: 'max_sessions'
            }, {
                xtype: 'numberfield',
                hidden: true,
                labelWidth: nlabel,
                width: nwidth,
                fieldLabel: i18n.get('CyberCrypt card number'),
                name: 'cu_id'
            }]
        }, {
            xtype: 'container',
            hidden: true,
            itemId: 'ethernet',
            padding: '0 0 0 10',
            items: [{
                xtype: 'checkbox',
                labelWidth: 150,
                fieldLabel: i18n.get('Take account of') + ' ' + i18n.get('resource'),
                inputValue: 1,
                name: 'ip_det'
            }, {
                xtype: 'checkbox',
                labelWidth: 150,
                fieldLabel: i18n.get('Take account of') + ' ' + i18n.get('port'),
                inputValue: 1,
                name: 'port_det'
            }]
        }];
        this.callParent(arguments);
    }
});
