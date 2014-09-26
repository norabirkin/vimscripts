Ext.define('OSS.ux.form.field.SafeCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.safecombo',
    setValue: function(v) {
        v = (v && v.toString) ? v.toString() : v;
        if(!this.store.isLoaded && this.queryMode == 'remote') {
            this.store.addListener('load', function() {
                this.store.isLoaded = true;
                this.setValue(v);
            }, this);
            this.store.load();
        } else {
            this.callOverridden(arguments);
        }
    }
});
