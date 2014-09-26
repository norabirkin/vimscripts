Ext.define( 'OSS.ux.form.field.text.Search', {
    extend: 'Ext.form.field.Text', 
    mixins: ['OSS.ux.form.field.text.Delayed'],
    requires: ['OSS.helpers.Timeout'],
    alias: 'widget.delayedsearchfield',
    initComponent: function() {
        this.init();
        this.callParent(arguments);
    }
});
