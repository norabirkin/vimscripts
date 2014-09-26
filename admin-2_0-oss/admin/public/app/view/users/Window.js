Ext.define('OSS.view.users.Window', {
    extend: 'Ext.window.Window',
    requires: 'OSS.view.users.Select',
    alias: 'widget.userswin',
    title: i18n.get('Users'),
    height: 400,
    width: 750,
    layout: 'fit',
    resizable: false,
    modal: true,
    initComponent: function() {
        var store = Ext.create('OSS.store.Users');
        this.items = [{
            xtype: 'gridpanel',
            store: store,
            tbar: [{
                xtype: 'usersearch'
            }],
            bbar: {
                xtype: 'pagingtoolbar',
                store: store
            },
            columns: OSS.view.users.Select.columns()
        }];
        this.callParent(arguments);
    }
});
