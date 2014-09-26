/**
 * Кнопка выбора адреса
 */
Ext.define('OSS.view.addresses.Button', {
    extend: 'Ext.form.FieldContainer',
    mixins: ['Ext.form.field.Field'],
    padding: '0 0 5 0',
    itemId: 'address',
    name: 'address',
    fieldLabel: i18n.get('Address'),
    layout: 'hbox',
    initComponent: function() {
        this.items = [{
            xtype: 'button',
            itemId: 'btn',
            iconCls: 'x-ibtn-address',
            tooltip: i18n.get('Address'),
            listeners: {
                click: Ext.bind(this.openWindow, this)
            }
        }, {
            xtype: 'tbspacer',
            width: 5
        }, {
            xtype: 'button',
            itemId: 'clear',
            iconCls: 'x-ibtn-clear',
            tooltip: i18n.get('Clear'),
            listeners: {
                click: Ext.bind(this.reset, this)
            }
        }, {
            xtype: 'tbspacer',
            width: 5
        }, {
            xtype: 'displayfield',
            flex: 1
        }];
        this.callParent(arguments);
        this.setValue(this.value);
        this.resetOriginalValue();
    },
    defaultValue: {
        type: 0,
        address: '',
        code: ''
    },
    /**
     * Присваивает значение полю
     */
    setValue: function(value) {
        var old = this.getValue(),
            __value = value || this.defaultValue;
        this.value = (typeof __value == 'string') ? Ext.JSON.decode(__value) : __value;
        this.down('displayfield').setValue(this.value.address);
        if (this.getValue() != old) {
            this.fireEvent('change', this, this.getValue());
        }
    },
    /**
     * Получает значение
     */
    getValue: function() {
        return Ext.JSON.encode(this.value);
    },
    /**
     * Открывает окно выбора адреса
     */
    openWindow: function() {
        Ext.app.Application.instance.getController('Addresses').openWindow({
            address: this.value,
            onSave: this.setValue,
            scope: this
        });
    },
    /**
     * Удаляет данные об адресе
     */
    reset: function() {
        this.setValue();
    }
});
