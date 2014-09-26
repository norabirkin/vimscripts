Ext.define('OSS.overrides.grid.column.Date', function() {
    return {
        override: 'Ext.grid.column.Date',
        dateFormat: 'Y-m-d H:i:s',
        defaultRenderer: function(value){
            value = this.callParent(arguments);
            if (!value || value == '' || value == '9999-12-31 23:59:59') {
                return '---';
            }
            return value;
        }
    };
}());
