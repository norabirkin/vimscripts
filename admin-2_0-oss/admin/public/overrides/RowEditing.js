Ext.define('OSS.overrides.grid.plugin.RowEditing', function() {
    return {
        override: 'Ext.grid.plugin.RowEditing',
        setColumnField: function(column, field) {
            var me = this,
                editor = me.getEditor();
                
            editor.removeColumnEditor(column);
            Ext.grid.plugin.RowEditing.superclass.setColumnField.apply(this, arguments);
            me.getEditor().addFieldsForColumn(column, true);
            me.getEditor().insertColumnEditor(column);
            try {
                me.getEditor().onColumnResize(column);
            } catch(e) {
                field.on( 'afterrender', function(){
                    me.getEditor().onColumnResize(column);
                });
            }
        }
    };
}());
