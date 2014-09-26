/**
 * Поле пароля, который может быть открытым или скрытым
 */
Ext.define('OSS.ux.form.field.Password', {
    extend: 'Ext.container.Container',
    itemId: 'wrap',
    flex: 1,
    layout: 'card',
    patternSetting: null,
    opened: true,
    initialValue: '',
    initComponent: function() {
        this.items = [{
            xtype: 'textfield',
            validator: Ext.bind(this.validator, this),
            itemId: 'open',
            name: 'pass',
            flex: 1
        }, {
            xtype: 'textfield',
            validator: Ext.bind(this.validator, this),
            itemId: 'hidden',
            name: 'pass',
            flex: 1,
            inputType: 'password'
        }];
        this.callParent(arguments);
        OSS.component.Profile.onChanged(this.patternSetting, this.isValid, this);
    },
    validator: function(value) {
        var pattern = OSS.component.Profile.get(this.patternSetting);
        if (!this.opened && value == this.initialValue) {
            return true;
        }
        if (!pattern) {
            return true;
        } else {
            if ((new RegExp(pattern)).test(value)) {
                return true;
            } else {
                return i18n.get('Value does not matches to pattern')+' "'+pattern+'"';
            }
        }
    },
    setOpen: function(state) {
        if (state) {
            this.opened = true;
            this.down('#open').enable();
            this.down('#hidden').disable();
            this.getLayout().setActiveItem(this.down('#open'));
        } else {
            this.opened = false;
            this.down('#hidden').enable();
            this.down('#open').disable();
            this.getLayout().setActiveItem(this.down('#hidden'));
        }
    },
    isValid: function() {
        this.getLayout().getActiveItem().isValid();
    },
    setValue: function(value) {
        var i,
            fields = this.query('field');
        for (i = 0; i < fields.length; i++) {
            fields[i].setValue(value);
        }
        this.initialValue = value;
    }
});
