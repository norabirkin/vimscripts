Ext.define('OSS.overrides.form.Panel', function() {
    return {
        override: 'Ext.form.Panel',
        /**
         * Загружает данные модели в форму и изменяет значения полей модели при изменении значений элементов формы
         */
        controllRecord: function(record, setters, scope) {
            var data = Ext.apply({}, record.getData()),
                i,
                __setters = setters || {},
                __scope = scope || {};
            if (__setters instanceof Array) {
                for (i in __setters) {
                    delete(data[setters[i]]);
                }
            } else {
                for (i in __setters) {
                    Ext.bind(__setters[i], __scope)(this.getForm().findField(i), record);
                    delete(data[i]);
                }
            }
            this.controlledRecord = record;
            this.getForm().setValues(data);
        },
        /**
         * Выполняется при изменении значения поля
         */
        onFieldChange: function(field) {
            var data;
            if (!this.controlledRecord) {
                return;
            }
            data = this.controlledRecord.getData();
            if (field.getName() in data) {
                this.controlledRecord.set(field.getName(), field.getValue());
            }
        },
        initComponent: function() {
            this.callParent(arguments);
            this.getForm().getFields().each(function(field) {
                field.on('change', this.onFieldChange, this);
            }, this);
            this.__originalValues = {};
            this.getForm().getFields().each(function(field) {
                this.__originalValues[field.getName()] = field.originalValue;
            }, this);
        },
        /**
         * Использует самые первые значения, как оригинальные
         */
        restoreOriginalValues: function() {
            this.getForm().getFields().each(function(field) {
                field.originalValue = this.__originalValues[field.getName()];
                field.checkDirty();
            }, this);
        },
        /**
         * После выполнения метода текущие значения формы будут считься оригинальными
         */
        resetOriginalValues: function() {
            this.getForm().getFields().each(function(field) {
                field.resetOriginalValue();
            });
            if (this.controlledRecord) {
                this.controlledRecord.commit(true);
            }
        }
    };
}());
