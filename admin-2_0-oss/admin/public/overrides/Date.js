Ext.define('OSS.overrides.form.field.Date', function() {
    return {
        override: 'Ext.form.field.Date',
        format: 'Y-m-d'
    };
}());
