Ext.define( "OSS.view.payments.print.Negative", {
    extend: "OSS.view.payments.Print",
    alias: 'widget.payments_print_negative',
    buttons: [{
        text: OSS.Localize.get('Repayment'),
        itemId: 'return',
        type: 'button'
    }, {
        text: OSS.Localize.get('Withdrawals'),
        itemId: 'withdrawal',
        type: 'button'
    }]
});

