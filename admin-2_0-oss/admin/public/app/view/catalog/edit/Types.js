Ext.define("OSS.view.catalog.edit.Types", {
    extend: 'OSS.view.catalog.Types',
    alias: 'widget.catalog_edit_types',
    allowBlank: false,
    validator: function() {
        if (this.getValue() == 1 || this.getValue() == 2 || this.getValue() == 3) {
            return true;
        } else {
            return OSS.Localize.get('Wrong type');
        }
    },
    labelWidth: 160,
    padding: '0 0 10 0'
});
