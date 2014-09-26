Ext.define('OSS.overrides.form.action.Action', function() {
    return {
        override: 'Ext.form.action.Action',
        createCallback: function() {
            return Ext.apply(this.callParent(arguments), {
                silent: this.silent,
                msg: this.msg
            });
        }
    };
}());
