Ext.define('OSS.ux.grid.column.Renderer', {
    singleton: true,
    render: function(value) {
        var checkedSuffix = (value == 1) ? " "  + Ext.baseCSSPrefix + "grid-checkcolumn-checked" : "";
        return '<div class="' + Ext.baseCSSPrefix + 'grid-checkcolumn' + checkedSuffix + '">&#160;</div>';
    }
});
