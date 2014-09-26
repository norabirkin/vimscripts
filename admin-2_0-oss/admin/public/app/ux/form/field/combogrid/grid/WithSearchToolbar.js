Ext.define('OSS.ux.form.field.combogrid.grid.WithSearchToolbar', {
    extend: 'OSS.ux.form.field.combogrid.Grid',
    initComponent: function() {
        this.callParent(arguments);
        this.on('render', function() {
            var search = this.down('delayedsearchfield');
            search.store = this.store;
            search.setQueryDelay(this.queryDelay);
        });
    }
});
