Ext.define( 'OSS.view.payments.tabs.promised.BaseForm', {
    extend: 'Ext.form.Basic',
    getBoundItems: function() {
        var boundItems = this.callParent( arguments );
        delete this._boundItems;
        return boundItems;
    }
});
