Ext.define('OSS.ux.form.field.combogrid.grid.TotalBar', {
    extend: 'Ext.toolbar.Toolbar',
    initComponent: function() {
        var total = Ext.create( 'Ext.toolbar.TextItem', {
            itemId: 'total',
            text: ''
        });
        this.setTotal = function(val) {
            total.setText(i18n.get({
                msg: '{i} entries found',
                params: {
                    '{i}': val
                }
            }));  
        };
        this.items = ['->', total];
        this.callParent(arguments);
    }
});
