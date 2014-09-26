Ext.define( 'OSS.view.payments.Print', {
    extend: "Ext.Window",
    alias: "widget.payments_print",
    title: OSS.Localize.get('Print sales check'),
    buttonAlign: 'center',
    width: 350,
    modal: true,
    initComponent: function() {
        this.callParent( arguments );
        this.getDockedItems("toolbar")[0].add(Ext.create("Ext.button.Button", {
            text: OSS.Localize.get("Cancel"),
            itemId: "cancel"
        }));
    }
});
