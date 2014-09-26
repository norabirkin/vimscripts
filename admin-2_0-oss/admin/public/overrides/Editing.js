Ext.define('OSS.overrides.grid.plugin.Editing', function() {
    return {
        override: 'Ext.grid.plugin.Editing',
        createColumnField:  function(columnHeader, defaultField) {
            var field = this.callParent( arguments );
            if (!field) { return field; }
            field.name = columnHeader.dataIndex;
            return field;
        }
    };
}());
