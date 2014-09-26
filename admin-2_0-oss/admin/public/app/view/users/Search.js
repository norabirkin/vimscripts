Ext.define('OSS.view.users.Search', {
    extend: 'Ext.container.Container',
    alias: 'widget.usersearch',
    layout: 'hbox',
    initComponent: function() {
        this.items = [];
        this.callParent(arguments);
    }
});
