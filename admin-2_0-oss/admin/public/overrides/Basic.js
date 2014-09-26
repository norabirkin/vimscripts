/**
 * Форма
 */
Ext.define('OSS.overrides.form.Basic', function() {
    return {
        override: 'Ext.form.Basic',
        findFieldsForSetValues: function(fieldId) {
            var fields = this.getFields().findBy(Ext.bind(
                this.conditionForSetValues,
                this
            ));
            if (fields) {
                fields = [fields];
            }
            return fields;
        },
        conditionForSetValues: function(f) {
            var found;

            if (Ext.Array.contains(
                this.skipForSetValueByRecord,
                this.fieldIdFormSetValues
            )) {
                return false;
            }

            found = (
                f.id === this.fieldIdFormSetValues ||
                f.getName() === this.fieldIdFormSetValues
            );

            if (!found) {
                found = f.data === this.fieldIdFormSetValues;
                if (found) {
                    this.setByRecord = true;
                    this.skipForSetValueByRecord.push(
                        this.fieldIdFormSetValues
                    );
                }
            }

            return found;
        },
        setFieldValueForSetValues: function(field, val) {
            var record = null;

            if (this.setByRecord) {
                if (val) {
                    record = field.getStore().createModel(
                        Ext.JSON.decode(val)
                    );
                }
                field.setValueByRecord(record);
            } else {
                field.setValue(val);
            }
            if (this.trackResetOnLoad) {
                field.resetOriginalValue();
            }
        },
        setValues: function(values) {
            var me = this,
                v,
                vLen,
                val,
                field;

            function setVal(fieldId, val) {
                var field,
                    i;
                
                me.setByRecord = false;
                me.skipForSetValueByRecord = [];
                me.fieldIdFormSetValues = fieldId;
                field = me.findFieldsForSetValues(fieldId);
                if (field) {
                    for (i = 0; i < field.length; i ++) {
                        me.setFieldValueForSetValues(field[i], val);
                    }
                }
            }

            // Suspend here because setting the value on a field could trigger
            // a layout, for example if an error gets set, or it's a display field
            Ext.suspendLayouts();
            if (Ext.isArray(values)) {
                // array of objects
                vLen = values.length;

                for (v = 0; v < Len; v++) {
                    val = values[v];

                    setVal(val.id, val.value);
                }
            } else {
                // object hash
                Ext.iterate(values, setVal);
            }
            Ext.resumeLayouts(true);
            return this;
        }
    };
}());
