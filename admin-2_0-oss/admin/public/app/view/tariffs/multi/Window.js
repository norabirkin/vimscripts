/**
 * Окно редактирования мультиарифа
 */
Ext.define('OSS.view.tariffs.multi.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.multitariffs',
    title: i18n.get('Edit multitariff'),
    width: 500,
    layout: 'fit',
    resizable: false,
    modal: true,
    buttonAlign: 'center',
    buttons: [{
        xtype: 'button',
        text: i18n.get('Save'),
        itemId: 'save'
    }],
    /**
     * Возвращает TRUE если тариф является мультитарифом и возвращает FALSE в противном случае
     */
    initComponent: function() {
        this.items = [{
            xtype: 'form',
            frame: true,
            padding: 10,
            items: [
                {
                    xtype: 'displayfield',
                    itemId: 'tar_new_name',
                    labelWidth: 50,
                    fieldLabel: i18n.get('Tarif')
                },
                Ext.create('OSS.ux.form.field.date.WithTime', {
                    fieldLabel: i18n.get('Since'),
                    labelWidth: 50,
                    itemId: 'change_time',
                    padding: '0 0 5 0'
                }),
                Ext.create('OSS.ux.form.field.date.WithTime', {
                    fieldLabel: i18n.get('Till'),
                    labelWidth: 50,
                    itemId: 'time_to',
                    padding: '0 0 5 0',
                    defaultDate: function() {
                        return null
                    }
                })
            ]
        }];
        this.callParent(arguments);
    }
});
