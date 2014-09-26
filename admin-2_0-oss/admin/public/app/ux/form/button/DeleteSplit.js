Ext.define('OSS.ux.form.button.DeleteSplit', {
    extend: 'Ext.button.Split',
    alias: 'widget.delsplit',
    iconCls: 'x-ibtn-remove',
    menu: {
        items: [{
            itemId: 'clearAddress',
            text: i18n.get('Clear')
        }, {
            itemId: 'removeAddrEl',
            text: i18n.get('Delete')
        }]
    },
    handler: function(B) {
        B.showMenu();
    }
});
