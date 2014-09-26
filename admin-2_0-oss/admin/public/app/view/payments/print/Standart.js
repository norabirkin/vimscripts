Ext.define( "OSS.view.payments.print.Standart", {
    extend: "OSS.view.payments.Print",
    alias: 'widget.payments_print_standart',
    buttons: [{
        text: OSS.Localize.get('Print sales check'),
        itemId: 'standart',
        type: 'button'
    }]
});
