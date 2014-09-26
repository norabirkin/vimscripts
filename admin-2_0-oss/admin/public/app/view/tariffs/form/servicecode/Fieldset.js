/**
 * Поле "Код услуги" для форм тарифа и категории тарифа
 */
Ext.define('OSS.view.tariffs.form.servicecode.Fieldset', {
    extend: 'Ext.form.FieldContainer',
    itemId: 'serviceCode',
    fieldLabel: i18n.get('Service code'),
    anchor: '100%',
    layout: 'hbox',
    initComponent: function() {
        var field = Ext.create('OSS.view.tariffs.form.servicecode.ComboGrid', {
                width: 220,
                pickerWidth: 500,
                margin: '0 5 0 0'
            }),
            button = Ext.create('Ext.button.Button', {
                itemId: 'clear',
                iconCls: 'x-ibtn-clear',
                tooltip: i18n.get('Clear'),
                handler: function() {
                    field.setValue(0);
                }
            }),
            display = Ext.create('Ext.form.field.Display', {
                margin: '0 0 0 5',
                width: 60,
                flex: 1
            }),
            setGaapDisplay = function() {
                if (!field.getValue()) {
                    display.setValue('');
                } else {
                    display.setValue(
                        field.getRecord().get('gaap')
                    );
                }
            },
            me = this;
        field.on('change', setGaapDisplay);
        this.items = [
            field,
            button,
            display
        ];
        this.callParent(arguments);
    }
});
