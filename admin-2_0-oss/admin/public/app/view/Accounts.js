Ext.define("OSS.view.Accounts", {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.draw.Text',
        'OSS.ux.grid.column.Renderer'
    ],
    alias: 'widget.accounts',
    layout: 'card',
    frame: true,
    plain: true,
    title: i18n.get('Account entries'),
    initComponent: function() {
        this.items = [
            Ext.create('OSS.view.accounts.List'),
            Ext.create('OSS.view.accounts.Item')
        ];
        this.callParent(arguments);
    }
});
