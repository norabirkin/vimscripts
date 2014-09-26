Ext.define('OSS.view.SearchTemplates', {
    extend: 'Ext.Window',
    alias: 'widget.searchtemplates',
    title: OSS.Localize.get('Search template'),
    width: 624,
    layout: 'fit',
    initComponent: function() {
        this.grid = Ext.create('OSS.view.users.searchtemplate.Grid', {
            combo: this.combo
        });
        this.items = [ this.grid ];
        this.callParent( arguments );
    },
    show: function() {
        this.callParent( arguments );
        this.grid.getTemplates();
    },
    close: function() {
        this.hide();
    }
});
