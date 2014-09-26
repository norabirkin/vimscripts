/**
 * Override FieldSet
 */
Ext.define('OSS.overrides.Element', function() {
    return {
        override: 'Ext.form.FieldSet',
        
        finishRender: function() {
            this.callParent();
            
            if(this.defaultBackground === true) {
                this.getEl().addCls('x-fieldset-background');
            }
        }
    };
}());