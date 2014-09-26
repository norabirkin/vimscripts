Ext.define('OSS.view.catalog.zones.classes.Grid', {
    extend: 'OSS.ux.grid.editor.row.CheckboxSelection',
    alias: 'widget.telclassesgrid',
    store: "catalog.zones.Classes",
    columns: [
        { header: 'ID', dataIndex: 'id' },
        { header: OSS.Localize.get( 'Title' ), dataIndex: 'name', editor: { xtype: 'textfield' } },
        { header: OSS.Localize.get( 'Description' ), dataIndex: 'descr', flex: 1, editor: { xtype: 'textfield' } }
    ]
});
