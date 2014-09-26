Ext.define('OSS.overrides.form.field.Display', function() {
    return {
        override: 'Ext.form.field.Display',
        /**
         * Находит отображение значения в хранилище
         */
        valueToRaw: function(value) {
            var record;
            if (!this.store) {
                return this.callParent(arguments);
            }
            if (typeof this.store == 'string') {
                this.store = Ext.data.StoreManager.lookup(this.store);
            }
            record = this.findRecord(this.valueField, value);
            if (!record) {
                return this.callParent();
            }
            return record.get(this.displayField);
        },
        /**
         * Ищет запись в хранилище
         */
        findRecord: function(field, value) {
            var index = this.store.findExact(field, value);
            if (index == -1) {
                return null;
            }
            return this.store.getAt(index);
        },
        /**
         * Находит значени по отображению
         */
        rawToValue: function(raw) {
            var record;
            if (!this.store) {
                return this.callParent(arguments);
            }
            record = this.findRecord(this.displayField, raw);
            if (!record) {
                return this.callParent();
            }
            return record.get(this.valueField);
        }
    };
}());
