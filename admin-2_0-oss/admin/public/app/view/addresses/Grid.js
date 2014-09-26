Ext.define( 'OSS.view.addresses.Grid', {
    extend: 'OSS.ux.grid.editor.row.CheckboxSelection',
    height: 500,
    confirmRemove: true,
    deleteConfirm: {
        title: OSS.Localize.get("Confirm address item remove"), 
        msg: OSS.Localize.get("Do you realy want to remove address item?")
    },
    initComponent: function() {
        this.tbar = [Ext.create( 'OSS.ux.form.field.text.Search', {
            getParamName: function() { return 'name'; },
            store: this.store
        })];
        this.callParent( arguments );
    },
    defaultActions: function() {
        return [{ itemId: 'choose', text: OSS.Localize.get('Choose') }].concat(this.callParent(arguments));
    },
    getTypeColumn: function() {
        var store = Ext.create('OSS.store.addresses.Meaning');
        store.proxy.extraParams = { level: this.meaningLevel };
        return {
            header: OSS.Localize.get('Type'),
            dataIndex: 'short',
            editor: {
                xtype: 'combo',
                store: store,
                displayField: 'name',
                valueField: 'short'
            }
        }; 
    }
});
